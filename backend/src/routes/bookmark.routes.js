import { Router } from "express";
import {
  getUserBookmarks,
  toggleBookmark,
  clearUserBookmarks,
  syncBookmarks,
} from "../controllers/bookmark.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getUserBookmarks);
router.post("/toggle", toggleBookmark);
router.post("/sync", syncBookmarks);
router.delete("/clear", clearUserBookmarks);

export default router;
