import mongoose from "mongoose";

export const connectDB = async (req, res) => {
  // Database connection logic goes here
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};
