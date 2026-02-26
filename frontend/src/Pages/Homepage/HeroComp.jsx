export function HeroComp() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-black border-b border-gray-800">
      {/* Classical ornamental borders */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgba(205,182,98,0.3)] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[rgba(205,182,98,0.3)] to-transparent"></div>
      </div>

      {/* Greek columns decoration */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
        <div className="w-8 h-64 border-l-2 border-r-2 border-gray-600"></div>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-10">
        <div className="w-8 h-64 border-l-2 border-r-2 border-gray-600"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        {/* Main tagline */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-gray-400 mb-6 font-serif italic">
            Yüzeysel bilgi çağında
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-[rgb(205,182,98)] mb-4">
            DERİN DÜŞÜNCENİN
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-serif italic">
            adresi.
          </p>
        </div>

        {/* Decorative separator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-px bg-[rgb(205,182,98)]"></div>
          <div className="w-2 h-2 rotate-45 border border-[rgb(205,182,98)]"></div>
          <div className="w-12 h-px bg-[rgb(205,182,98)]"></div>
        </div>

        {/* Brand name */}
        <div className="mb-12 flex justify-center">
          <img
            className="
          h-24
          "
            src="logo-name.png"
          ></img>
        </div>

        {/* Subtitle */}
        <div>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-8 font-serif">
            Felsefe, sanat ve bilim dünyasından derinlikli seminerler
          </p>
          <button className="px-4 py-3 border-2 border-[rgb(205,182,98)] text-[rgb(205,182,98)] font-serif tracking-wider hover:bg-[rgb(205,182,98)] hover:text-black transition-all duration-300 uppercase cursor-pointer rounded-3xl">
            Seminerleri Keşfet
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-[rgba(205,182,98,0.5)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
