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

// JSON for API routes
app.use(express.json())

// Webhook route 
app.post(
  "/api/user/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
)

// user routes
app.use("/api/user", userRouter)

// Test endpoint
app.get("/", (req, res) => {
  res.json("API working..!!")
})

app.listen(PORT, () => {
  console.log("Server Running on port", PORT)
})

export default app