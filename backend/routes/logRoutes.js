import express from "express";
import {
  getAllLogs,
  getLogStats,
  getRecentActivity,
} from "../controllers/logController.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  requireSuperAdmin,
  checkAdminActive,
} from "../middleware/adminAuth.js";

const router = express.Router();

// Tüm route'lar için auth ve superadmin gerekli
router.use(authMiddleware);
router.use(checkAdminActive);
router.use(requireSuperAdmin);

router.get("/", getAllLogs);
router.get("/stats", getLogStats);
router.get("/recent", getRecentActivity);

export default router;
