// controller/userController.js
import { Webhook } from "svix";
import userModel from "../model/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // Create Svix webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook using raw buffer
    const payload = whook.verify(req.body, req.headers);

    // Extract event type and data
    const { type, data } = payload;

    // Debug: log the payload for testing
    console.log("Webhook Payload:", JSON.stringify(payload, null, 2));

    switch (type) {
      // ✅ New user signup
      case "user.created":
        await userModel.create({
          clerkId: data.id || data.user?.id || "unknown",
          email: data.email_addresses?.[0]?.email_address || "",
          firstName: data.first_name || data.user?.first_name || "",
          lastName: data.last_name || data.user?.last_name || "",
          photo: data.image_url || data.user?.image_url || "",
        });
        console.log("User Created:", data.id || data.user?.id);
        break;

      // ✅ User profile updated
      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.id || data.user?.id },
          {
            email: data.email_addresses?.[0]?.email_address || "",
            firstName: data.first_name || data.user?.first_name || "",
            lastName: data.last_name || data.user?.last_name || "",
            photo: data.image_url || data.user?.image_url || "",
          },
          { upsert: true } // create if doesn't exist
        );
        console.log("User Updated:", data.id || data.user?.id);
        break;

      // ✅ User deleted
      case "user.deleted":
        await userModel.findOneAndDelete({ clerkId: data.id || data.user?.id });
        console.log("User Deleted:", data.id || data.user?.id);
        break;

      // ✅ User login event
      case "session.created":
        console.log("User Logged In:", data.user_id || data.user?.id);
        break;

      // ✅ User logout event
      case "session.removed":
        console.log("User Logged Out:", data.user_id || data.user?.id);
        break;

      default:
        console.log("Unhandled event type:", type);
    }

    // Respond to Clerk that webhook is processed
    res.status(200).json({ success: true });

  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};