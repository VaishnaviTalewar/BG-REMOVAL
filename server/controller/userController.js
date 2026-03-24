import { Webhook } from "svix";
import userModel from "../model/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {

    // create webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // verify webhook payload
    const evt = whook.verify(req.body, req.headers);

    const { data, type } = evt;

    switch (type) {

      // when new user signs up
      case "user.created":
        await userModel.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        });
        console.log("User Created");
        break;

      // when user updates profile
      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses[0].email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            photo: data.image_url,
          }
        );
        console.log("User Updated");
        break;

      // when user deletes account
      case "user.deleted":
        await userModel.findOneAndDelete({ clerkId: data.id });
        console.log("User Deleted");
        break;

      // login event
      case "session.created":
        console.log("User Logged In:", data.user_id);
        break;

      // logout event
      case "session.removed":
        console.log("User Logged Out:", data.user_id);
        break;

      default:
        console.log("Unhandled event:", type);
    }

    // success response
    res.status(200).json({ success: true });

  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};