import { Header } from "../Components/Header";

export function Contact() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.25),_transparent_55%)]"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_45%)]"></div>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 text-red-500 text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                İLETİŞİM
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Sorularınız mı var?
                <span className="block italic text-red-500">Bize Ulaşın</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Seminerler, rezervasyonlar ya da iş birlikleri için bize ulaşın.
                En kısa sürede dönüş yapacağız.
              </p>
            </div>
          </div>
        </section>

        {/* İçerik */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sol: İletişim Kartları */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <img className="h-12 mt-1" src="icons8-mail-100.png"></img>
                  <div>
                    <h3 className="text-xl font-semibold">E-posta</h3>
                    <p className="text-gray-400 mt-1">info@sunum.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <img className="h-12 mt-1" src="icons8-phone-100.png"></img>
                  <div>
                    <h3 className="text-xl font-semibold">Mobil & Whatsapp</h3>
                    <p className="text-gray-400 mt-1">+90 (212) 555 00 00</p>
                  </div>
                </div>
              </div>

              {/*sosyal medya kartı*/}
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 ml-20">
                  Sosyal medyadan bizi takip edin
                </h3>
                <div className="flex items-center gap-4 text-gray-400 justify-evenly">
                  <img
                    className="h-12 mt-1 cursor-pointer"
                    src="icons8-instagram-100.png"
                  ></img>
                  <img className="h-12 mt-1" src="icons8-x-100.png"></img>
                  <img className="h-12 mt-1" src="icons8-youtube-100.png"></img>
                </div>
              </div>
            </div>

            {/* Sağ: Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-2">
                  Bize mesaj gönderin
                </h2>
                <p className="text-gray-400 mb-8">
                  Tüm sorularınızı detaylarıyla yazabilirsiniz.
                </p>

                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        placeholder="Adınız"
                        className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/70"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        placeholder="ornek@mail.com"
                        className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/70"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Konu
                    </label>
                    <input
                      type="text"
                      placeholder="Konu başlığı"
                      className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Mesaj
                    </label>
                    <textarea
                      rows="6"
                      placeholder="Mesajınız"
                      className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/70 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition-colors"
                  >
                    Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
