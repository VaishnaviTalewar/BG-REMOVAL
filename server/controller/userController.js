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

    // 3️⃣ Determine where the user object is
    const userObj = data.user || data;

    // 4️⃣ Build user data safely
    const userData = {
      clerkId: userObj.id,
      email: userObj.email_addresses?.[0]?.email_address || "",
      firstName: userObj.first_name || "",
      lastName: userObj.last_name || "",
      photo: userObj.image_url || "",
    };

    // 5️⃣ Handle events
    if (type === "user.created") {
      try {
        const newUser = await userModel.create(userData);
        console.log("User Created & Saved:", newUser.clerkId);
      } catch (dbErr) {
        console.error("Mongoose save error:", dbErr.message);
      }
    } else if (type === "user.updated") {
      try {
        const updatedUser = await userModel.findOneAndUpdate(
          { clerkId: userObj.id },
          userData,
          { new: true, upsert: true }
        );
        console.log("User Updated:", updatedUser?.clerkId);
      } catch (dbErr) {
        console.error("Mongoose update error:", dbErr.message);
      }
    } else if (type === "user.deleted") {
      try {
        const deletedUser = await userModel.findOneAndDelete({ clerkId: userObj.id });
        console.log("User Deleted:", deletedUser?.clerkId);
      } catch (dbErr) {
        console.error("Mongoose delete error:", dbErr.message);
      }
    } else {
      console.log("Unhandled event type:", type);
    }

    // 6️⃣ Respond to Clerk
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};