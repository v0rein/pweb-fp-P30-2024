import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./models/home.model";

dotenv.config();

const mongoURI = (process.env.MONGO_URI as string) || "";

const seedUsers = async () => {
  if (!mongoURI) {
    console.error("Error: MONGO_URI is not defined in the .env file.");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const users = [
      {
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
      {
        username: "billy",
        password: await bcrypt.hash("billy123", 10),
        role: "USER",
      },
    ];

    for (const user of users) {
      const existingUser = await User.findOne({ username: user.username });
      if (existingUser) {
        console.log(
          `User with username "${user.username}" already exists. Skipping.`
        );
        continue;
      }
      await User.create(user);
      console.log(`User "${user.username}" added successfully.`);
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Run the Seed Function with `npx ts-node src/seed.ts`
seedUsers();
