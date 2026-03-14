import mongoose from "mongoose"

const connectDB = async()=>{
    mongoose.connection.on("connected",()=>{
        console.log("Database connected successfully")
    })
    await mongoose.connect(`${process.env.MONGO_DB_URI}/bg-removal`)
}

export default connectDB;