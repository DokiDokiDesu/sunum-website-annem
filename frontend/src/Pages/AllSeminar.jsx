import { Header } from "../Components/Header";
import { useState } from "react";

export function AllSeminar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Örnek seminer verileri
  const seminars = [
    {
      id: 1,

      title: "3 Cisim Problemi ve Kaos Kuramı",
      image: "/ornek-kart.jpg",
      category: "new",
    },
    {
      id: 2,

      title: "Ağılığı İş Hayatında Çeviklik",
      image: "/ornek-kart.jpg",
      category: "popular",
    },
    {
      id: 3,

      title: "Ağız Yapısı ve Lezzet Katmanları",
      image: "/ornek-kart.jpg",
      category: "new",
    },
    {
      id: 4,

      title: "Dijital Dönüşüm ve İnovasyon",
      image: "/ornek-kart.jpg",
      category: "finance",
    },
    {
      id: 5,

      title: "Gastronomi ve Yaratıcılık",
      image: "/ornek-kart.jpg",
      category: "entrepreneurship",
    },
    {
      id: 6,

      title: "Modern Fizik ve Kuantum Mekaniği",
      image: "/ornek-kart.jpg",
      category: "new",
    },
  ];

  const categories = [
    { id: "new", name: "Yaklaşan Seminerler" },
    { id: "all", name: "Tüm Seminerler" },
    { id: "popular", name: "En Çok Sevilenler" },
    { id: "finance", name: "sanat", parent: "success" },
    { id: "entrepreneurship", name: "tarih", parent: "success" },
    { id: "sales", name: "Satış", parent: "success" },
    { id: "marketing", name: "Pazarlama", parent: "success" },
  ];

  const filteredSeminars = seminars.filter((seminar) => {
    const matchesSearch = seminar.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || seminar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12 mt-10 ">
        {/* Başlık */}
        <h1 className="text-white text-4xl  mb-8 font-light">Tüm Seminerler</h1>

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
                if (category.parent === "success") {
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left pl-6 py-2 rounded transition-colors ${
                        selectedCategory === category.id
                          ? "text-red-500 font-semibold"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {category.name}
                    </button>
                  );
                }
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`block w-full text-left py-2 rounded transition-colors ${
                        selectedCategory === category.id
                          ? "text-red-500 font-semibold"
                          : "text-white hover:text-gray-300"
                      }`}
                    >
                      {category.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seminer Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeminars.map((seminar) => (
                <div key={seminar.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img
                      src={seminar.image}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p
                        className="text-2xl text-white font-light
                      "
                      >
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
