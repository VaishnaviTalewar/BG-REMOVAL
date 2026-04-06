import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.json({
        success: false,
        message: "Not authorized. Login again."
      });
    }

    // "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    const token_decode = jwt.decode(token);

    // Clerk user id
    req.clerkId = token_decode.sub;

    next();

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};