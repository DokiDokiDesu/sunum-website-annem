import sequelize from "./config/database.js";
import Admin from "./models/Admin.js";

async function createSuperadmin() {
  try {
    console.log("🔄 Superadmin oluşturuluyor...");

    await sequelize.authenticate();
    console.log("✅ Veritabanı bağlantısı başarılı");

    // Superadmin var mı kontrol et
    const existingSuperadmin = await Admin.findOne({
      where: { username: "superadmin" },
    });

    if (existingSuperadmin) {
      console.log("⚠️  Superadmin zaten mevcut");
      console.log("   Username: superadmin");
      console.log("   Email:", existingSuperadmin.email);
      process.exit(0);
    }

    // Superadmin oluştur
    const superadmin = await Admin.create({
      username: "superadmin",
      password: "admin123",
      email: "superadmin@seminar.com",
      fullName: "Super Administrator",
      role: "superadmin",
      isActive: true,
    });

    console.log("✅ Superadmin başarıyla oluşturuldu:");
    console.log("   Username: superadmin");
    console.log("   Email:", superadmin.email);
    console.log("   Password: admin123");
    console.log("   Role:", superadmin.role);

    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

createSuperadmin();
