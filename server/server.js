import "dotenv/config";
import express from "express";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imgRouter from "./routes/imgRoutes.js";
import { clerkWebhooks } from "./controller/userController.js";

const app = express();

// JSON middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Clerk-Id");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// Webhook route (RAW body required)
app.post(
  "/api/user/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Routes
app.use("/api/user", userRouter);
app.use("/api/img", imgRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API working" });
});

// IMPORTANT FIX: DB connect FIRST then server start
const startServer = async () => {
  try {
    console.log("Connecting to DB...");

    await connectDB(); // MUST WAIT HERE

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(" Server running on port", PORT);
    });

  } catch (error) {
    console.log(" Server failed:", error.message);
    process.exit(1);
  }
};

startServer();