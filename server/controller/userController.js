import { Webhook } from "svix";
import userModel from "../model/userModel.js";


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



// GET USER CREDITS
export const userCredit = async (req, res) => {
  try {

    const clerkId = req.clerkId;

    const user = await userModel.findOne({ clerkId });

    // IMPORTANT FIX
    if (!user) {
      return res.json({
        success: false,
        credits: 0,
        message: "User not found in database"
      });
    }

    res.json({
      success: true,
      credits: user.creditBalance
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }
};