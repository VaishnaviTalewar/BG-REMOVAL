import express from "express";
import { authUser } from "../middleware/Auth.js";
import { userCredit } from "../controller/userController.js";
const userRouter = express.Router();

// Only normal user routes, no webhook here
// Example: get all users
userRouter.get("/", (req, res) => {
  res.send("User API working");
});

userRouter.get("/credits",authUser,userCredit)
export default userRouter;