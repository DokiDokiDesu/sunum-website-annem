import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Yetkilendirme token'ı bulunamadı" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin bilgilerini veritabanından al
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: "Admin bulunamadı" });
    }

    if (!admin.isActive) {
      return res
        .status(403)
        .json({ message: "Hesabınız devre dışı bırakılmış" });
    }

    req.adminId = decoded.id;
    req.admin = admin; // Controller'lar için admin objesi
    next();
  } catch (error) {
    console.error("Auth middleware hatası:", error);
    res.status(401).json({ message: "Geçersiz token" });
  }
};

// Alias for compatibility
export const verifyToken = authMiddleware;
