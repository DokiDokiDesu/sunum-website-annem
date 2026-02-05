import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const [openDiscoverMenu, setOpenDiscoverMenu] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sayfaya göre arka plan rengini belirle
  const getBackgroundColor = () => {
    switch (location.pathname) {
      case "/":
        return isScrolled ? "bg-black" : "bg-[rgb(38,38,38)]";
      case "/seminar-page":
        return isScrolled ? "bg-black" : "bg-transparent";
      default:
        return isScrolled ? "bg-black" : "bg-[rgb(38,38,38)]";
    }
  };

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

  useEffect(() => {
    if (!showSearchInput) return;

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchInput]);

  //scroll listener

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div
      className={`flex h-16 w-full fixed z-50 top-0 left-0 transition-all duration-300 items-center ${getBackgroundColor()}`}
    >
      <img
        onClick={() => navigate("/")}
        className="h-10 mt-3 ml-5 w-50 cursor-pointer"
        src="header-logo.png"
      ></img>
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

            <button
              onClick={() => navigate("/all-seminar")}
              className="mt-4 w-full rounded-md bg-red-500 py-2 text-white hover:bg-red-600"
            >
              Tüm Seminerler
            </button>
          </div>
        )}
      </div>
      {/*Header linkleri */}
      <div className="flex ml-20 text-[rgb(243,243,243)]">
        <p className=" hover:text-gray-400 transition-all duration-500">
          Ana Sayfa
        </p>
        <p
          onClick={() => navigate("/all-seminar")}
          className="ml-15 hover:text-gray-400 transition-all duration-500"
        >
          Tüm Seminerler
        </p>
        <p className="ml-15 hover:text-gray-400 transition-all duration-500">
          Hakkımızda
        </p>
        <p
          onClick={() => navigate("/contact")}
          className="ml-15 hover:text-gray-400 transition-all duration-500 cursor-pointer"
        >
          İletişim
        </p>
      </div>
      {/* header linkleri- sağ*/}
      <div className="flex ml-auto items-center gap-3 mr-10 ">
        <input
          ref={searchRef}
          placeholder="ara"
          className={`search-input border rounded ${showSearchInput ? "show" : ""}`}
        ></input>

        <img
          onClick={() => setShowSearchInput(!showSearchInput)}
          src="icons8-search-30.png"
          className="cursor-pointer"
        ></img>
        <img
          src="icons8-notification-48.png"
          className="cursor-pointer h-8"
        ></img>
      </div>
    </div>
  );
}
