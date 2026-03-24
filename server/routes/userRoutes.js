import express from "express";
import { clerkWebhooks } from "../controller/userController.js";

const userRouter = express.Router();

// Webhook route 
userRouter.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

export default userRouter;