import { Header } from "../Components/Header";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AllSeminar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [seminars, setSeminars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchSeminars();
    fetchCategories();

    // URL'den kategori parametresini al
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const fetchSeminars = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.seminars);
      const data = await response.json();
      setSeminars(data);
    } catch (error) {
      console.error("Seminerler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.categories}?active=true`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Kategoriler yüklenemedi:", error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  const getCategoryLabel = () => {
    if (selectedCategory === "all") return "Tüm Eğitimler";
    if (selectedCategory === "upcoming") return "Yaklaşan Seminerler";
    if (selectedCategory === "popular") return "En Çok Sevilenler";
    if (selectedCategory === "new") return "Yeni Eklenenler";

    const category = categories.find((cat) => cat.slug === selectedCategory);
    return category ? category.name : "Tüm Eğitimler";
  };

  const filteredSeminars = seminars.filter((seminar) => {
    const matchesSearch = seminar.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    let matchesCategory = true;

    if (selectedCategory === "all") {
      matchesCategory = true;
    } else if (selectedCategory === "upcoming") {
      matchesCategory = seminar.isUpcoming === true;
    } else if (selectedCategory === "popular") {
      matchesCategory = seminar.isPopular === true;
    } else if (selectedCategory === "new") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const seminarDate = new Date(seminar.createdAt);
      matchesCategory = seminarDate >= thirtyDaysAgo;
    } else {
      // İçerik kategorileri - slug ile eşleştir
      matchesCategory = seminar.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12 mt-10 ">
        {/* Başlık */}
        <h1 className="text-white text-4xl mb-8 font-light">Tüm Eğitimler</h1>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Yükleniyor...</p>
          </div>
        )}

        {/* Arama Kutusu */}
        <div className="mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="İlgini Çekebilecek Eğitimleri Ara"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white px-6 py-4 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-500"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>

        {/* Mobil Dropdown - Sadece mobilde göster */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#1a1a1a] text-white px-6 py-4 rounded-lg border border-gray-700 flex items-center justify-between"
            >
              <span>{getCategoryLabel()}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {/* Sabit Kategoriler */}
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`block w-full text-left py-3 px-6 transition-colors ${
                      selectedCategory === "all"
                        ? "bg-red-600 text-white font-semibold"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    Tüm Eğitimler
                  </button>
                  <button
                    onClick={() => handleCategorySelect("upcoming")}
                    className={`block w-full text-left py-3 px-6 transition-colors ${
                      selectedCategory === "upcoming"
                        ? "bg-red-600 text-white font-semibold"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    Yaklaşan Seminerler
                  </button>
                  <button
                    onClick={() => handleCategorySelect("popular")}
                    className={`block w-full text-left py-3 px-6 transition-colors ${
                      selectedCategory === "popular"
                        ? "bg-red-600 text-white font-semibold"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    En Çok Sevilenler
                  </button>
                  <button
                    onClick={() => handleCategorySelect("new")}
                    className={`block w-full text-left py-3 px-6 transition-colors ${
                      selectedCategory === "new"
                        ? "bg-red-600 text-white font-semibold"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    Yeni Eklenenler
                  </button>

                  {/* Ayırıcı */}
                  {categories.length > 0 && (
                    <div className="border-t border-gray-700 my-2"></div>
                  )}

                  {/* Dinamik Kategoriler */}
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.slug)}
                      className={`block w-full text-left py-3 px-6 transition-colors ${
                        selectedCategory === category.slug
                          ? "bg-red-600 text-white font-semibold"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sol Menü - Sadece Desktop'ta göster */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-2">
              {/* Sabit Durum Filtreleri */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`block w-full text-left py-2 px-4 rounded transition-colors ${
                  selectedCategory === "all"
                    ? "bg-red-600 text-white font-semibold"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                Tüm Seminerler
              </button>
              <button
                onClick={() => setSelectedCategory("upcoming")}
                className={`block w-full text-left py-2 px-4 rounded transition-colors ${
                  selectedCategory === "upcoming"
                    ? "bg-red-600 text-white font-semibold"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                Yaklaşan Seminerler
              </button>
              <button
                onClick={() => setSelectedCategory("popular")}
                className={`block w-full text-left py-2 px-4 rounded transition-colors ${
                  selectedCategory === "popular"
                    ? "bg-red-600 text-white font-semibold"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                En Çok Sevilenler
              </button>
              <button
                onClick={() => setSelectedCategory("new")}
                className={`block w-full text-left py-2 px-4 rounded transition-colors ${
                  selectedCategory === "new"
                    ? "bg-red-600 text-white font-semibold"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                Yeni Eklenenler
              </button>

              {/* Ayırıcı */}
              <div className="py-2 text-gray-600 text-center pointer-events-none">
                ─────────
              </div>

              {/* Dinamik İçerik Kategorileri */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`block w-full text-left py-2 px-4 rounded transition-colors pl-6 ${
                    selectedCategory === category.slug
                      ? "bg-red-600 text-white font-semibold"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Seminer Grid - Mobilde 2, Desktop'ta 3 sütun */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredSeminars.map((seminar) => (
                <div
                  key={seminar.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/seminar/${seminar.id}`)}
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={seminar.image || "/ornek-kart.jpg"}
                      alt={seminar.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 text-white">
                      <p className="text-sm md:text-2xl text-white font-light line-clamp-2">
                        {seminar.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredSeminars.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  Aradığınız kriterlere uygun eğitim bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
