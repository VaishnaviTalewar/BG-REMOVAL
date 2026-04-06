import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import { clerkWebhooks } from "./controller/userController.js";
import userRouter from "./routes/userRoutes.js";
import imgRouter from './routes/imgRoutes.js';

const PORT = process.env.PORT || 4000;
const app = express();

// Connect MongoDB
await connectDB();

// CORS
app.use(cors());
// Webhook route first (raw body required by Svix/Clerk)
app.post("/api/user/webhooks", express.raw({ type: "application/json" }), clerkWebhooks);

// JSON middleware for all other routes
app.use(express.json());

// User API routes
app.use("/api/user", userRouter);

//for bg removal routes
app.use("/api/img", imgRouter)

// Test endpoint
app.get("/", (req, res) => {
  res.json("API working..!!");
});

// Start server
app.listen(PORT, () => {
  console.log("Server Running on port", PORT);
});