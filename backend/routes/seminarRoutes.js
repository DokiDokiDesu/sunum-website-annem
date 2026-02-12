import express from "express";
import {
  getAllSeminars,
  getSeminarById,
  createSeminar,
  updateSeminar,
  deleteSeminar,
  voteSeminar,
  cancelSchedule,
} from "../controllers/seminarController.js";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { logActivity } from "../middleware/activityLogger.js";

const router = express.Router();

// Public routes
router.get("/", getAllSeminars);
router.get("/:id", getSeminarById);
router.post("/:id/vote", voteSeminar);

// Protected routes (Admin only) - log kaydı ile
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  logActivity("create", "seminar"),
  createSeminar,
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  logActivity("update", "seminar"),
  updateSeminar,
);
router.delete(
  "/:id",
  authMiddleware,
  logActivity("delete", "seminar"),
  deleteSeminar,
);
router.post(
  "/:id/cancel-schedule",
  authMiddleware,
  logActivity("cancel_schedule", "seminar"),
  cancelSchedule,
);

export default router;
