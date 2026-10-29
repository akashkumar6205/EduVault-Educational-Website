import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g. "u1", "u2"
  number: { type: String, required: true }, // e.g. "UNIT I", "UNIT II"
  name: { type: String, required: true },
  topics: { type: String, default: "" },
});

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    university: {
      type: String,
      default: "RGPV",
      index: true,
    },
    course: {
      type: String,
      default: "B.Tech",
      index: true,
    },
    branch: {
      type: String,
      default: "CSE",
      index: true,
    },
    semester: {
      type: Number,
      required: true,
      index: true,
    },
    units: [unitSchema],
  },
  {
    timestamps: true,
  }
);

export const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
