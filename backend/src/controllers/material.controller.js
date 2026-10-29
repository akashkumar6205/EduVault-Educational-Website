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
      limit = 20,
    } = req.query;

    const query = { isPublished: true };

    if (subjectCode) {
      query.subjectCode = new RegExp(`^${subjectCode.trim()}$`, "i");
    }

    if (resourceType) {
      query.resourceType = resourceType.trim();
    }

    if (unitNumber) {
      query.unitNumber = unitNumber;
    }

    if (unitId) {
      query.unitId = unitId;
    }

    if (semester) {
      query.semester = Number(semester);
    }

    if (branch && branch !== "all") {
      query.branch = new RegExp(`^${branch.trim()}$`, "i");
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
 * Supports file upload directly to ImageKit via multer memory buffer
 */
export const uploadMaterial = async (req, res, next) => {
  try {
    const {
      title,
      resourceType,
      university = "RGPV",
      course = "B.Tech",
      branch = "CSE",
      semester,
      subjectCode,
      unitNumber = "",
      unitId = "",
      description = "",
      author = "EduVault Contributor",
      year = "",
      frequency = "",
      fileUrl, // Optional if directly providing a link
      fileId: customFileId,
    } = req.body;

    if (!title || !resourceType || !subjectCode || !semester) {
      return res.status(400).json({
        success: false,
        message: "title, resourceType, subjectCode, and semester are required fields.",
      });
    }

    let fileData = {
      fileId: customFileId || `ik_${Date.now()}`,
      url: fileUrl || "",
      thumbnailUrl: fileUrl && fileUrl.endsWith(".pdf") ? `${fileUrl}/ik-thumbnail.jpg` : (fileUrl || ""),
      fileName: req.file?.originalname || (fileUrl ? fileUrl.split("/").pop().split("?")[0] : "document.pdf"),
      fileType: "pdf",
      sizeBytes: req.file?.size || 0,
      pagesCount: 1,
    };

    // If file is provided in request body as multipart/form-data
    if (req.file) {
      const imagekit = getImageKitInstance();
      if (imagekit) {
        // Construct clean folder path in ImageKit
        const folder = `/eduvault/${resourceType}/${branch.toLowerCase()}/${subjectCode.toLowerCase()}`;
        const base64File = req.file.buffer.toString("base64");

        const uploadResponse = await imagekit.upload({
          file: base64File,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder,
          useUniqueFileName: true,
        });

        fileData = {
          fileId: uploadResponse.fileId,
          url: uploadResponse.url,
          thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
          fileName: uploadResponse.name,
          fileType: uploadResponse.fileType || "pdf",
          sizeBytes: uploadResponse.size,
          pagesCount: 1,
        };
      } else {
        // Mock fallback if ImageKit credentials are not yet configured
        fileData.url = fileUrl || `https://ik.imagekit.io/eduvault_demo/samples/${req.file.originalname}`;
        fileData.thumbnailUrl = fileData.url;
      }
    }

    if (!fileData.url) {
      return res.status(400).json({
        success: false,
        message: "A document file (via multipart) or valid fileUrl must be provided.",
      });
    }

    const filter = {
      subjectCode: subjectCode.toUpperCase(),
      resourceType,
      semester: Number(semester),
    };
    if (unitNumber) filter.unitNumber = unitNumber;

    const material = await Material.findOneAndUpdate(
      filter,
      {
        title,
        resourceType,
        university,
        course,
        branch,
        semester: Number(semester),
        subjectCode: subjectCode.toUpperCase(),
        unitNumber,
        unitId,
        description,
        author,
        year,
        frequency,
        file: fileData,
        uploadedBy: req.user?.uid || "admin",
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Material uploaded successfully",
      data: material,
    });
  } catch (error) {
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

/**
 * Direct JSON endpoint to save or update an ImageKit PDF URL into MongoDB
 */
export const saveMaterialUrl = async (req, res, next) => {
  try {
    const {
      title,
      resourceType,
      subjectCode,
      semester = 1,
      branch = "CSE",
      university = "RGPV",
      unitNumber = "",
      unitId = "",
      fileUrl,
      fileName,
    } = req.body;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "fileUrl is required",
      });
    }

    if (!subjectCode || !resourceType) {
      return res.status(400).json({
        success: false,
        message: "subjectCode and resourceType are required",
      });
    }

    const cleanFileName =
      fileName || fileUrl.split("/").pop().split("?")[0] || `${subjectCode}_${resourceType}.pdf`;
    const thumbnailUrl =
      fileUrl.endsWith(".pdf") ? `${fileUrl}/ik-thumbnail.jpg` : fileUrl;

    const filter = {
      subjectCode: new RegExp(`^${subjectCode.trim()}$`, "i"),
      resourceType: resourceType.trim(),
      semester: Number(semester),
    };
    if (unitNumber) filter.unitNumber = unitNumber;

    const updateDoc = {
      title: title || `${subjectCode.toUpperCase()} ${resourceType.toUpperCase()}`,
      resourceType: resourceType.trim(),
      university: university || "RGPV",
      branch: (branch || "CSE").toUpperCase(),
      semester: Number(semester),
      subjectCode: subjectCode.toUpperCase(),
      unitNumber: unitNumber || "",
      unitId: unitId || "",
      description: `Official document for ${subjectCode.toUpperCase()}.`,
      file: {
        fileId: `ik_${Date.now()}`,
        url: fileUrl.trim(),
        thumbnailUrl,
        fileName: cleanFileName,
        fileType: "pdf",
        sizeBytes: 1500000,
        pagesCount: 8,
      },
      isPublished: true,
      uploadedBy: req.user?.uid || "admin",
    };

    const material = await Material.findOneAndUpdate(filter, updateDoc, {
      upsert: true,
      new: true,
    });

    console.log(`[Material Controller] Saved PDF URL in MongoDB for ${subjectCode} (${resourceType}): ${fileUrl}`);

    return res.status(200).json({
      success: true,
      message: "PDF URL successfully saved in MongoDB!",
      data: material,
    });
  } catch (error) {
    next(error);
  }
};
