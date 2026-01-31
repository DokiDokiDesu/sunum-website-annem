import { useRef } from "react";

export function Popular() {
  const scrollContainerRef = useRef(null);

  const popularSeminars = [
    {
      rank: 1,
      instructor: "Rüzgar Mira Okan",
      topic: "Zarafet, Nezaket ve Görgü",
      description:
        "Modern dünyada zarafet ve görgü kurallarının önemi, sosyal ilişkilerde nasıl uygulanacağı üzerine kapsamlı bir seminer.",
      image: "ornek-kart.jpg",
    },
    {
      rank: 2,
      instructor: "Enis Arslan",
      topic: "Erteleme(me)",
      description:
        "Erteleme alışkanlığının psikolojik nedenleri ve bu durumun üstesinden gelme stratejileri.",
      image: "ornek-kart.jpg",
    },
    {
      rank: 3,
      instructor: "Prof. Dr. Tuna Şare Ağtürk",
      topic: "Antik Dünyanın Yedi Harikası",
      description:
        "Antik çağın muhteşem yapıları ve bu eserlerin tarihsel önemi üzerine detaylı bir inceleme.",
      image: "ornek-kart.jpg",
    },
    {
      rank: 4,
      instructor: "Elçin Biren",
      topic: "Yapay Zeka Çağında Ebeveynlik",
      description:
        "Dijital çağda çocuk yetiştirme, teknoloji kullanımı ve siber güvenlik konularında ailelere rehberlik.",
      image: "ornek-kart.jpg",
    },
    {
      rank: 5,
      instructor: "Prof. Dr. Tonguç Rado",
      topic: "Kuantum Fiziğine Giriş",
      description:
        "Kuantum mekaniğinin temel prensipleri ve günlük hayattaki uygulamaları hakkında giriş seviyesi anlatım.",
      image: "ornek-kart.jpg",
    },
  ];

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
    <div className="py-10 px-8 w-full overflow-hidden">
      <h2 className="text-3xl font-bold text-white mb-6">En Çok Sevilenler</h2>

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
          className="flex gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {popularSeminars.map((seminar, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-[420px] h-72 rounded-lg cursor-pointer group"
            >
              {/* Rank Number */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-start pointer-events-none z-0">
                <span
                  className="text-[220px] font-bold -ml-6"
                  style={{
                    color: "#dc2626",
                    WebkitTextStroke: "0px transparent",
                    opacity: 0.9,
                  }}
                >
                  {seminar.rank}
                </span>
              </div>

              {/* Content Card */}
              <div className="absolute top-1/2 left-12 -translate-y-1/2 w-80 h-60 rounded-xl overflow-hidden shadow-2xl z-10">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${seminar.image})`,
                  }}
                ></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontStyle: "italic" }}
                  >
                    {seminar.topic}
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
