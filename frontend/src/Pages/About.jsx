import { Header } from "../Components/Header";

export function About() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto bg-gradient-to-b from-black via-[rgb(20,20,20)] to-black">
          <h1
            className="text-5xl md:text-6xl font-bold mb-8 text-center"
            style={{ fontStyle: "italic" }}
          >
            Platon Academia
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 text-center leading-relaxed mb-16">
            Düşüncenin köklerine uzanan bir kültür yolculuğudur.
          </p>

          {/* Divider */}
          <div className="flex justify-center mb-16">
            <div className="h-1 w-24 bg-red-500"></div>
          </div>

          {/* Vision Section */}
          <div className="space-y-8 mb-20">
            {/* İlham Card - Sola yaslanmış */}
            <div className="max-w-full md:max-w-4xl mr-auto">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 md:p-10 rounded-lg border border-neutral-700 hover:border-red-500/70 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="flex items-center mb-6">
                  <h2
                    className="text-3xl font-bold text-red-500"
                    style={{ fontStyle: "italic" }}
                  >
                    İlham
                  </h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Antik dünyanın en güçlü fikir geleneğinden ilham alarak;
                  tarihi, kültürü, sanatı ve felsefeyi yalnızca anlatılan değil,{" "}
                  <span className="text-white font-semibold">
                    birlikte düşünülen
                  </span>{" "}
                  bir alana dönüştürmeyi amaçlar.
                </p>
              </div>
            </div>

            {/* Platform Card - Sağa kayık */}
            <div className="max-w-full md:max-w-4xl ml-auto">
              <div className="bg-gradient-to-bl from-neutral-900 to-neutral-800 p-6 md:p-10 rounded-lg border border-neutral-700 hover:border-red-500/70 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
                <div className="flex items-center justify-end mb-6">
                  <h2
                    className="text-3xl font-bold text-red-500 mr-4"
                    style={{ fontStyle: "italic" }}
                  >
                    Platform
                  </h2>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed text-right">
                  Bu platform, yıllara yayılan birikimlerin doğal bir
                  buluşmasıdır. Sanat tarihçi anlatımı ve akademik derinliğiyle
                  Lalehan'ın bilgi hazinesi; kültür yolculukları, organizasyon
                  tecrübesi ve seçkin içerik üretimiyle Sogno'nun birikimi,
                  Platon'un düşünce mirasıyla aynı zeminde buluşmuştur.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-12 rounded-lg mb-20 border-l-4 border-red-500">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontStyle: "italic" }}
            >
              Misyonumuz
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-4">
              Biz burada yalnızca bilgi paylaşmıyoruz.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed mb-4">
              Sorular soruyor, katmanları açıyor, geçmişle bugünü aynı masada
              buluşturuyoruz.
            </p>
            <p className="text-2xl text-white font-semibold leading-relaxed">
              Çünkü kültür, izleyici olmak değil;{" "}
              <span className="text-red-500">düşüncenin parçası olmaktır.</span>
            </p>
          </div>

          {/* Closing Statement */}
          <div className="text-center py-12">
            <div className="inline-block">
              <p
                className="text-3xl font-bold mb-2"
                style={{ fontStyle: "italic" }}
              >
                Platon Academia,
              </p>
              <p className="text-2xl text-red-500 font-semibold">
                zamansız bir bilgelik halkasıdır.
              </p>
              <div className="flex justify-center mt-6">
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <div className="text-center p-8 bg-neutral-900/30 rounded-lg border border-neutral-800">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">L</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Lalehan</h3>
              <p className="text-gray-400">Sanat Tarihçi</p>
              <p className="text-sm text-gray-500 mt-2">
                Akademik Derinlik & Bilgi Hazinesi
              </p>
            </div>

            <div className="text-center p-8 bg-neutral-900/30 rounded-lg border border-neutral-800">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">S</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Sogno</h3>
              <p className="text-gray-400">Kültür Organizatörü</p>
              <p className="text-sm text-gray-500 mt-2">
                Organizasyon & İçerik Üretimi
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
