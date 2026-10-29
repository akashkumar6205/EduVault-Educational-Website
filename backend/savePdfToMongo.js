import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Material from "./src/models/Material.js";

/**
 * Script to save an ImageKit PDF URL directly into MongoDB
 * Usage:
 *   node backend/savePdfToMongo.js "<IMAGEKIT_URL>" "BT-101" "syllabus" 1 "CSE" "Engineering Chemistry Syllabus"
 */
async function savePdf() {
  const args = process.argv.slice(2);
  const pdfUrl = args[0];
  const subjectCode = (args[1] || "BT-101").toUpperCase();
  const resourceType = args[2] || "syllabus"; // "syllabus", "handwritten-notes", "pyq", "unit-wise-important"
  const semester = Number(args[3]) || 1;
  const branch = (args[4] || "CSE").toUpperCase();
  const title = args[5] || `${subjectCode} Official Syllabus`;

  if (!pdfUrl) {
    console.error("❌ Error: Please provide your ImageKit PDF URL.");
    console.log('\nUsage:');
    console.log('  node backend/savePdfToMongo.js "https://ik.imagekit.io/your_id/chemistry_syllabus.pdf"\n');
    process.exit(1);
  }

  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_db";
    console.log(`Connecting to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log(" Connected to MongoDB!");

    // Extract file name from URL
    const fileName = pdfUrl.split("/").pop().split("?")[0] || "syllabus.pdf";
    const fileId = `ik_${Date.now()}`;
    const thumbnailUrl = pdfUrl.endsWith(".pdf") ? `${pdfUrl}/ik-thumbnail.jpg` : pdfUrl;

    const query = {
      subjectCode,
      resourceType,
      semester,
    };

    const updateData = {
      title,
      resourceType,
      university: "RGPV",
      course: "B.Tech",
      branch,
      semester,
      subjectCode,
      description: `Official RGPV curriculum document for ${subjectCode}.`,
      author: "RGPV Academic Council",
      file: {
        fileId,
        url: pdfUrl,
        thumbnailUrl,
        fileName,
        fileType: "pdf",
        sizeBytes: 1500000,
        pagesCount: 8,
      },
      isPublished: true,
      uploadedBy: "admin",
    };

    // Update if already exists, or create new
    const saved = await Material.findOneAndUpdate(query, updateData, {
      upsert: true,
      new: true,
    });

    console.log("\n SUCCESS! PDF URL has been saved into MongoDB:");
    console.log("--------------------------------------------------");
    console.log(`ID:           ${saved._id}`);
    console.log(`Subject:      ${saved.subjectCode}`);
    console.log(`Resource:     ${saved.resourceType}`);
    console.log(`PDF URL:      ${saved.file.url}`);
    console.log(`Thumbnail:    ${saved.file.thumbnailUrl}`);
    console.log("--------------------------------------------------");
    console.log("Now refresh your browser and click on 'Syllabus' to view it!\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to save into MongoDB:", err.message);
    process.exit(1);
  }
}

savePdf();
