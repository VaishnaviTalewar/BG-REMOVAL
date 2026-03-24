import { Webhook } from "svix";
import userModel from "../model/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 1️⃣ Create webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2️⃣ Verify webhook using raw buffer
    const payload = whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = payload;

    // 3️⃣ Handle events
    if (type === "user.created") {
      const newUser = await userModel.create({
        clerkId: data.user.id,
        email: data.user.email_addresses[0]?.email_address || "",
        firstName: data.user.first_name || "",
        lastName: data.user.last_name || "",
        photo: data.user.image_url || "",
      });
      console.log("User Created & Saved:", newUser);
    } else if (type === "user.updated") {
      const updatedUser = await userModel.findOneAndUpdate(
        { clerkId: data.user.id },
        {
          email: data.user.email_addresses[0]?.email_address || "",
          firstName: data.user.first_name || "",
          lastName: data.user.last_name || "",
          photo: data.user.image_url || "",
        },
        { new: true, upsert: true }
      );
      console.log("User Updated:", updatedUser);
    } else if (type === "user.deleted") {
      const deletedUser = await userModel.findOneAndDelete({ clerkId: data.user.id });
      console.log("User Deleted:", deletedUser);
    } else {
      console.log("Unhandled event type:", type);
    }

    // 4️⃣ Respond to Clerk
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};