import mongoose from "mongoose";

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_DB_URI, {
      dbName: "bg-removal",
    });

    console.log("Database connected successfully");

  } catch (error) {

    console.error("Database connection error:", error.message);

  }
};

export default connectDB;