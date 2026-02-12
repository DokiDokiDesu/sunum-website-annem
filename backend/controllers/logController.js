import ActivityLog from "../models/ActivityLog.js";
import Admin from "../models/Admin.js";
import { Op } from "sequelize";
import sequelize from "../config/database.js";

// Tüm logları getir (sadece superadmin)
export const getAllLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      adminId,
      action,
      resourceType,
      startDate,
      endDate,
    } = req.query;

    const where = {};

    if (adminId) where.adminId = adminId;
    if (action) where.action = action;
    if (resourceType) where.resourceType = resourceType;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      logs: rows,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Log istatistikleri (sadece superadmin)
export const getLogStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Toplam log sayısı
    const totalLogs = await ActivityLog.count({ where });

    // Eylem bazında dağılım
    const actionStats = await ActivityLog.findAll({
      where,
      attributes: [
        "action",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["action"],
      raw: true,
    });

    // Resource bazında dağılım
    const resourceStats = await ActivityLog.findAll({
      where,
      attributes: [
        "resourceType",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["resourceType"],
      raw: true,
    });

    // Admin bazında dağılım
    const adminStats = await ActivityLog.findAll({
      where,
      attributes: [
        "adminId",
        "adminUsername",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["adminId", "adminUsername"],
      order: [[sequelize.fn("COUNT", sequelize.col("id")), "DESC"]],
      raw: true,
    });

    res.json({
      totalLogs,
      actionStats,
      resourceStats,
      adminStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Son aktiviteler
export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const logs = await ActivityLog.findAll({
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
