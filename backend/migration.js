/**
 * Veritabanı Migration Script
 *
 * Bu script mevcut admin tablosuna yeni kolonlar ekler ve
 * ilk superadmin hesabını oluşturur.
 *
 * Kullanım:
 * 1. Backend terminalde: node migration.js
 */

import sequelize from "./config/database.js";
import Admin from "./models/Admin.js";
import ActivityLog from "./models/ActivityLog.js";

async function runMigration() {
  try {
    console.log("🔄 Migration başlatılıyor...");

    // Veritabanı bağlantısını test et
    await sequelize.authenticate();
    console.log("✅ Veritabanı bağlantısı başarılı");

    // Tüm modelleri senkronize et (ALTER yaparak yeni kolonları ekle)
    await sequelize.sync({ alter: true });
    console.log("✅ Tablo yapıları güncellendi");

    // İlk superadmin'i kontrol et
    const superadminCount = await Admin.count({
      where: { role: "superadmin" },
    });

    if (superadminCount === 0) {
      console.log("⚠️  Superadmin bulunamadı, oluşturuluyor...");

      // İlk superadmin hesabını oluştur
      const superadmin = await Admin.create({
        username: "superadmin",
        password: "admin123", // Değiştirmeyi unutmayın!
        email: "admin@example.com",
        fullName: "Super Administrator",
        role: "superadmin",
        isActive: true,
      });

      console.log("✅ Superadmin oluşturuldu:");
      console.log(`   Username: ${superadmin.username}`);
      console.log(`   Email: ${superadmin.email}`);
      console.log(`   Password: admin123 (ÖNEMLİ: İlk girişte değiştirin!)`);

      // İlk aktivite loğu
      await ActivityLog.create({
        adminId: superadmin.id,
        adminUsername: superadmin.username,
        action: "create",
        resourceType: "admin",
        resourceId: superadmin.id,
        description: "İlk superadmin hesabı oluşturuldu (migration)",
        ipAddress: "127.0.0.1",
        userAgent: "migration-script",
      });
    } else {
      console.log(
        `✅ ${superadminCount} superadmin zaten mevcut, yeni oluşturulmadı`,
      );

      // Mevcut adminleri güncelle (role yoksa ekle)
      const adminsWithoutRole = await Admin.findAll({
        where: { role: null },
      });

      if (adminsWithoutRole.length > 0) {
        console.log(
          `⚠️  ${adminsWithoutRole.length} admin'in rolü güncelleniyor...`,
        );
        for (const admin of adminsWithoutRole) {
          await admin.update({ role: "admin", isActive: true });
        }
        console.log("✅ Admin rolleri güncellendi");
      }
    }

    console.log("✅ Migration tamamlandı!");
    console.log("");
    console.log("📋 Sonraki Adımlar:");
    console.log(
      "1. Superadmin ile giriş yapın (http://localhost:3000/admin/login)",
    );
    console.log("2. İlk girişte şifrenizi değiştirin");
    console.log("3. Diğer admin hesaplarını oluşturun");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration hatası:", error);
    process.exit(1);
  }
}

// Migration'ı çalıştır
runMigration();
