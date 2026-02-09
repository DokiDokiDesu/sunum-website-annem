import { Header } from "../Components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AllSeminar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/seminars");
      const data = await response.json();
      setSeminars(data);
    } catch (error) {
      console.error("Seminerler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "Tüm Seminerler", type: "status" },
    { id: "upcoming", name: "Yaklaşan Seminerler", type: "status" },
    { id: "popular", name: "En Çok Sevilenler", type: "status" },
    { id: "new", name: "Yeni Eklenenler", type: "status" },
    { id: "divider", name: "─────────", type: "divider" },
    { id: "sanat", name: "Sanat", type: "content" },
    { id: "tarih", name: "Tarih", type: "content" },
    { id: "bilim", name: "Bilim", type: "content" },
    { id: "teknoloji", name: "Teknoloji", type: "content" },
    { id: "satis", name: "Satış", type: "content" },
    { id: "pazarlama", name: "Pazarlama", type: "content" },
    { id: "kisisel-gelisim", name: "Kişisel Gelişim", type: "content" },
  ];

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
      // Son 30 gün içinde eklenenler veya yeni işaretlenenler
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const seminarDate = new Date(seminar.createdAt);
      matchesCategory = seminarDate >= thirtyDaysAgo;
    } else {
      matchesCategory = seminar.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12 mt-10 ">
        {/* Başlık */}
        <h1 className="text-white text-4xl  mb-8 font-light">Tüm Seminerler</h1>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Yükleniyor...</p>
          </div>
        )}

        {/* Arama Kutusu */}
        <div className="mb-12">
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

        <div className="flex gap-8">
          {/* Sol Menü - Kategoriler */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-2">
              {categories.map((category) => {
                if (category.type === "divider") {
                  return (
                    <div
                      key={category.id}
                      className="py-2 text-gray-600 text-center pointer-events-none"
                    >
                      {category.name}
                    </div>
                  );
                }

                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`block w-full text-left py-2 px-4 rounded transition-colors ${
                      selectedCategory === category.id
                        ? "bg-red-600 text-white font-semibold"
                        : category.type === "status"
                          ? "text-white hover:bg-gray-800"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white pl-6"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seminer Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeminars.map((seminar) => (
                <div
                  key={seminar.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/seminar/${seminar.id}`)}
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img
                      src={
                        seminar.image
                          ? `http://localhost:5000${seminar.image}`
                          : "/ornek-kart.jpg"
                      }
                      alt={seminar.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-2xl text-white font-light">
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
