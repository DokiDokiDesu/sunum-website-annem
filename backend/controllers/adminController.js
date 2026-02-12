import Admin from "../models/Admin.js";
import ActivityLog from "../models/ActivityLog.js";
import bcrypt from "bcryptjs";

// Tüm adminleri getir (sadece superadmin)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Yeni admin oluştur (sadece superadmin)
export const createAdmin = async (req, res) => {
  try {
    const { username, password, email, fullName, role } = req.body;

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    // Username kontrolü
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    // Email kontrolü
    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Bu email zaten kullanılıyor" });
    }

    // Role kontrolü - sadece superadmin başka superadmin oluşturabilir
    const requestingAdmin = await Admin.findByPk(req.adminId);
    if (role === "superadmin" && requestingAdmin.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Sadece superadmin, superadmin oluşturabilir" });
    }

    const admin = await Admin.create({
      username,
      password,
      email,
      fullName,
      role: role || "admin",
    });

    // Log kaydı
    await ActivityLog.create({
      adminId: req.adminId,
      adminUsername: requestingAdmin.username,
      action: "create",
      resourceType: "admin",
      resourceId: admin.id,
      description: `Yeni admin oluşturuldu: ${username} (${role || "admin"})`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.status(201).json({
      message: "Admin başarıyla oluşturuldu",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Admin güncelle (sadece superadmin)
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, isActive } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    // Role kontrolü
    const requestingAdmin = await Admin.findByPk(req.adminId);
    if (role === "superadmin" && requestingAdmin.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Sadece superadmin, superadmin rolü verebilir" });
    }

    // Kendi rolünü değiştirmeye çalışıyor mu?
    if (id == req.adminId && role && role !== admin.role) {
      return res
        .status(400)
        .json({ message: "Kendi rolünüzü değiştiremezsiniz" });
    }

    // Username kontrolü
    if (username && username !== admin.username) {
      const existingAdmin = await Admin.findOne({ where: { username } });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
      }
    }

    // Email kontrolü
    if (email && email !== admin.email) {
      const existingEmail = await Admin.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Bu email zaten kullanılıyor" });
      }
    }

    const oldData = { ...admin.dataValues };

    await admin.update({
      username: username || admin.username,
      email: email || admin.email,
      fullName: fullName !== undefined ? fullName : admin.fullName,
      role: role || admin.role,
      isActive: isActive !== undefined ? isActive : admin.isActive,
    });

    // Log kaydı
    await ActivityLog.create({
      adminId: req.adminId,
      adminUsername: requestingAdmin.username,
      action: "update",
      resourceType: "admin",
      resourceId: admin.id,
      description: `Admin güncellendi: ${admin.username}`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      metadata: { oldData, newData: admin.dataValues },
    });

    res.json({
      message: "Admin başarıyla güncellendi",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Admin sil (sadece superadmin)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Kendini silmeye çalışıyor mu?
    if (id == req.adminId) {
      return res.status(400).json({ message: "Kendinizi silemezsiniz" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    // Superadmin mi?
    if (admin.role === "superadmin") {
      const superadminCount = await Admin.count({
        where: { role: "superadmin" },
      });
      if (superadminCount <= 1) {
        return res
          .status(400)
          .json({ message: "Son superadmin'i silemezsiniz" });
      }
    }

    const requestingAdmin = await Admin.findByPk(req.adminId);

    // Log kaydı
    await ActivityLog.create({
      adminId: req.adminId,
      adminUsername: requestingAdmin.username,
      action: "delete",
      resourceType: "admin",
      resourceId: admin.id,
      description: `Admin silindi: ${admin.username}`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      metadata: { deletedAdmin: admin.dataValues },
    });

    await admin.destroy();

    res.json({ message: "Admin başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Şifre değiştir (tüm adminler kendi şifrelerini değiştirebilir)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Şifre en az 6 karakter olmalıdır" });
    }

    const admin = await Admin.findByPk(req.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await admin.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mevcut şifre hatalı" });
    }

    // Yeni şifreyi kaydet
    await admin.update({ password: newPassword });

    // Log kaydı
    await ActivityLog.create({
      adminId: req.adminId,
      adminUsername: admin.username,
      action: "change_password",
      resourceType: "admin",
      resourceId: admin.id,
      description: "Şifre değiştirildi",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json({ message: "Şifre başarıyla değiştirildi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Şifre sıfırla (sadece superadmin başka adminlerin şifresini sıfırlayabilir)
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Yeni şifre gerekli" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Şifre en az 6 karakter olmalıdır" });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    const requestingAdmin = await Admin.findByPk(req.adminId);

    await admin.update({ password: newPassword });

    // Log kaydı
    await ActivityLog.create({
      adminId: req.adminId,
      adminUsername: requestingAdmin.username,
      action: "reset_password",
      resourceType: "admin",
      resourceId: admin.id,
      description: `${admin.username} kullanıcısının şifresi sıfırlandı`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json({ message: "Şifre başarıyla sıfırlandı" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
