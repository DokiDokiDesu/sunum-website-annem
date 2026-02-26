import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api";

export function Popular() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [popularSeminars, setPopularSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularSeminars();
  }, []);

  const fetchPopularSeminars = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.seminars}?isPopular=true`);
      const data = await response.json();
      setPopularSeminars(data);
    } catch (error) {
      console.error("Popüler seminerler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-10 px-4 md:px-8 w-full overflow-hidden">
      <h2 className="text-3xl font-bold text-white mb-6">En Çok Sevilenler</h2>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      )}

      {!loading && popularSeminars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            Henüz popüler seminer bulunmamaktadır.
          </p>
        </div>
      )}

      <div className="relative w-full">
        {/* Sol Ok */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
        >
          ◀
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {popularSeminars.map((seminar, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-[280px] md:w-[350px] lg:w-[420px] h-72 rounded-lg cursor-pointer group"
              onClick={() => navigate(`/seminar/${seminar.id}`)}
            >
              {/* Rank Number */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start pointer-events-none z-0">
                <span
                  className="text-[220px] font-bold -ml-6"
                  style={{
                    color: "rgb(205,182,98)",
                    WebkitTextStroke: "0px transparent",
                    opacity: 0.9,
                  }}
                >
                  {index + 1}
                </span>
              </div>

              {/* Content Card */}
              <div className="absolute top-1/2 left-8 md:left-12 -translate-y-1/2 w-56 md:w-72 lg:w-80 h-60 rounded-xl overflow-hidden shadow-2xl z-10">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${seminar.image || "/ornek-kart.jpg"})`,
                  }}
                ></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontStyle: "italic" }}
                  >
                    {seminar.title}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {seminar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sağ Ok */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
