import { Router } from "express";
import {
  getMaterials,
  getMaterialById,
  uploadMaterial,
  incrementView,
  incrementDownload,
  deleteMaterial,
} from "../controllers/material.controller.js";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

// Public routes
router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/:id/view", incrementView);
router.post("/:id/download", incrementDownload);

// Upload routes (accept any file key e.g. file, image, syllabus, etc.)
router.post("/upload", optionalAuth, upload.any(), uploadMaterial);
router.delete("/:id", requireAuth, deleteMaterial);

export default router;
