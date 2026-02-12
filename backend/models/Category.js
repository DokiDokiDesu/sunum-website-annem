import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    showInMenu: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Header menüsünde gösterilsin mi",
    },
    highlight: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: "Header menüsünde vurgu rengi (kırmızı) gösterilsin mi",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Sıralama için",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  },
);

export default Category;
