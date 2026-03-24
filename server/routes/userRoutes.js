import express from "express";
const userRouter = express.Router();

// Only normal user routes, no webhook here
// Example: get all users
userRouter.get("/", (req, res) => {
  res.send("User API working");
});

export default userRouter;