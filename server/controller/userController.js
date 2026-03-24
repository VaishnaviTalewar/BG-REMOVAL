import { Webhook } from "svix";
import userModel from "../model/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook with raw buffer
    const payload = whook.verify(req.body, req.headers);

    const { data, type } = payload;

    switch (type) {
      case "user.created":
        await userModel.create({
          clerkId: data.id || data.user?.id,
          email: data.email_addresses[0]?.email_address || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          photo: data.image_url || "",
        });
        console.log("User Created:", data.id || data.user?.id);
        break;

      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.id || data.user?.id },
          {
            email: data.email_addresses[0]?.email_address || "",
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            photo: data.image_url || "",
          },
          { upsert: true }
        );
        console.log("User Updated:", data.id || data.user?.id);
        break;

      case "user.deleted":
        await userModel.findOneAndDelete({ clerkId: data.id || data.user?.id });
        console.log("User Deleted:", data.id || data.user?.id);
        break;

      case "session.created":
        console.log("User Logged In:", data.user_id);
        break;

      case "session.removed":
        console.log("User Logged Out:", data.user_id);
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