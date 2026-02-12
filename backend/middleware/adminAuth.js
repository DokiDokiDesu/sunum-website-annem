import Admin from "../models/Admin.js";

// Superadmin yetkisi kontrolü
export const requireSuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    if (admin.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Bu işlem için superadmin yetkisi gerekli" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Admin aktif mi kontrolü
export const checkAdminActive = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    if (!admin.isActive) {
      return res
        .status(403)
        .json({ message: "Hesabınız devre dışı bırakılmış" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
