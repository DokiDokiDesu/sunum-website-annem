import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  // Kategorileri backend'den çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.categories}?active=true`);
        const data = await response.json();
        // Footer için en fazla 6 kategori göster
        const footerCategories = data
          .filter((cat) => cat.showInMenu)
          .slice(0, 6);
        setCategories(footerCategories);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <div className="h-[1px] bg-[rgb(220,193,128)]"></div>
      {/* Main Footer */}
      <footer className="bg-[rgb(40,40,40)] text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* 4 Sütun Yapısı */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* 1. Sütun - Logo */}
            <div>
              <img src="logo-header.png" alt="Logo" className="h-16" />
            </div>

            {/* 2. Sütun - Hızlı Bağlantılar */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-sm uppercase tracking-wide text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm uppercase tracking-wide text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                  >
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link
                    to="/all-seminar"
                    className="text-sm uppercase tracking-wide text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                  >
                    Tüm Seminerler
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm uppercase tracking-wide text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                  >
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Sütun - Kategoriler */}
            <div>
              <h3 className="text-[rgb(205,182,98)] text-sm font-bold uppercase tracking-wide mb-4">
                Kategoriler
              </h3>
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      to={`/all-seminar?category=${category.slug}`}
                      className="text-sm uppercase tracking-wide text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Sütun - İletişim Kartı */}
            <div>
              <h3 className="text-[rgb(205,182,98)] text-sm font-bold uppercase tracking-wide mb-4">
                İletişim
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <FaMapMarkerAlt className="text-[rgb(205,182,98)] mt-1 flex-shrink-0 text-sm" />
                  <span className="text-xs leading-relaxed text-[rgb(230,206,175)]">
                    Atatürk Mah. Örnek Cad. No:123
                    <br />
                    İstanbul, Türkiye
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <FaPhone className="text-[rgb(205,182,98)] flex-shrink-0 text-sm" />
                  <a
                    href="tel:+902121234567"
                    className="text-xs text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                  >
                    +90 (212) 123 45 67
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <FaEnvelope className="text-[rgb(205,182,98)] flex-shrink-0 text-sm" />
                  <a
                    href="mailto:info@example.com"
                    className="text-xs text-[rgb(230,206,175)] hover:text-[rgb(205,182,98)] transition-colors duration-300"
                  >
                    info@example.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Ayırıcı Çizgi */}
          <div className="border-t border-gray-600 my-8"></div>

          {/* Sosyal Medya İkonları */}
          <div className="flex justify-center space-x-4 mb-6">
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-[rgb(205,182,98)] hover:bg-[rgb(205,182,98)] transition-all duration-300 group"
              title="Instagram"
            >
              <FaInstagram
                size={20}
                className="text-gray-400 group-hover:text-white transition-colors duration-300"
              />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-[rgb(205,182,98)] hover:bg-[rgb(205,182,98)] transition-all duration-300 group"
              title="YouTube"
            >
              <FaYoutube
                size={20}
                className="text-gray-400 group-hover:text-white transition-colors duration-300"
              />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-[rgb(205,182,98)] hover:bg-[rgb(205,182,98)] transition-all duration-300 group"
              title="WhatsApp"
            >
              <FaWhatsapp
                size={20}
                className="text-gray-400 group-hover:text-white transition-colors duration-300"
              />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-[rgb(205,182,98)] hover:bg-[rgb(205,182,98)] transition-all duration-300 group"
              title="Twitter"
            >
              <FaTwitter
                size={20}
                className="text-gray-400 group-hover:text-white transition-colors duration-300"
              />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-[rgb(205,182,98)] hover:bg-[rgb(205,182,98)] transition-all duration-300 group"
              title="LinkedIn"
            >
              <FaLinkedinIn
                size={20}
                className="text-gray-400 group-hover:text-white transition-colors duration-300"
              />
            </a>
          </div>

          {/* Copyright */}
        </div>
      </footer>
    </>
  );
}
