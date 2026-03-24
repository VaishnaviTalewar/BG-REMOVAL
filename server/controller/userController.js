import { Webhook } from "svix";
import userModel from "../model/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // req.body is already raw (Buffer), no stringify
    const payload = whook.verify(req.body, req.headers);

    const { data, type } = payload;

    switch (type) {

      case "user.created":
        await userModel.create({
          clerkId: data.user.id,
          email: data.user.email_addresses[0].email_address,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          photo: data.user.image_url,
        });
        console.log("User Created:", data.user.id);
        break;

      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.user.id },
          {
            email: data.user.email_addresses[0].email_address,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            photo: data.user.image_url,
          }
        );
        console.log("User Updated:", data.user.id);
        break;

      case "user.deleted":
        await userModel.findOneAndDelete({ clerkId: data.user.id });
        console.log("User Deleted:", data.user.id);
        break;

      case "session.created":
        console.log("User Logged In:", data.user.id);
        break;

      case "session.removed":
        console.log("User Logged Out:", data.user.id);
        break;

      default:
        console.log("Unhandled event:", type);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};