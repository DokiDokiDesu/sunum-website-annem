import Category from "../models/Category.js";
import { Op } from "sequelize";

// Tüm kategorileri getir
export const getAllCategories = async (req, res) => {
  try {
    const { active } = req.query;

    let where = {};

    if (active !== undefined) {
      where.isActive = active === "true";
    }

    const categories = await Category.findAll({
      where,
      order: [
        ["order", "ASC"],
        ["name", "ASC"],
      ],
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Tek kategori getir
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Yeni kategori oluştur
export const createCategory = async (req, res) => {
  try {
    const { name, slug, showInMenu, highlight, order } = req.body;

    // Slug kontrolü
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({ message: "Bu slug zaten kullanılıyor" });
    }

    const category = await Category.create({
      name,
      slug,
      showInMenu: showInMenu !== undefined ? showInMenu : true,
      highlight: highlight || false,
      order: order || 0,
    });

    res
      .status(201)
      .json({ message: "Kategori başarıyla oluşturuldu", category });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Kategori güncelle
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    // Slug değiştiriliyorsa kontrol et
    if (req.body.slug && req.body.slug !== category.slug) {
      const existingCategory = await Category.findOne({
        where: { slug: req.body.slug },
      });
      if (existingCategory) {
        return res.status(400).json({ message: "Bu slug zaten kullanılıyor" });
      }
    }

    await category.update(req.body);
    res.json({ message: "Kategori başarıyla güncellendi", category });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Kategori sil
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    await category.destroy();
    res.json({ message: "Kategori başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Kategori durumunu değiştir (aktif/pasif)
export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    await category.update({ isActive: !category.isActive });
    res.json({
      message: `Kategori ${category.isActive ? "aktif" : "pasif"} edildi`,
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
