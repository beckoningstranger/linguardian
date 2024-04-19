import { User as UserType } from "@/types";
import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema<UserType>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
    },
    image: { type: String },
    native: {
      type: String,
    },
    languages: [
      {
        name: { type: String },
        code: { type: String },
        flag: { type: String },
        learnedItems: [
          {
            id: { type: Schema.Types.ObjectId, ref: "Item" },
            level: { type: Number },
            nextReview: { type: Number },
          },
        ],
        ignoredItems: [{ type: Schema.Types.ObjectId, ref: "Item" }],
        learnedLists: [{ type: Schema.Types.ObjectId, ref: "List" }],
        customSRSettings: {
          reviewTimes: {
            1: { type: Number },
            2: { type: Number },
            3: { type: Number },
            4: { type: Number },
            5: { type: Number },
            6: { type: Number },
            7: { type: Number },
            8: { type: Number },
            9: { type: Number },
            10: { type: Number },
          },
          itemsPerSession: {
            learning: { type: Number },
            reviewing: { type: Number },
          },
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || model<UserType>("User", userSchema);
export default User;

export async function getLatestUserId() {
  const latestUserId = await User.findOne().sort("-listNumber");
  return !latestUserId?.id ? 1 : latestUserId.id + 1;
}
