import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admins",
        key: "id",
      },
    },
    adminUsername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "create, update, delete, login, logout, change_password",
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "seminar, category, admin, etc.",
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Ek bilgiler (eski değer, yeni değer, vb.)",
    },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
    updatedAt: false, // Log kayıtları güncellenemez
  },
);

export default ActivityLog;
