import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    bookmarkKey: {
      type: String, // e.g. "BT-101-u1-notes" matching frontend client bookmark IDs
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["notes", "pyq", "important", "syllabus"],
      default: "notes",
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    categoryLabel: {
      type: String,
      default: "Handwritten Notes",
    },
    subject: {
      type: String,
      default: "",
    },
    subjectCode: {
      type: String,
      default: "",
    },
    semester: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      default: "",
    },
    university: {
      type: String,
      default: "RGPV",
    },
    unit: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    author: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    frequency: {
      type: String,
      default: "",
    },
    pages: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ userId: 1, bookmarkKey: 1 }, { unique: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;
