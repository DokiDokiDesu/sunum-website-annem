import VotingTopic from "../models/VotingTopic.js";
import ActivityLog from "../models/ActivityLog.js";

// Tüm oylama konularını getir
export const getAllVotingTopics = async (req, res) => {
  try {
    const topics = await VotingTopic.findAll({
      where: { isActive: true },
      order: [["position", "ASC"]],
      limit: 4,
    });
    res.json(topics);
  } catch (error) {
    console.error("Oylama konuları getirilemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Admin için tüm konuları getir (oy sayıları ile)
export const getVotingTopicsForAdmin = async (req, res) => {
  try {
    const topics = await VotingTopic.findAll({
      order: [["position", "ASC"]],
    });
    res.json(topics);
  } catch (error) {
    console.error("Admin oylama konuları getirilemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Oylama konusu oluştur veya güncelle
export const upsertVotingTopic = async (req, res) => {
  try {
    const { id, title, description, position } = req.body;

    console.log("Request body:", req.body);
    console.log("Request admin:", req.admin);
    console.log("Admin ID:", req.admin?.id);
    console.log("Admin email:", req.admin?.email);

    if (!title || !position) {
      return res.status(400).json({ error: "Başlık ve pozisyon gereklidir" });
    }

    if (position < 1 || position > 4) {
      return res.status(400).json({ error: "Pozisyon 1-4 arasında olmalıdır" });
    }

    let topic;
    let action;

    if (id) {
      // Güncelleme
      topic = await VotingTopic.findByPk(id);
      if (!topic) {
        return res.status(404).json({ error: "Konu bulunamadı" });
      }
      await topic.update({ title, description, position });
      action = "güncellendi";
    } else {
      // Yeni oluşturma
      topic = await VotingTopic.create({
        title,
        description,
        position,
        voteCount: 0,
      });
      action = "oluşturuldu";
    }

    // Activity log
    try {
      await ActivityLog.create({
        adminId: req.admin.id,
        adminUsername: req.admin.username,
        action: `Oylama konusu ${action}`,
        resourceType: "voting_topic",
        resourceId: topic.id,
        description: `${title} (Pozisyon: ${position})`,
        ipAddress: req.ip,
      });
    } catch (logError) {
      console.error("Activity log hatası:", logError);
      // Log hatası ana işlemi engellemez
    }

    res.json({
      message: `Oylama konusu başarıyla ${action}`,
      topic,
    });
  } catch (error) {
    console.error("Oylama konusu kaydedilemedi:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Sunucu hatası", message: error.message });
  }
};

// Oylama konusunu sil
export const deleteVotingTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await VotingTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({ error: "Konu bulunamadı" });
    }

    const topicTitle = topic.title;
    await topic.destroy();

    // Activity log
    await ActivityLog.create({
      adminId: req.admin.id,
      adminUsername: req.admin.username,
      action: "Oylama konusu silindi",
      resourceType: "voting_topic",
      resourceId: id,
      description: topicTitle,
      ipAddress: req.ip,
    });

    res.json({ message: "Oylama konusu başarıyla silindi" });
  } catch (error) {
    console.error("Oylama konusu silinemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Oy verme
export const voteForTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await VotingTopic.findByPk(id);

    if (!topic) {
      return res.status(404).json({ error: "Konu bulunamadı" });
    }

    if (!topic.isActive) {
      return res.status(400).json({ error: "Bu konu aktif değil" });
    }

    await topic.increment("voteCount");

    res.json({
      message: "Oyunuz kaydedildi",
      voteCount: topic.voteCount + 1,
    });
  } catch (error) {
    console.error("Oy kaydedilemedi:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

// Oy sayılarını sıfırla
export const resetVotes = async (req, res) => {
  try {
    await VotingTopic.update({ voteCount: 0 }, { where: {} });

    // Activity log
    await ActivityLog.create({
      adminId: req.admin.id,
      adminUsername: req.admin.username,
      action: "Oylar sıfırlandı",
      resourceType: "voting_topic",
      resourceId: null,
      description: "Tüm oylama konularının oy sayıları sıfırlandı",
      ipAddress: req.ip,
    });

    res.json({ message: "Tüm oylar sıfırlandı" });
  } catch (error) {
    console.error("Oylar sıfırlanamadı:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
