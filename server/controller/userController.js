import { Webhook } from "svix";
import userModel from "../model/userModel.js";

// CLERK WEBHOOK

export const clerkWebhooks = async (req, res) => {
  try {

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = payload;

    const userObj = data.user || data;

    const userData = {
      clerkId: userObj.id,
      email: userObj.email_addresses?.[0]?.email_address || "",
      firstName: userObj.first_name || "",
      lastName: userObj.last_name || "",
      photo: userObj.image_url || "",
    };

    // USER CREATED 

    if (type === "user.created") {

      const newUser = await userModel.create(userData);

      console.log("User Created:", newUser.clerkId);
    }

    // USER UPDATED

    else if (type === "user.updated") {

      const updatedUser = await userModel.findOneAndUpdate(
        { clerkId: userObj.id },
        userData,
        { new: true, upsert: true }
      );

      console.log("User Updated:", updatedUser?.clerkId);
    }

    // USER DELETED

    else if (type === "user.deleted") {

      const deletedUser = await userModel.findOneAndDelete({
        clerkId: userObj.id,
      });

      console.log("User Deleted:", deletedUser?.clerkId);
    }

    res.status(200).json({ success: true });

  } catch (error) {

    console.log("Webhook Error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// GET USER CREDITS

export const userCredit = async (req, res) => {
  try {

    const clerkId = req.clerkId;

    const userData = await userModel.findOne({ clerkId });

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      credits: userData.creditBalance,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};