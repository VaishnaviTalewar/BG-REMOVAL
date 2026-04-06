import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../model/userModel.js";

export const removeBgImg = async (req, res) => {
  try {

    const clerkId = req.clerkId;

    const user = await userModel.findOne({ clerkId });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient credits",
        creditBalance: user.creditBalance
      });
    }

    // check file
    if (!req.file) {
      return res.json({
        success: false,
        message: "Image not uploaded"
      });
    }

    const imgPath = req.file.path;

    console.log("Image path:", imgPath);
    console.log("Credits Before:", user.creditBalance);

    const imgFile = fs.createReadStream(imgPath);

    const formData = new FormData();
    formData.append("image_file", imgFile);

    // call clipdrop API
    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders()
        },
        responseType: "arraybuffer"
      }
    );

    const base64Img = Buffer.from(response.data).toString("base64");

    const resultImg = `data:${req.file.mimetype};base64,${base64Img}`;

    // deduct credit
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { $inc: { creditBalance: -1 } },
      { returnDocument: "after" }
    );

    console.log("Credits After:", updatedUser.creditBalance);

    // delete uploaded file
    fs.unlinkSync(imgPath);

    res.json({
      success: true,
      resultImg,
      creditBalance: updatedUser.creditBalance
    });

  } catch (error) {

    console.log("Remove BG Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Image processing failed"
    });

  }
};
