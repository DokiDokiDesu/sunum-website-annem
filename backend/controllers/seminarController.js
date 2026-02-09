import Seminar from "../models/Seminar.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Geçmiş tarihli seminerleri kontrol et ve güncelle
export const checkAndUpdateExpiredSeminars = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Günün başlangıcı

    // Tarih alanı dolu ve geçmiş tarihli olan seminerleri bul
    const expiredSeminars = await Seminar.findAll({
      where: {
        date: {
          [Op.not]: null,
        },
        isScheduled: true,
      },
    });

    // Her seminerin tarihini kontrol et
    let expiredCount = 0;
    for (const seminar of expiredSeminars) {
      if (seminar.date) {
        const seminarDate = new Date(seminar.date);
        seminarDate.setHours(0, 0, 0, 0);

        // Eğer seminer tarihi geçmişse
        if (seminarDate < today) {
          await seminar.update({
            isScheduled: false,
            isUpcoming: false,
            // Tarih bilgilerini koruyoruz, sadece durumu değiştiriyoruz
          });
          expiredCount++;
          console.log(
            `Seminer tarihi geçti, planlanmamış hale getirildi: ${seminar.title}`,
          );
        }
      }
    }
    return expiredCount;
  } catch (error) {
    console.error("Geçmiş seminer kontrolü sırasında hata:", error);
    return 0;
  }
};

// Tüm seminerleri getir
export const getAllSeminars = async (req, res) => {
  try {
    // Önce geçmiş tarihli seminerleri kontrol et ve güncelle
    await checkAndUpdateExpiredSeminars();

    const { category, search, isPopular, isUpcoming } = req.query;

    let where = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    if (isPopular === "true") {
      where.isPopular = true;
    }

    if (isUpcoming === "true") {
      where.isUpcoming = true;
    }

    const seminars = await Seminar.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(seminars);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Tek seminer getir
export const getSeminarById = async (req, res) => {
  try {
    const seminar = await Seminar.findByPk(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: "Seminer bulunamadı" });
    }

    // Eğer seminer planlanmışsa ve tarihi geçmişse güncelle
    if (seminar.date && seminar.isScheduled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const seminarDate = new Date(seminar.date);
      seminarDate.setHours(0, 0, 0, 0);

      if (seminarDate < today) {
        await seminar.update({
          isScheduled: false,
          isUpcoming: false,
        });
      }
    }

    res.json(seminar);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Yeni seminer oluştur
export const createSeminar = async (req, res) => {
  try {
    const seminarData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const seminar = await Seminar.create(seminarData);
    res.status(201).json({ message: "Seminer başarıyla oluşturuldu", seminar });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Seminer güncelle
export const updateSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findByPk(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: "Seminer bulunamadı" });
    }

    // Eski resmi sil (yeni resim yüklendiyse)
    if (req.file && seminar.image) {
      const oldImagePath = path.join(__dirname, "..", seminar.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    await seminar.update(updateData);
    res.json({ message: "Seminer başarıyla güncellendi", seminar });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Seminer sil
export const deleteSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findByPk(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: "Seminer bulunamadı" });
    }

    // Resmi sil
    if (seminar.image) {
      const imagePath = path.join(__dirname, "..", seminar.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await seminar.destroy();
    res.json({ message: "Seminer başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Seminer oylaması
export const voteSeminar = async (req, res) => {
  try {
    const seminar = await Seminar.findByPk(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: "Seminer bulunamadı" });
    }

    seminar.votes += 1;
    await seminar.save();

    res.json({ message: "Oy başarıyla kaydedildi", votes: seminar.votes });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Seminer planlamasını iptal et
export const cancelSchedule = async (req, res) => {
  try {
    const seminar = await Seminar.findByPk(req.params.id);

    if (!seminar) {
      return res.status(404).json({ message: "Seminer bulunamadı" });
    }

    if (!seminar.isScheduled) {
      return res
        .status(400)
        .json({ message: "Seminer zaten planlanmamış durumda" });
    }

    // Planlama bilgilerini temizle
    await seminar.update({
      isScheduled: false,
      isUpcoming: false,
      // Tarih ve eğitmen bilgilerini saklıyoruz, sadece durumu değiştiriyoruz
      // İsterseniz tarih bilgilerini de silebilirsiniz:
      // date: null,
      // startTime: null,
      // dayOfWeek: null,
      // instructor: null,
      // instructorTitle: null,
      // instructorFullName: null,
    });

    res.json({
      message: "Planlama başarıyla iptal edildi",
      seminar,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
