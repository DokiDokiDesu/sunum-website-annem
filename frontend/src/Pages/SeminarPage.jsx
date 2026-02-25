import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import { Header } from "../Components/Header";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

export function SeminarPage() {
  const { id } = useParams();
  const [seminar, setSeminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [showAboutButton, setShowAboutButton] = useState(false);
  const [showSummaryButton, setShowSummaryButton] = useState(false);

  const aboutRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    fetchSeminar();
  }, [id]);

  useEffect(() => {
    // İçerik yüklendikten sonra overflow kontrolü yap
    const checkOverflow = () => {
      if (aboutRef.current) {
        // 240px (max-h-60 = 15rem = 240px)
        const maxHeight = 240;
        setShowAboutButton(aboutRef.current.scrollHeight > maxHeight);
      }
      if (summaryRef.current) {
        // 272px (max-h-68 = 17rem = 272px)
        const maxHeight = 272;
        setShowSummaryButton(summaryRef.current.scrollHeight > maxHeight);
      }
    };

    // Biraz gecikme ekle, içerik render olduktan sonra kontrol et
    if (seminar) {
      setTimeout(checkOverflow, 100);
    }
  }, [seminar]);

  const fetchSeminar = async () => {
    try {
      console.log("Fetching seminar with ID:", id);
      const response = await fetch(API_ENDPOINTS.seminarById(id));
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Seminar data:", data);
      setSeminar(data);
    } catch (err) {
      console.error("Seminer yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Yükleniyor...</div>
        </div>
      </>
    );
  }

  if (!seminar) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Seminer bulunamadı</div>
        </div>
      </>
    );
  }

  // Topics'i parse et
  const topics = seminar.topics
    ? seminar.topics.split("\n").filter((topic) => topic.trim() !== "")
    : [];

  // Tarihi formatla
  const formattedDate = seminar.date
    ? dayjs(seminar.date).format("DD MMMM YYYY")
    : "";

  // Gün adını büyük harfle başlat
  const formattedDay = seminar.dayOfWeek
    ? seminar.dayOfWeek.charAt(0).toUpperCase() + seminar.dayOfWeek.slice(1)
    : "";

  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Arkaplan Resmi */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${seminar.image || "/ornek-kart.jpg"})`,
          }}
        >
          {/* Koyu overlay - soldan sağa gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          {/* Alta doğru yumuşak siyah geçiş */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        </div>

        {/* İçerik Wrapper */}
        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sol taraf - İçerik */}
              <div className="lg:col-span-7 text-white space-y-6">
                {/* Kategori Badge */}
                <span className="inline-block bg-red-600 text-white px-4 py-1.5 rounded text-sm font-semibold capitalize">
                  {seminar.category}
                </span>

                {/* Başlık */}

                {/* Alt Başlık */}
                <h1 className="text-5xl lg:text-6xl font-bold italic leading-tight">
                  {seminar.title}
                </h1>

                {/* Bilgi Satırı */}
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="bg-gray-700/50 px-3 py-1 rounded capitalize">
                    {seminar.category}
                  </span>
                  <span>•</span>

                  {seminar.duration && (
                    <>
                      <div>
                        <span>tahmini süre : {seminar.duration}</span>
                      </div>
                      <span>•</span>
                    </>
                  )}
                  {seminar.date && (
                    <div>
                      <span>{formattedDate}</span>
                      {seminar.startTime && (
                        <span className="ml-5">
                          başlangıç : {seminar.startTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Açıklama */}
                <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">
                  {seminar.description}
                </p>
              </div>

              {/* Sağ taraf - Fiyat Kutuları */}
              <div className="lg:col-span-5 relative h-full min-h-[600px]">
                {/* Üst Kutu */}
                {seminar.dayOfWeek && (
                  <div className="flex flex-col justify-center items-center lg:absolute lg:top-12 lg:right-15 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-2 mb-4 lg:mb-0">
                    <p>{formattedDay}</p>
                    {seminar.startTime && <p>{seminar.startTime}</p>}
                  </div>
                )}

                {/* Alt Kutu */}
                {seminar.isScheduled ? (
                  // Seminer planlanmışsa - Fiyat ve Rezervasyon göster
                  seminar.price && (
                    <div className="flex justify-center lg:justify-end lg:absolute lg:bottom-0 lg:right-0 w-full lg:w-auto">
                      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10 w-full max-w-md lg:max-w-sm">
                        <div className="text-center space-y-6">
                          {/* Fiyat */}
                          <div>
                            <p className="text-white text-4xl font-bold mb-2">
                              {seminar.price} ₺
                            </p>
                          </div>

                          {/* Butonlar */}
                          <div className="space-y-3">
                            <button className="w-full border-2 border-white text-white font-bold py-4 rounded-md hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                              <span className="text-xl">Rezervasyon Yap</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  // Seminer planlanmamışsa - Bilgilendirme mesajı göster
                  <div className="flex justify-center lg:justify-end lg:absolute lg:bottom-0 lg:right-0 w-full lg:w-auto">
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10 w-full max-w-md lg:max-w-sm">
                      <div className="text-center space-y-4">
                        <div className="text-gray-400">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-white text-lg font-semibold">
                          Yakın zamanda bu seminer için bir planlama yok
                        </p>
                        <p className="text-gray-400 text-sm">
                          Bu seminerin yeni tarihleri için takipte kalın
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-60">
            {/* Eğitmenle Canlı Soru-Cevap */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold">
                EĞİTMENLE CANLI
                <br />
                SORU - CEVAP
              </h3>
            </div>

            {/* Eğitmen İmzalı Sertifika */}
            {/*<div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5h2m0 0h2m-2 0v2m0-2V3"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold">
                EĞİTMEN İMZALI
                <br />
                SERTİFİKA
              </h3>
            </div> */}

            {/* Ekstra İçerikler */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold">EKSTRA İÇERİKLER</h3>
            </div>
          </div>
        </div>
      </div>

      {/*mid section */}
      <div className="mt-5 flex justify-center">
        {/*seminer hakkında */}
        <div className="w-full max-w-2xl border border-[rgb(36,36,36)] ml-0 md:ml-5 h-max mt-10 rounded-3xl overflow-hidden">
          <h2 className="bg-[rgb(36,36,36)] text-2xl py-3 pl-5 font-bold">
            SEMİNER HAKKINDA
          </h2>
          <div
            ref={aboutRef}
            className={`transition-all duration-300 overflow-hidden ${
              isAboutExpanded ? "max-h-[2000px]" : "max-h-60"
            }`}
          >
            <p className="pt-12 px-10 pb-6 text-lg text-gray-300 font-light break-words whitespace-normal">
              {seminar.detailedDescription || seminar.description}
            </p>
          </div>
          {showAboutButton && (
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="flex items-center gap-2 text-white text-sm pt-4 ml-auto mr-5 mb-5 hover:text-red-500 transition-colors"
            >
              <span>
                {isAboutExpanded ? "Daha az göster" : "Daha fazla oku"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  isAboutExpanded ? "rotate-180" : ""
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
          )}
        </div>
        {/*seminer özeti */}
        <div className="w-full max-w-md border border-[rgb(36,36,36)] rounded-3xl ml-0 md:ml-10 h-max mt-10 overflow-hidden">
          <h2 className="bg-[rgb(36,36,36)] text-2xl py-3 pl-5 font-bold">
            SEMİNER ÖZETİ
          </h2>
          <div className="p-5">
            <div
              ref={summaryRef}
              className={`transition-all duration-300 overflow-hidden space-y-3 ${
                isSummaryExpanded ? "max-h-[2000px]" : "max-h-68"
              }`}
            >
              {/* Liste öğeleri */}
              {topics.length > 0 ? (
                topics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-lg break-words flex-1">
                      {topic}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Henüz konu eklenmemiş</p>
              )}
            </div>

            {/* Daha fazla oku butonu */}
            {showSummaryButton && (
              <button
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                className="flex items-center gap-2 text-white text-sm pt-4 hover:text-red-500 transition-colors"
              >
                <span>
                  {isSummaryExpanded ? "Daha az göster" : "Daha fazla oku"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isSummaryExpanded ? "rotate-180" : ""
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
