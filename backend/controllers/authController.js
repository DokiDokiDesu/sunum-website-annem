import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Admin kayıt
export const registerAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Admin zaten var mı kontrol et
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    const existingEmail = await Admin.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Bu email zaten kullanılıyor" });
    }

    const admin = await Admin.create({ username, password, email });

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Admin başarıyla oluşturuldu",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Admin giriş
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre hatalı" });
    }

    const isPasswordValid = await admin.validatePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre hatalı" });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Giriş başarılı",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Admin bilgisi
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.adminId, {
      attributes: ["id", "username", "email", "createdAt"],
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin bulunamadı" });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
