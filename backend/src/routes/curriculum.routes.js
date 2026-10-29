import { Router } from "express";
import {
  getUniversities,
  getCourses,
  getBranches,
  getSubjects,
  getSubjectByCode,
} from "../controllers/curriculum.controller.js";

const router = Router();

router.get("/universities", getUniversities);
router.get("/courses", getCourses);
router.get("/branches", getBranches);
router.get("/subjects", getSubjects);
router.get("/subjects/:code", getSubjectByCode);

export default router;
