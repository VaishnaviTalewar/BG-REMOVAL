import { Webhook } from "svix";
import userModel from "../model/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 1️⃣ create Svix webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2️⃣ verify webhook with raw Buffer and headers
    const payload = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // 3️⃣ Destructure verified payload
    const { data, type } = payload;

    switch (type) {
      case "user.created":
        await userModel.create({
          clerkId: data.user.id,
          email: data.user.email_addresses[0]?.email_address || "",
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          photo: data.user.image_url || "",
        });
        console.log("User Created:", data.user.id);
        break;

      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.user.id },
          {
            email: data.user.email_addresses[0]?.email_address || "",
            firstName: data.user.first_name || "",
            lastName: data.user.last_name || "",
            photo: data.user.image_url || "",
          },
          { upsert: true }
        );
        console.log("User Updated:", data.user.id);
        break;

      case "user.deleted":
        await userModel.findOneAndDelete({ clerkId: data.user.id });
        console.log("User Deleted:", data.user.id);
        break;

      default:
        console.log("Unhandled event type:", type);
    }

    // 4️⃣ Respond success after DB operation
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};