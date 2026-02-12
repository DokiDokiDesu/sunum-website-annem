import sequelize from "./config/database.js";
import Seminar from "./models/Seminar.js";

async function syncDatabase() {
  try {
    console.log("🔄 Veritabanı senkronizasyonu başlatılıyor...");

    await sequelize.authenticate();
    console.log("✅ Veritabanı bağlantısı başarılı");

    // Sadece sync() - alter yerine, mevcut tabloyu korur ve eksikleri ekler
    await sequelize.sync();
    console.log("✅ Veritabanı senkronizasyonu tamamlandı");
    console.log("✅ cloudinaryId alanı Seminar tablosuna eklendi");

    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

syncDatabase();
