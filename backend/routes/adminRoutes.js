import express from "express";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changePassword,
  resetPassword,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  requireSuperAdmin,
  checkAdminActive,
} from "../middleware/adminAuth.js";

const router = express.Router();

// Tüm route'lar için auth gerekli
router.use(authMiddleware);
router.use(checkAdminActive);

// Şifre değiştirme - tüm adminler kendi şifresini değiştirebilir
router.put("/change-password", changePassword);

// Aşağıdaki route'lar sadece superadmin için
router.use(requireSuperAdmin);

router.get("/", getAllAdmins);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.put("/:id/reset-password", resetPassword);

export default router;
