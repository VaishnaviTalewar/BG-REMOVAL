import "dotenv/config";
import express from "express";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imgRouter from "./routes/imgRoutes.js";
import { clerkWebhooks } from "./controller/userController.js";
import { requireAuth } from "@clerk/express";

const app = express();

// connect database
connectDB();

// CORS fix
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Clerk-Id"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// clerk webhook
app.post(
  "/api/user/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// Clerk auth middleware
// app.use(requireAuth());

// routes
app.use("/api/user", userRouter);
app.use("/api/img", imgRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "API working" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;