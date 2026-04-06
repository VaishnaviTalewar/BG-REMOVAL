import express from "express";
import { authUser } from "../middleware/Auth.js";
import { userCredit } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("User API working");
});

userRouter.get("/credits", authUser, userCredit);

export default userRouter;