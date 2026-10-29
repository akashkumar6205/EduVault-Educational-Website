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

// Upload routes (with Multer memory storage and ImageKit integration)
router.post("/upload", optionalAuth, upload.single("file"), uploadMaterial);
router.delete("/:id", requireAuth, deleteMaterial);

export default router;
