import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cron from "node-cron";
import sequelize from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import seminarRoutes from "./routes/seminarRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import votingRoutes from "./routes/votingRoutes.js";
import Admin from "./models/Admin.js";
import Seminar from "./models/Seminar.js";
import Category from "./models/Category.js";
import ActivityLog from "./models/ActivityLog.js";
import VotingTopic from "./models/VotingTopic.js";
import { checkAndUpdateExpiredSeminars } from "./controllers/seminarController.js";
import fs from "fs";
import { Op } from "sequelize";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Local development frontend
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Production frontend (from env)
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads klasörünü statik olarak sunma
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seminars", seminarRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/voting", votingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Bir hata oluştu!", error: err.message });
});

// Database sync ve server başlatma
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Veritabanı bağlantısı başarılı");

    // SQLite ile alter: true sorun yaratıyor, bu yüzden sadece sync kullanıyoruz
    await sequelize.sync();
    console.log("✅ Veritabanı senkronizasyonu tamamlandı");

    // Varsayılan admin oluştur (eğer yoksa)
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        username: "admin",
        password: "admin123",
        email: "admin@seminar.com",
      });
      console.log(
        "✅ Varsayılan admin oluşturuldu (username: admin, password: admin123)",
      );
    }

    // Server başlatıldığında ilk kontrol
    const expiredCount = await checkAndUpdateExpiredSeminars();
    if (expiredCount > 0) {
      console.log(
        `🗓️ ${expiredCount} adet geçmiş tarihli seminer planlanmamış duruma getirildi`,
      );
    }

    // Cron job: Her gün gece yarısı 00:01'de otomatik kontrol
    cron.schedule("1 0 * * *", async () => {
      console.log("⏰ Otomatik seminer tarihi kontrolü başladı...");
      const count = await checkAndUpdateExpiredSeminars();
      if (count > 0) {
        console.log(
          `🗓️ ${count} adet geçmiş tarihli seminer planlanmamış duruma getirildi`,
        );
      } else {
        console.log("✅ Güncellenecek geçmiş tarihli seminer bulunamadı");
      }
    });

    console.log("⏰ Otomatik tarih kontrolü sistemi aktif (Her gün 00:01'de)");

    app.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda çalışıyor`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Sunucu başlatılamadı:", error);
    process.exit(1);
  }
};

startServer();
