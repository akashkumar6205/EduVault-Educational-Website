import { Router } from "express";
import healthRoutes from "./health.routes.js";
import userRoutes from "./user.routes.js";
import curriculumRoutes from "./curriculum.routes.js";
import materialRoutes from "./material.routes.js";
import bookmarkRoutes from "./bookmark.routes.js";
import feedbackRoutes from "./feedback.routes.js";
import imagekitRoutes from "./imagekit.routes.js";

const apiRouter = Router();

apiRouter.use("/health", healthRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/curriculum", curriculumRoutes);
apiRouter.use("/materials", materialRoutes);
apiRouter.use("/bookmarks", bookmarkRoutes);
apiRouter.use("/feedback", feedbackRoutes);
apiRouter.use("/imagekit", imagekitRoutes);

export default apiRouter;
