import { verifyToken } from "@clerk/express";

export const authUser = async (req, res, next) => {
  try {

    console.log("authUser called");
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log("token:", token ? "present" : "missing");

    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const payload = await verifyToken(token);
    console.log("payload:", payload);

    const userId = payload.sub;
    console.log("userId:", userId);

    if (!userId) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    req.clerkId = userId;
    console.log("req.clerkId set to:", req.clerkId);

    next();

  } catch (error) {
    console.log("error in authUser:", error);
    res.json({ success: false, message: error.message });
  }
};