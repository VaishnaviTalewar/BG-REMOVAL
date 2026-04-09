import { Webhook } from "svix";
import { clerkClient } from "@clerk/express";
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