import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      default: "Student",
    },
    photoURL: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "contributor", "admin"],
      default: "student",
    },
    preferences: {
      university: { type: String, default: "RGPV" },
      course: { type: String, default: "B.Tech" },
      branch: { type: String, default: "CSE" },
      semester: { type: Number, default: 1 },
      theme: { type: String, default: "light" },
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
export default User;
