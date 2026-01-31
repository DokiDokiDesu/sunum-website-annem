import { useRef } from "react";

export function Incoming() {
  const scrollContainerRef = useRef(null);

  const educators = [
    {
      name: "Rüzgar Mira Okan",
      topic: "Zarafet, Nezaket ve Görgü",
      image: "ornek-kart.jpg",
      isNew: true,
    },
    {
      name: "Elçin Biren",
      topic:
        "Yapay Zeka Çağında Ebeveynlik: Dijital Okuryazarlık ve Siber Güvenlik",
      image: "ornek-kart.jpg",
      isNew: true,
    },
    {
      name: "Prof. Dr. Tuna Şare Ağtürk",
      topic: "Antik Dünyanın Yedi Harikası",
      image: "ornek-kart.jpg",
      isNew: true,
    },
    {
      name: "Levon Bağış",
      topic: "Fermantasyondan Damıtmaya: Distile İçkilerin Tarihi ve Kültürü",
      image: "ornek-kart.jpg",
      isNew: true,
    },
    {
      name: "Prof. Dr. Tonguç Rado",
      topic: "Kuantum Fiziğine Giriş",
      image: "ornek-kart.jpg",
      isNew: true,
    },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-10 px-8 w-full overflow-hidden mt-20">
      <h2 className="text-3xl font-bold text-white mb-6">
        Yaklaşan Seminerler
      </h2>

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
          className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {educators.map((educator, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-72 h-96 rounded-lg overflow-hidden cursor-pointer group"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${educator.image})`,
                }}
              ></div>

              {/* New Badge */}
              {educator.isNew && (
                <>
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    14/05/2026
                  </span>

                  <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Yarın
                  </span>
                </>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ fontStyle: "italic" }}
                >
                  {educator.name}
                </h3>
                <p className="text-sm opacity-90">{educator.topic}</p>
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
