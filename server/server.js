
import "dotenv/config"  
import express from "express"
import cors from "cors"
import connectDB from "./config/mongodb.js"

//App config
const PORT = process.env.PORT || 4000
const app = express()

//mongodb connection
await connectDB();

//initialize middleware
app.use(express.json());
app.use(cors());

//API routes
app.get("/",(req,res)=>{
    res.json("API working..!!")
})

app.listen(PORT,()=>{
    console.log("Server Running on port", +PORT)
})