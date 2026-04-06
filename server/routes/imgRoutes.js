import express from "express";
import { removeBgImg } from "../controller/imgController.js";
import { upload } from "../middleware/multer.js";
import { authUser } from './../middleware/Auth.js';

const imgRouter = express.Router()

imgRouter.post("/remove-bg",upload.single("image"),authUser,removeBgImg);

export default imgRouter;
