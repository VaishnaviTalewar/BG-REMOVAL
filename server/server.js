import "dotenv/config"
import express from "express"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import { clerkWebhooks } from "./controller/userController.js"
import userRouter from "./routes/userRoutes.js"

const PORT = process.env.PORT || 4000
const app = express()

// Connect MongoDB
await connectDB()

// CORS
app.use(cors())

// ----------------------
// 1️⃣ Webhook route first (raw body required for Svix/Clerk)
app.post(
  "/api/user/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
)

// 2️⃣ JSON middleware for all other routes
app.use(express.json())

// User API routes
app.use("/api/user", userRouter)

// Test endpoint
app.get("/", (req, res) => {
  res.json("API working..!!")
})

// Start server
app.listen(PORT, () => {
  console.log("Server Running on port", PORT)
})

export default app