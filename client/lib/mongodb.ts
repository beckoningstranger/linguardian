import mongoose from "mongoose";

export const connectMongoDB = async () => {
  if (!process.env.MONGO_URL) throw new Error("Missing MongoDB credentials!");

  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Frontend connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB on front end: ", err);
  }
};
