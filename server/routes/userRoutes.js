import express from "express";
import { authUser } from "../middleware/Auth.js";
import { userCredit, updateCredits, paymentRazorPay, verifyRazorPay, saveUserProfile, ensureUser } from "../controller/userController.js";

const userRouter = express.Router();

// test route
userRouter.get("/", (req, res) => {
  res.send("User API working");
});

// get credits
userRouter.get("/credits", authUser, userCredit);

// ensure user exists with default credits
userRouter.post("/ensure", authUser, ensureUser);

// save or update user profile
userRouter.post("/profile", authUser, saveUserProfile);

// update credits
userRouter.post("/update-credits", authUser, updateCredits);

//for razorpay
userRouter.post("/pay-razorpay", authUser, paymentRazorPay);

//verify razorpay
userRouter.post("/verify-razorpay", authUser, verifyRazorPay);

export default userRouter;