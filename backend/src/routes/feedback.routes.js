import { Router } from "express";
import { submitFeedback, getFeedbacks } from "../controllers/feedback.controller.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getFeedbacks);
router.post("/", optionalAuth, submitFeedback);

export default router;
