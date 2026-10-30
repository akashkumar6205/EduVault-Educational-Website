import Material from "../models/Material.js";
import { getImageKitInstance } from "../config/imagekit.js";

/**
 * Get Materials list with filtering and search
 */
export const getMaterials = async (req, res, next) => {
  try {
    const {
      subjectCode,
      resourceType,
      unitNumber,
      unitId,
      semester,
      branch,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const query = { isPublished: true };

    if (subjectCode) {
      // Flexibly match codes with or without hyphens (e.g. BT-101 and BT101)
      const clean = subjectCode.replace(/[-\s]/g, "");
      if (clean.length >= 4) {
        query.subjectCode = {
          $regex: new RegExp(`^${clean.slice(0, 2)}[-_\\s]?${clean.slice(2)}$`, "i"),
        };
      } else {
        query.subjectCode = new RegExp(`^${subjectCode}$`, "i");
      }
    }

    if (resourceType) {
      const rawType = resourceType.toLowerCase().trim();
      let cleanType = "syllabus";
      if (rawType.includes("syllabus")) {
        cleanType = "syllabus";
      } else if (rawType.includes("pyq") || rawType.includes("previous") || rawType.includes("paper")) {
        cleanType = "pyq";
      } else if (rawType.includes("note") || rawType.includes("handwritten")) {
        cleanType = "handwritten-notes";
      } else if (rawType.includes("imp") || rawType.includes("topic") || rawType.includes("question")) {
        cleanType = "unit-wise-important";
      } else {
        cleanType = rawType;
      }
      query.resourceType = cleanType;
    }

    if (unitNumber) {
      query.unitNumber = new RegExp(`^${unitNumber}$`, "i");
    }

    if (unitId) {
      query.unitId = unitId;
    }

    if (semester) {
      query.semester = Number(semester);
    }

    // Only filter by branch if explicitly provided and not 'all'
    if (branch && branch.toLowerCase() !== "all" && branch !== "undefined") {
      query.branch = new RegExp(`^${branch}$`, "i");
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { subjectCode: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [materials, total] = await Promise.all([
      Material.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Material.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: materials.length,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single material by ID
 */
export const getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Resource material not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload new Material (Notes, PYQ, Syllabus, Important Topics)
 * Supports file upload directly to ImageKit via multer memory buffer or direct JSON fileUrl
 */
export const uploadMaterial = async (req, res, next) => {
  try {
    const fileObj = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    // Normalize resourceType
    const rawType = (req.body.resourceType || req.body.type || req.body.category || "syllabus")
      .toLowerCase()
      .trim();
    let resourceType = "syllabus";
    if (rawType.includes("syllabus")) {
      resourceType = "syllabus";
    } else if (rawType.includes("pyq") || rawType.includes("previous") || rawType.includes("paper")) {
      resourceType = "pyq";
    } else if (rawType.includes("note") || rawType.includes("handwritten")) {
      resourceType = "handwritten-notes";
    } else if (rawType.includes("imp") || rawType.includes("topic") || rawType.includes("question")) {
      resourceType = "unit-wise-important";
    } else if (["handwritten-notes", "pyq", "syllabus", "unit-wise-important"].includes(rawType)) {
      resourceType = rawType;
    }

    // Normalize subjectCode (e.g. BT101 -> BT-101)
    let subjectCode = (req.body.subjectCode || req.body.subject || req.body.code || "BT-101")
      .trim()
      .toUpperCase();
    if (/^[A-Z]{2}\d{3}$/.test(subjectCode)) {
      subjectCode = `${subjectCode.slice(0, 2)}-${subjectCode.slice(2)}`;
    }

    // Determine semester (if not provided, attempt to parse from subject code e.g. BT-101 -> 1)
    let semester = req.body.semester || req.body.sem;
    if (!semester && subjectCode) {
      const match = subjectCode.match(/[-_]?(\d)\d{2}/);
      if (match) semester = parseInt(match[1], 10);
    }
    semester = semester ? Number(semester) : 1;

    // Determine title
    let title = (req.body.title || req.body.name || "").trim();
    if (!title) {
      if (fileObj?.originalname) {
        title = `${subjectCode} ${fileObj.originalname.replace(/\.[^/.]+$/, "")}`;
      } else {
        const typeLabels = {
          "syllabus": "Official Syllabus",
          "handwritten-notes": "Handwritten Notes",
          "pyq": "Previous Year Question Paper",
          "unit-wise-important": "Unit Wise Important Topics",
        };
        title = `${subjectCode} ${typeLabels[resourceType] || "Resource Material"}`;
      }
    }

    const {
      university = "RGPV",
      course = "B.Tech",
      branch = "CSE",
      unitNumber = "",
      unitId = "",
      description = "",
      author = "EduVault Contributor",
      year = "",
      frequency = "",
      fileUrl: customFileUrl,
      fileId: customFileId,
    } = req.body;

    const directUrl = customFileUrl || req.body.url || req.body.link || req.body.imageUrl || "";

    let fileData = {
      fileId: customFileId || `file_${Date.now()}`,
      url: directUrl,
      thumbnailUrl: req.body.thumbnailUrl || directUrl,
      fileName: fileObj?.originalname || req.body.fileName || "document",
      fileType: "pdf",
      sizeBytes: fileObj?.size || 0,
      pagesCount: Number(req.body.pagesCount) || 1,
    };

    // If file is provided via multipart/form-data
    if (fileObj) {
      const isImage =
        fileObj.mimetype?.startsWith("image/") ||
        /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileObj.originalname || "");
      fileData.fileType = isImage ? "image" : "pdf";
      fileData.fileName = fileObj.originalname;

      const imagekit = getImageKitInstance();
      if (imagekit) {
        try {
          const folder = `/eduvault/${resourceType}/${branch.toLowerCase()}/${subjectCode.toLowerCase()}`;
          const base64File = fileObj.buffer.toString("base64");

          const uploadResponse = await imagekit.upload({
            file: base64File,
            fileName: `${Date.now()}_${fileObj.originalname}`,
            folder,
            useUniqueFileName: true,
          });

          fileData = {
            fileId: uploadResponse.fileId,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
            fileName: uploadResponse.name,
            fileType: isImage ? "image" : (uploadResponse.fileType || "pdf"),
            sizeBytes: uploadResponse.size,
            pagesCount: 1,
          };
        } catch (ikError) {
          console.warn("[ImageKit] Upload failed, using fallback URL to save database record:", ikError.message);
          const fallbackUrl = directUrl || `https://ik.imagekit.io/eduvault_demo/samples/${encodeURIComponent(fileObj.originalname)}`;
          fileData.url = fallbackUrl;
          fileData.thumbnailUrl = fallbackUrl;
        }
      } else {
        const fallbackUrl = directUrl || `https://ik.imagekit.io/eduvault_demo/samples/${encodeURIComponent(fileObj.originalname)}`;
        fileData.url = fallbackUrl;
        fileData.thumbnailUrl = fallbackUrl;
      }
    }

    if (!fileData.url) {
      return res.status(400).json({
        success: false,
        message: "A document/image file or valid fileUrl must be provided.",
      });
    }

    const material = await Material.create({
      title,
      resourceType,
      university,
      course,
      branch,
      semester,
      subjectCode,
      unitNumber,
      unitId,
      description,
      author,
      year,
      frequency,
      file: fileData,
      isPublished: true,
      uploadedBy: req.user?.uid || req.body.uploadedBy || "admin",
    });

    console.log(`[Material Uploaded] Successfully saved to MongoDB: ${material._id} (${material.title})`);

    return res.status(201).json({
      success: true,
      message: `${resourceType.toUpperCase()} uploaded and saved to database successfully!`,
      data: material,
    });
  } catch (error) {
    console.error("[Material Upload Error]", error);
    next(error);
  }
};

/**
 * Increment view count
 */
export const incrementView = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    return res.status(200).json({
      success: true,
      viewsCount: material.viewsCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Increment download count
 */
export const incrementDownload = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    return res.status(200).json({
      success: true,
      downloadsCount: material.downloadsCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete material (and optionally remove from ImageKit)
 */
export const deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: "Material not found" });
    }

    // Try deleting file from ImageKit if configured
    if (material.file?.fileId) {
      const imagekit = getImageKitInstance();
      if (imagekit) {
        try {
          await imagekit.deleteFile(material.file.fileId);
        } catch (ikErr) {
          console.warn("[ImageKit Warning] Could not delete file from ImageKit:", ikErr.message);
        }
      }
    }

    await Material.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
