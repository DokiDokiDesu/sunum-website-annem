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

const router = express.Router();

// Public routes
router.get("/", getAllSeminars);
router.get("/:id", getSeminarById);
router.post("/:id/vote", voteSeminar);

// Protected routes (Admin only)
router.post("/", authMiddleware, upload.single("image"), createSeminar);
router.put("/:id", authMiddleware, upload.single("image"), updateSeminar);
router.delete("/:id", authMiddleware, deleteSeminar);
router.post("/:id/cancel-schedule", authMiddleware, cancelSchedule);

export default router;
