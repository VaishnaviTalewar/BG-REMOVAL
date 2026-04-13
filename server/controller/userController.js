import { Webhook } from "svix";
import { clerkClient } from "@clerk/express";
import userModel from "../model/userModel.js";
import TransactionModel from "../model/transcationModel.js";
import razorpay from "razorpay"
import crypto from "crypto"


// CLERK WEBHOOK
export const clerkWebhooks = async (req, res) => {
  try {

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const evt = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const eventType = evt.type;


    // CREATE USER
    if (eventType === "user.created") {

      const userData = {
        clerkId: id,
        email: email_addresses[0].email_address,
        firstname: first_name,
        lastname: last_name,
        photo: image_url,
        creditBalance: 5
      };

      await userModel.create(userData);
    }


    // DELETE USER
    if (eventType === "user.deleted") {
      await userModel.findOneAndDelete({ clerkId: id });
    }

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// UPDATE USER CREDITS
export const updateCredits = async (req, res) => {
  try {
    const { planId } = req.body;
    const clerkId = req.clerkId;

    let user = await userModel.findOne({ clerkId });

    // If user not found, create with default credits
    if (!user) {
      user = await userModel.create({
        clerkId,
        creditBalance: 5
      });
    }

    // Define credits for plans
    const creditPlans = {
      'Basic': 100,
      'Advanced': 500,
      'Business': 5000
    };

    const creditsToAdd = creditPlans[planId];

    if (!creditsToAdd) {
      return res.json({ success: false, message: 'Invalid plan' });
    }

    user.creditBalance += creditsToAdd;
    await user.save();

    res.json({
      success: true,
      credits: user.creditBalance,
      message: `${creditsToAdd} credits added`
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// GET USER CREDITS
export const userCredit = async (req, res) => {
  try {

    console.log("userCredit called");
    const clerkId = req.clerkId;
    console.log("clerkId:", clerkId);

    let user = await userModel.findOne({ clerkId });
    console.log("user found:", user);

    // If user not found, create with default credits
    if (!user) {
      console.log("creating user");
      user = await userModel.create({
        clerkId,
        creditBalance: 5
      });
      console.log("user created:", user);
    }

    res.json({
      success: true,
      credits: user.creditBalance
    });

  } catch (error) {
    console.log("error in userCredit:", error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

//razorpay gateway instance

export const razorPayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

//api to make payemnt for crdits

export const paymentRazorPay = async (req, res) => {
  try {
    const { planId } = req.body;
    const clerkId = req.clerkId;
    const userData = await userModel.findOne({
      clerkId
    })

    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid user or plan" })
    }
    let credits, plan, amount, date

    const planLower = planId.toLowerCase();
    switch (planLower) {
      case "basic":
        credits = 100;
        plan = "Basic";
        amount = 10;
        break;

      case "advanced":
        credits = 500;
        plan = "Advanced";
        amount = 50;
        break;

      case "business":
        credits = 5000;
        plan = "Business";
        amount = 250;
        break;

      default:
        return res.json({ success: false, message: "Invalid plan" })
    }

    date = Date.now()

    //creating trasaction in razorpay
    const transactionData = {
      clerkId,
      plan,
      credits,
      amount,
      date
    }

    const newTransaction = await TransactionModel.create(transactionData)
    const options = {
      amount: amount * 100,//amount in paise
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString()
    }

    await razorPayInstance.orders.create(options, async (err, order) => {
      if (err) {
        return res.json({ success: false, message: err.message })
      }

      res.json({ success: true, order })
    })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

//api to verify payment for credits
export const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, message: 'Invalid payment response from Razorpay' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.json({ success: false, message: 'Invalid Signature' });
    }

    const orderInfo = await razorPayInstance.orders.fetch(razorpay_order_id);
    const paymentInfo = await razorPayInstance.payments.fetch(razorpay_payment_id);

    const isPaid =
      orderInfo?.status === 'paid' ||
      paymentInfo?.status === 'captured' ||
      paymentInfo?.status === 'authorized';

    if (!isPaid) {
      return res.json({ success: false, message: `Payment not completed (status: ${paymentInfo?.status || orderInfo?.status})` });
    }

    const transactionData = await TransactionModel.findById(orderInfo.receipt);
    if (!transactionData) {
      return res.json({ success: false, message: 'Transaction not found' });
    }

    if (transactionData.payment) {
      return res.json({ success: false, message: 'Payment Already Verified' });
    }

    const userData = await userModel.findOne({ clerkId: transactionData.clerkId });
    if (!userData) {
      return res.json({ success: false, message: 'User not found' });
    }

    const creditBalance = userData.creditBalance + transactionData.credits;
    await userModel.findByIdAndUpdate(userData._id, { creditBalance });
    await TransactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

    res.json({ success: true, message: 'Credits Added' });
  } catch (error) {
    console.log('verifyRazorPay error:', error);
    res.json({ success: false, message: error.message });
  }
}