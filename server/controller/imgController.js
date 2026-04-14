import axios from "axios";
import FormData from "form-data";
import userModel from "../model/userModel.js";

export const removeBg = async (req, res) => {
  try {
    const clerkId = req.clerkId;

    let user = await userModel.findOne({ clerkId });

    // create user if not exists
    if (!user) {
      user = await userModel.create({
        clerkId,
        creditBalance: 5,
      });
    }

    // check credits
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credits left",
      });
    }

    // check file
    if (!req.file) {
      return res.json({
        success: false,
        message: "No image uploaded",
      });
    }

    const formData = new FormData();

    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
        validateStatus: () => true,
      }
    );

    // DEBUG LOGS (IMPORTANT)
    console.log("STATUS:", response.status);
    console.log("CONTENT-TYPE:", response.headers["content-type"]);

    // API FAIL CHECK
    if (response.status !== 200) {
      console.log("API ERROR:", response.data.toString());

      return res.json({
        success: false,
        message: "Background removal failed",
        error: response.data.toString(),
      });
    }

    const contentType = response.headers["content-type"] || "";

    // NOT IMAGE CHECK (FIXED)
    if (!contentType.includes("image")) {
      console.log("INVALID RESPONSE:", response.data.toString());

      return res.json({
        success: false,
        message: "Invalid response from API",
        error: response.data.toString(),
      });
    }

    // convert image to base64
    const base64Image = Buffer.from(response.data).toString("base64");

    const resultImage = `data:${contentType};base64,${base64Image}`;

    // deduct credit
    user.creditBalance -= 1;
    await user.save();

    return res.json({
      success: true,
      resultImage,
      credits: user.creditBalance,
    });

  } catch (error) {
    console.log("SERVER ERROR:", error.response?.data || error.message);

    return res.json({
      success: false,
      message: "Server error",
    });
  }
};