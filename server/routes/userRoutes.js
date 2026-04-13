import express from "express";
import { authUser } from "../middleware/Auth.js";
import { userCredit, updateCredits, paymentRazorPay, verifyRazorPay } from "../controller/userController.js";

const userRouter = express.Router();

// test route
userRouter.get("/", (req, res) => {
  res.send("User API working");
});

// get credits
userRouter.get("/credits", authUser, userCredit);

// update credits
userRouter.post("/update-credits", authUser, updateCredits);

//for razorpay
userRouter.post("/pay-razorpay",authUser,paymentRazorPay)

//verify razorpay
userRouter.post("/verify-razorpay",authUser,verifyRazorPay)

export default userRouter;