import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("🛢️  Connected To Database");
  } catch (error) {
    console.log("⚠️ Error connecting to Database:", error);
  }
}
