import mongoose from "mongoose";

export const connectMongoDB = async () => {
  if (!process.env.MONGO_URL) throw new Error("Missing MongoDB credentials!");

  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.error("Error connecting to MongoDB on front end: ", err);
  }
};
