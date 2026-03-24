import "dotenv/config"
import express from "express"
import cors from "cors"
import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoutes.js"
import { clerkWebhooks } from "./controllers/userController.js"

//App config
const PORT = process.env.PORT || 4000
const app = express()

//mongodb connection
await connectDB();

//initialize middleware
app.use(cors())

// Normal JSON middleware for other routes
app.use(express.json())

// Webhook route must use raw body
app.post(
  "/api/user/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
)

// API routes
app.use("/api/user", userRouter)

app.get("/", (req,res)=>{
    res.json("API working..!!")
})

app.listen(PORT, ()=>{
    console.log("Server Running on port", PORT)
})

export default app