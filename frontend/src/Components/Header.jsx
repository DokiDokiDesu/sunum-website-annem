import { useState, useRef, useEffect } from "react";

export function Header() {
  const [openDiscoverMenu, setOpenDiscoverMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!openDiscoverMenu) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenDiscoverMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDiscoverMenu]);

  const categories = [
    { name: "Sinema" },
    { name: "Tarih" },
    { name: "Finans", highlight: true },
    { name: "Sağlık" },
    { name: "Müzik" },
    { name: "Girişimcilik" },
    { name: "Gastronomi" },
    { name: "Yaşam Kültürü" },
    { name: "Satış" },
    { name: "Pazarlama" },
    { name: "Liderlik" },
    { name: "Yetkinlik Gelişimi" },
  ];

  return (
    <div className="flex h-16 w-full bg-[rgb(38,38,38)] absolute top-0 left-0 items-center">
      <img className="h-10 mt-3 ml-5 w-50" src="header-logo.png"></img>
      <div ref={menuRef} className="relative">
        <button
          className="h-10 w-26 ml-5 border border-white rounded"
          onClick={() => setOpenDiscoverMenu(!openDiscoverMenu)}
        >
          Keşfet
          <span
            className={`transition ${openDiscoverMenu ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>
        {/*Keşfet menu */}

        {openDiscoverMenu && (
          <div
            className="absolute left-0 mt-2 w-[520px] rounded-lg bg-neutral-900 p-6 shadow-xl 
                          animate-in fade-in slide-in-from-top-2 duration-400 z-10"
          >
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {categories.map((item, i) => (
                <button
                  key={i}
                  className={`text-left transition hover:text-white ${
                    item.highlight
                      ? "text-red-500 font-semibold"
                      : "text-neutral-300"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <button className="mt-4 w-full rounded-md bg-red-500 py-2 text-white hover:bg-red-600">
              Tüm Seminerler
            </button>
          </div>
        )}
      </div>

      <input
        className="border border-gray-300 border-solid px-3 py-2 bg-transparent text-white placeholder-gray-400 rounded min-w-70 ml-5"
        placeholder="bu gün ne öğrenmek istiyorsun?"
      ></input>
      <button className="ml-5">Hakkımızda</button>
      <button className="ml-5">İletişim</button>
    </div>
  );
}
