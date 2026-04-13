import axios from "axios";
import FormData from "form-data";
import userModel from "../model/userModel.js";

export const removeBg = async (req, res) => {
  try {

    const clerkId = req.clerkId;

    let user = await userModel.findOne({ clerkId });

    // If user not found, create with default credits
    if (!user) {
      user = await userModel.create({
        clerkId,
        creditBalance: 5
      });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credits left"
      });
    }

    if (!req.file) {
      return res.json({
        success: false,
        message: "No image uploaded"
      });
    }

    const formData = new FormData();

    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY
        },
        responseType: "arraybuffer"
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    user.creditBalance -= 1;
    await user.save();

    res.json({
      success: true,
      resultImage,
      credits: user.creditBalance
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message
    });

  }
};