import Seminar from "../models/Seminar.js";
import ActivityLog from "../models/ActivityLog.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";

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
    const expiredDetails = [];

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
          expiredDetails.push({
            id: seminar.id,
            title: seminar.title,
            date: seminar.date,
          });

          console.log(
            `Seminer tarihi geçti, planlanmamış hale getirildi: ${seminar.title}`,
          );

          // Aktivite logu kaydet
          try {
            await ActivityLog.create({
              adminId: 0, // Sistem otomatik işlemi
              adminUsername: "System",
              action: "cancel_schedule",
              resourceType: "seminar",
              resourceId: seminar.id,
              description: `Otomatik sistem: Geçmiş tarihli seminer planlamadan kaldırıldı - "${seminar.title}" (Tarih: ${seminar.date})`,
              ipAddress: "127.0.0.1",
              userAgent: "System-AutoScheduleCheck",
              metadata: {
                reason: "expired_date",
                seminarDate: seminar.date,
                checkDate: today.toISOString(),
                automatic: true,
              },
            });
          } catch (logError) {
            console.error("Log kaydı oluşturulamadı:", logError);
          }
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
      image: req.file ? req.file.path : null, // Cloudinary URL
      cloudinaryId: req.file ? req.file.filename : null, // Cloudinary public_id
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

    // Eski resmi Cloudinary'den sil (yeni resim yüklendiyse)
    if (req.file && seminar.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(seminar.cloudinaryId);
      } catch (error) {
        console.error("Cloudinary'den resim silinemedi:", error);
      }
    }

    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image = req.file.path; // Cloudinary URL
      updateData.cloudinaryId = req.file.filename; // Cloudinary public_id
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

    // Cloudinary'den resmi sil
    if (seminar.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(seminar.cloudinaryId);
      } catch (error) {
        console.error("Cloudinary'den resim silinemedi:", error);
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
