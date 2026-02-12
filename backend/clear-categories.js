import sequelize from "./config/database.js";

async function clearCategories() {
  try {
    await sequelize.authenticate();
    await sequelize.query("DELETE FROM Categories");
    console.log("✅ Tüm kategoriler silindi");
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
}

clearCategories();
