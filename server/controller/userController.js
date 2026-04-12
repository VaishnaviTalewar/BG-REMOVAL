import { Webhook } from "svix";
import { clerkClient } from "@clerk/express";
import userModel from "../model/userModel.js";
import razorpay from "razorpay"


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
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({
      clerkId
    })

    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid user or plan" })
    }
    let credits, plan, amount, date

    switch (planId) {
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
        break;
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