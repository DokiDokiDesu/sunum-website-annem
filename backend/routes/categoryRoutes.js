import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middleware/auth.js";
import { logActivity } from "../middleware/activityLogger.js";

const router = express.Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Protected routes (Admin only) - log kaydı ile
router.post(
  "/",
  authMiddleware,
  logActivity("create", "category"),
  createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  logActivity("update", "category"),
  updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  logActivity("delete", "category"),
  deleteCategory,
);
router.patch(
  "/:id/toggle",
  authMiddleware,
  logActivity("update", "category"),
  toggleCategoryStatus,
);

export default router;
