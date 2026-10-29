import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ["handwritten-notes", "pyq", "syllabus", "unit-wise-important"],
      required: true,
      index: true,
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
    subjectCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    unitNumber: {
      type: String, // e.g. "UNIT I", "UNIT II" or empty for full-subject PYQ/syllabus
      trim: true,
      default: "",
    },
    unitId: {
      type: String, // e.g. "u1", "u2"
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "EduVault Contributor",
    },
    year: {
      type: String, // e.g. "2023", "2024" for PYQs
      default: "",
    },
    frequency: {
      type: String, // e.g. "Very High (Repeated 4 times)" for Important Topics
      default: "",
    },
    // ImageKit Storage Information
    file: {
      fileId: { type: String, required: true },
      url: { type: String, required: true },
      thumbnailUrl: { type: String, default: "" },
      fileName: { type: String, default: "" },
      fileType: { type: String, default: "pdf" },
      sizeBytes: { type: Number, default: 0 },
      pagesCount: { type: Number, default: 1 },
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    uploadedBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

materialSchema.index({ subjectCode: 1, resourceType: 1, unitNumber: 1 });

export const Material = mongoose.model("Material", materialSchema);
export default Material;
