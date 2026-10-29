import { Router } from "express";
import { getAuthParameters } from "../controllers/imagekit.controller.js";

const router = Router();

router.get("/auth", getAuthParameters);

export default router;
