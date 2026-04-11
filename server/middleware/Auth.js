import { verifyToken } from "@clerk/express";

export const authUser = async (req, res, next) => {
  try {

    console.log("authUser called");
    const rawAuth = req.headers.authorization;
    const token = rawAuth?.replace("Bearer ", "");
    const headerClerkId = req.headers["x-clerk-id"];

    console.log("token:", token ? "present" : "missing");
    console.log("x-clerk-id:", headerClerkId ? headerClerkId : "missing");

    let userId = headerClerkId || null;

    if (!userId && token) {
      if (!process.env.CLERK_JWT_KEY) {
        console.log("CLERK_JWT_KEY not configured; skipping token verification.");
      } else {
        try {
          const payload = await verifyToken(token);
          console.log("payload:", payload);
          if (payload?.sub) {
            userId = payload.sub;
            console.log("userId from token:", userId);
          }
        } catch (tokenError) {
          console.log("token verification failed, using header fallback if available:", tokenError.message);
        }
      }
    }

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