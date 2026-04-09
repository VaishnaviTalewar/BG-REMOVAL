import express from "express";
import { removeBg } from "../controller/imgController.js";
import { upload } from "../middleware/multer.js";
import { authUser } from "../middleware/Auth.js";

const imgRouter = express.Router();

// Remove Background API
imgRouter.post(
  "/remove-bg",
  authUser,                 //  pehle user authenticate hoga
  upload.single("image"),   //  fir image upload hogi
  removeBg               // fir controller run hoga
);

export default imgRouter;