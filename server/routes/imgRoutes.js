import express from "express";
import { removeBg } from "../controller/imgController.js";
import { upload } from "../middleware/multer.js";
import { authUser } from "../middleware/Auth.js";

const imgRouter = express.Router();

// Remove Background API
imgRouter.post(
  "/remove-bg",
  authUser,              // user authenticate
  upload.single("image"), // image upload
  removeBg               // controller
);

export default imgRouter;