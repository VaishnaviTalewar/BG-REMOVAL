import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../model/userModel.js";

export const removeBg = async (req, res) => {
  try {

    const clerkId = req.clerkId;

    const user = await userModel.findOne({ clerkId });

    if (!user || user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credits left"
      });
    }

    const imagePath = req.file.path;

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));
    formData.append("size", "auto");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_API_KEY
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