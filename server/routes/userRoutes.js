import express from "express";
import { authUser } from "../middleware/Auth.js";
import { userCredit } from "../controller/userController.js";

const userRouter = express.Router();

// test route
userRouter.get("/", (req, res) => {
  res.send("User API working");
});

// get credits
userRouter.get("/credits", authUser, userCredit);

export default userRouter;