import express from "express";
import { authUser } from "../middleware/Auth.js";
import { userCredit, updateCredits } from "../controller/userController.js";

const userRouter = express.Router();

// test route
userRouter.get("/", (req, res) => {
  res.send("User API working");
});

// get credits
userRouter.get("/credits", authUser, userCredit);

// update credits
userRouter.post("/update-credits", authUser, updateCredits);

export default userRouter;