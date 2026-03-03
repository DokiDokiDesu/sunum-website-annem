import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import { Header } from "../Components/Header";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import { Footer } from "../Components/Footer";

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
      <div className="relative w-full overflow-hidden">
        {/* Desktop Arkaplan Resmi - sadece desktop'ta göster */}
        <div
          className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${seminar.image || "/ornek-kart.jpg"})`,
          }}
        >
          {/* Koyu overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black"></div>
        </div>

        {/* İçerik Wrapper - Mobil ve Desktop */}
        <div className="relative">
          {/* Mobil Görünüm (< lg) */}
          <div className="lg:hidden bg-black">
            {/* Mobil için resim üstte */}
            <div className="w-full h-64 relative overflow-hidden">
              <img
                src={seminar.image || "/ornek-kart.jpg"}
                alt={seminar.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay - altta kararmaya başlar */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>

              {/* Resmin üzerine kategori badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold capitalize">
                  {seminar.category}
                </span>
              </div>
            </div>

            {/* İçerik - resmin altında */}
            <div className="px-4 pt-6 pb-8 space-y-6 max-w-full overflow-hidden">
              {/* Başlık */}
              <h1
                className="text-3xl font-bold text-white leading-tight"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {seminar.title}
              </h1>

              {/* Bilgi Satırı - Kategori ve Süre */}
              <div className="flex items-center gap-2 flex-wrap text-gray-300 text-xs">
                <span className="capitalize">{seminar.category}</span>
                {seminar.duration && seminar.isScheduled && (
                  <>
                    <span>•</span>
                    <span>{seminar.duration}</span>
                  </>
                )}
              </div>

              {/* Açıklama */}
              <p
                className="text-gray-300 text-sm leading-relaxed"
                style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                }}
              >
                {seminar.description}
              </p>

              {/* Bilgi Kutuları - Mobilde yan yana 3 kutu */}
              {seminar.isScheduled && (
                <div className="grid grid-cols-3 gap-2">
                  {/* Tahmini Süre */}
                  {seminar.duration && (
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Süre</p>
                      <p className="text-white text-sm font-semibold">
                        {seminar.duration}
                      </p>
                    </div>
                  )}

                  {/* Tarih */}
                  {seminar.date && (
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Tarih</p>
                      <p className="text-white text-sm font-semibold">
                        {dayjs(seminar.date).format("DD MMM")}
                      </p>
                    </div>
                  )}

                  {/* Başlangıç Saati */}
                  {seminar.startTime && (
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-xs mb-1">Saat</p>
                      <p className="text-white text-sm font-semibold">
                        {seminar.startTime}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Fiyat ve Rezervasyon */}
              {seminar.isScheduled ? (
                seminar.price && (
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex items-center justify-center">
                    <div className="flex items-center justify-center mb-4">
                      <p className="text-white text-3xl font-bold mt-4 mr-3 whitespace-nowrap">
                        {new Intl.NumberFormat("tr-TR", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        }).format(Number(seminar.price))}
                        ₺
                      </p>
                      {/*   <p className="text-white text-3xl font-bold mt-4">₺</p>*/}
                    </div>
                    <button className="w-40 ml-5 bg-black border border-white text-white font-bold py-3  rounded-lg hover:bg-red-700 transition-all duration-300">
                      Rezervasyon Yap
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                  <div className="text-gray-400 mb-3">
                    <svg
                      className="w-12 h-12 mx-auto"
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
                  <p className="text-white text-base font-semibold mb-2">
                    Yakın zamanda planlama yok
                  </p>
                  <p className="text-gray-400 text-xs">
                    Yeni tarihleri için takipte kalın
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Görünüm (>= lg) */}
          <div className="hidden lg:block min-h-screen">
            <div className="h-full flex items-center">
              <div className="w-full max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Sol taraf - İçerik */}
                  <div className="lg:col-span-7 text-white space-y-6 max-w-full overflow-hidden">
                    {/* Kategori Badge */}
                    <span className="inline-block bg-red-600 text-white px-4 py-1.5 rounded text-sm font-semibold capitalize">
                      {seminar.category}
                    </span>

                    {/* Başlık */}
                    <h1
                      className="text-5xl lg:text-6xl font-bold italic leading-tight"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {seminar.title}
                    </h1>

                    {/* Bilgi Satırı */}
                    <div className="flex items-center gap-4 text-sm text-gray-300 flex-wrap">
                      <span className="bg-gray-700/50 px-3 py-1 rounded capitalize">
                        {seminar.category}
                      </span>

                      {seminar.isScheduled && (
                        <>
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
                        </>
                      )}
                    </div>

                    {/* Açıklama */}
                    <p
                      className="text-gray-200 text-lg leading-relaxed max-w-2xl"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {seminar.description}
                    </p>
                  </div>

                  {/* Sağ taraf - Fiyat Kutuları */}
                  <div className="lg:col-span-5 relative h-full min-h-[600px]">
                    {/* Üst Kutu */}
                    {seminar.isScheduled && seminar.dayOfWeek && (
                      <div className="flex flex-col justify-center items-center lg:absolute lg:top-5 lg:right-10 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-4 mb-4 font-bold text-2xl  lg:mb-0">
                        <p>{formattedDay}</p>
                        {seminar.startTime && <p>{seminar.startTime}</p>}
                      </div>
                    )}

                    {/* Alt Kutu */}
                    {seminar.isScheduled ? (
                      // Seminer planlanmışsa - Fiyat ve Rezervasyon göster
                      seminar.price && (
                        <div className="flex justify-center lg:justify-end lg:absolute lg:bottom-0 lg:right-0 w-full lg:w-auto">
                          <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 w-full max-w-md lg:max-w-sm">
                            <div className="text-center space-y-6">
                              {/* Fiyat */}
                              <div>
                                <p className="text-white text-4xl font-bold mb-2 whitespace-nowrap">
                                  {seminar.price}₺
                                </p>
                              </div>

                              {/* Butonlar */}
                              <div className="space-y-3">
                                <button className="w-full border-1 border-white text-white font-bold py-4 rounded-md hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2">
                                  <span className="text-xl mx-2">
                                    Rezervasyon Yap
                                  </span>
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
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-60">
            {/* Eğitmenle Canlı Soru-Cevap */}
            <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 text-white"
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
              <h3 className="text-white text-lg md:text-xl font-bold">
                EĞİTMENLE CANLI
                <br />
                SORU - CEVAP
              </h3>
            </div>

            {/* Ekstra İçerikler */}
            <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 text-white"
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
              <h3 className="text-white text-lg md:text-xl font-bold">
                EKSTRA İÇERİKLER
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/*mid section */}
      <div className="mt-5 flex flex-col lg:flex-row justify-center items-start px-4 md:px-8 gap-6 lg:gap-0">
        {/*seminer hakkında */}
        <div className="w-full lg:max-w-2xl border border-[rgb(36,36,36)] lg:ml-5 h-max mt-0 lg:mt-10 rounded-3xl overflow-hidden">
          <h2 className="bg-[rgb(36,36,36)] text-xl md:text-2xl py-3 pl-4 md:pl-5 font-bold">
            SEMİNER HAKKINDA
          </h2>
          <div
            ref={aboutRef}
            className={`transition-all duration-300 overflow-hidden ${
              isAboutExpanded ? "max-h-[2000px]" : "max-h-60"
            }`}
          >
            <p className="pt-8 md:pt-12 px-6 md:px-10 pb-6 text-base md:text-lg text-gray-300 font-light break-words whitespace-normal">
              {seminar.detailedDescription || seminar.description}
            </p>
          </div>
          {showAboutButton && (
            <button
              onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              className="flex items-center gap-2 text-white text-sm pt-4 ml-auto mr-4 md:mr-5 mb-5 hover:text-red-500 transition-colors"
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
        <div className="w-full lg:max-w-md border border-[rgb(36,36,36)] rounded-3xl lg:ml-10 h-max mt-0 lg:mt-10 overflow-hidden">
          <h2 className="bg-[rgb(36,36,36)] text-xl md:text-2xl py-3 pl-4 md:pl-5 font-bold">
            SEMİNER ÖZETİ
          </h2>
          <div className="p-4 md:p-5">
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
                    className="flex items-start gap-2 md:gap-3 text-gray-300"
                  >
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg
                        className="w-2.5 h-2.5 md:w-3 md:h-3"
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
                    <span className="text-base md:text-lg break-words flex-1">
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
      <Footer />
    </>
  );
}
