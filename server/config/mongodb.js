import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_DB_URI) {
      throw new Error("MONGO_DB_URI is missing in .env");
    }

    console.log("Mongo URI Loaded ✔");

    await mongoose.connect(process.env.MONGO_DB_URI);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

export default connectDB;