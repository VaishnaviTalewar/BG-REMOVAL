import { clerkClient } from "@clerk/express";

export const authUser = async (req, res, next) => {
  try {

    const { userId } = req.auth;

    if (!userId) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    req.clerkId = userId;

    next();

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};