import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Seminar = sequelize.define(
  "Seminar",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructor: {
      type: DataTypes.STRING,
      allowNull: true, // Opsiyonel - planlama sırasında eklenebilir (tam ad için)
    },
    instructorTitle: {
      type: DataTypes.STRING,
      allowNull: true, // Eğitmen unvanı (örn: "Prof. Dr.")
    },
    instructorFullName: {
      type: DataTypes.STRING,
      allowNull: true, // Eğitmen tam adı (örn: "Tuna Şare Ağtürk")
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    detailedDescription: {
      type: DataTypes.TEXT,
      allowNull: true, // Seminer detay sayfası için uzun açıklama
    },
    topics: {
      type: DataTypes.TEXT,
      allowNull: true, // JSON string olarak saklanacak - Seminer özeti konuları
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true, // Planlama sırasında girilecek
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: true, // Planlama sırasında girilecek
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dayOfWeek: {
      type: DataTypes.STRING,
      allowNull: true, // Planlama sırasında girilecek
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isUpcoming: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Tarih atanmış mı?
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default Seminar;
