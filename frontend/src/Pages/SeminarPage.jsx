import { Header } from "../Components/Header";

export function SeminarPage() {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Arkaplan Resmi */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/ornek-kart.jpg)" }}
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
                <span className="inline-block bg-red-600 text-white px-4 py-1.5 rounded text-sm font-semibold">
                  Sanat
                </span>

                {/* Başlık */}

                {/* Alt Başlık */}
                <h1 className="text-5xl lg:text-6xl font-bold italic leading-tight">
                  Antik Dünyanın Yedi Harikası
                </h1>

                {/* Bilgi Satırı */}
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="bg-gray-700/50 px-3 py-1 rounded">
                    Sanat
                  </span>
                  <span>•</span>

                  <div>
                    <span>tahmini seminer süresi : 2 saat</span>
                  </div>
                  <span>•</span>
                  <div>
                    <span>17/05/2026</span>

                    <span className="ml-5">başlangıç : 20:00</span>
                  </div>
                </div>

                {/* Açıklama */}
                <p className="text-gray-200 text-lg leading-relaxed max-w-2xl">
                  Bu eğitimde, insanlık tarihinin en büyüleyici ve gizemli
                  durakalarına doğru bir yolculuğa çıkacaksınız. Binlerce yıl
                  boyunca varlığını sürdürmeye devam eden, antik dünyanın
                  mühendislik ve sanat şaheserlerinin hikayesini kültürel,
                  politik ve sanatsal bağlamlarıyla ele alacaksınız!
                </p>
              </div>

              {/* Sağ taraf - Fiyat Kutuları */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full py-8">
                {/* Üst Kutu */}
                <div className="flex flex-col justify-center items-center absolute top-16 right-5 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 w-50">
                  <p>Perşembe</p>
                  <p>20:00</p>
                </div>

                {/* Alt Kutu */}
                <div className="flex justify-center lg:justify-end absolute bottom-0 right-5">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/10 w-full max-w-md">
                    <div className="text-center space-y-6">
                      {/* Fiyat */}
                      <div>
                        <p className="text-white text-4xl font-bold mb-2">
                          100 ₺
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            </div>

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
      <div className="h-150 mt-5 flex justify-center">
        {/*seminer hakkında */}
        <div className="w-180 border border-[rgb(36,36,36)] ml-5 h-max mt-10 rounded-3xl overflow-hidden">
          <h2 className="bg-[rgb(36,36,36)] text-2xl py-3 pl-5 font-bold">
            SEMİNER HAKKINDA
          </h2>
          <p className="pt-12 px-10 text-lg text-gray-300 font-light">
            Sanat tarihçisi ve arkeolog Prof. Dr. Tuna Şare Ağtürk tarafından
            özenle hazırlanan “Antik Dünyanın Yedi Harikası” eğitiminde insanlık
            tarihinin en büyüleyici ve gizemli duraklarına doğru bir yolculuğa
            çıkacaksınız. Bu eğitimde, binlerce yıl boyunca varlığını sürdürmeye
            devam eden, antik dünyanın mühendislik ve sanat şaheserlerinin
            hikayesini kültürel, politik ve sanatsal bağlamlarıyla ele
            alacaksınız. İnsanoğlunun ölümsüzlük arayışını, dünyada iz bırakma
            çabasını ve Batı medeniyetinin temel taşlarını oluşturan yedi ikonik
            yapıyı en ince detaylarıyla keşfedeceksiniz. Rodos’tan Mısır’a,
            Babil’den İskenderiye’ye uzanan bu keşifte, antik dönem
            teknolojisinin sınırlarını zorlayan bu “harikaların” nasıl inşa
            edildiğini ve neden “mükemmelliğin” sembolü olarak kabul
            edildiklerini inceleyeceksiniz.
          </p>
          <button className="flex items-center gap-2 text-white text-sm pt-4 justify-self-end mr-5 mb-5">
            <span>Daha fazla oku</span>
            <svg
              className="w-4 h-4"
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
        </div>
        {/*seminer özeti */}
        <div className="w-96 border border-[rgb(36,36,36)] rounded-3xl ml-10 h-max mt-10 overflow-hidden">
          <h2 className="bg-[rgb(36,36,36)] text-2xl py-3 pl-5 font-bold">
            SEMİNER ÖZETİ
          </h2>
          <div className="p-5 space-y-3">
            {/* Liste öğeleri */}
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
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
              <span className="text-gray-300 text-lg">
                Yedi Harikanın Kültürel Mirası
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
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
              <span className="white text-lg">Harika Kavramının Doğuşu</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
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
              <span className="text-gray-300 text-lg">
                Kültürel Bellek ve Hafıza
              </span>
            </div>

            <div className="flex items-center gap-3 ttext-gray-300">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
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
              <span className="text-gray-300 text-lg">
                Mitoloji ve Sanat İlişkisi
              </span>
            </div>

            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0">
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
              <span className="text-gray-300 text-lg">
                Yedi Harikanın Ardındaki Sembolizm
              </span>
            </div>

            {/* Daha fazla oku butonu */}
            <button className="flex items-center gap-2 text-white text-sm pt-4 justify-self-end">
              <span>Daha fazla oku</span>
              <svg
                className="w-4 h-4"
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
          </div>
        </div>
      </div>
    </>
  );
}
