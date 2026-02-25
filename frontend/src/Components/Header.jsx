import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

export function Header() {
  const [openDiscoverMenu, setOpenDiscoverMenu] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Kategorileri API'den çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.categories}?active=true`);
        const data = await response.json();
        // Sadece menüde gösterilecek kategorileri filtrele
        const menuCategories = data.filter((cat) => cat.showInMenu);
        setCategories(menuCategories);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    fetchCategories();
  }, []);

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
  const handleMenuToggle = () => {
    if (openDiscoverMenu) {
      setIsMenuAnimating(true);
      setTimeout(() => {
        setOpenDiscoverMenu(false);
        setIsMenuAnimating(false);
      }, 200);
    } else {
      setOpenDiscoverMenu(true);
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

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Mobil menü kapandığında kategoriler dropdown'unu da kapat
  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileCategoriesOpen(false);
    }
  }, [mobileMenuOpen]);

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

  return (
    <div
      className={`flex h-16 w-full max-w-full fixed z-50 top-0 left-0 right-0 transition-all duration-300 items-center px-0 ${getBackgroundColor()}`}
    >
      {/* Mobile Hamburger Button */}
      <button
        ref={hamburgerRef}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden ml-3 mr-2 text-white p-2"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        className="cursor-pointer h-12 ml-12 md:ml-4 mt-1 mr-2 flex-shrink-0"
        src="logo-header.png"
        alt="Logo"
      />

      {/* Desktop Menu - Keşfet Butonu */}
      <div ref={menuRef} className="relative hidden md:block">
        <button
          className="h-10 px-4 ml-3 md:ml-5 border-1 border-gray-400 rounded whitespace-nowrap flex items-center gap-2"
          onClick={handleMenuToggle}
        >
          Keşfet
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${openDiscoverMenu ? "rotate-180" : ""}`}
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

        {(openDiscoverMenu || isMenuAnimating) && (
          <div
            className={`absolute left-0 mt-2 w-auto min-w-[300px] max-w-[520px] rounded-lg bg-neutral-900 p-6 shadow-xl z-10 
                        ${openDiscoverMenu && !isMenuAnimating ? "menu-enter" : "menu-exit"}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/all-seminar?category=${item.slug}`);
                    handleMenuToggle();
                  }}
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
              onClick={() => {
                navigate("/all-seminar");
                handleMenuToggle();
              }}
              className="mt-4 w-full rounded-md bg-red-500 py-2 text-white hover:bg-red-600"
            >
              Tüm Seminerler
            </button>
          </div>
        )}
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex md:ml-8 lg:ml-20 text-[rgb(243,243,243)] whitespace-nowrap">
        <p
          onClick={() => navigate("/")}
          className="hover:text-gray-400 transition-all duration-500 cursor-pointer"
        >
          Ana Sayfa
        </p>
        <p
          onClick={() => navigate("/all-seminar")}
          className="ml-6 lg:ml-12 hover:text-gray-400 transition-all duration-500 cursor-pointer"
        >
          Tüm Seminerler
        </p>
        <p
          onClick={() => navigate("/about")}
          className="ml-6 lg:ml-12 hover:text-gray-400 transition-all duration-500 cursor-pointer"
        >
          Hakkımızda
        </p>
        <p
          onClick={() => navigate("/contact")}
          className="ml-6 lg:ml-12 hover:text-gray-400 transition-all duration-500 cursor-pointer"
        >
          İletişim
        </p>
      </div>

      {/* Right Side Icons - Desktop */}
      <div className="hidden md:flex ml-auto items-center gap-3 mr-4 md:mr-6 lg:mr-10">
        <input
          ref={searchRef}
          placeholder="ara"
          className={`search-input border rounded ${showSearchInput ? "show" : ""}`}
        />

        <img
          onClick={() => setShowSearchInput(!showSearchInput)}
          src="icons8-search-30.png"
          className="cursor-pointer w-6 h-6"
          alt="Search"
        />
        <img
          src="icons8-notification-48.png"
          className="cursor-pointer w-6 h-6"
          alt="Notifications"
        />
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden fixed top-16 left-0 right-0 w-full max-w-full bg-neutral-900 shadow-xl z-40 animate-in slide-in-from-top duration-300 overflow-x-hidden"
        >
          <div className="flex flex-col px-4 py-6 space-y-4 w-full max-w-full overflow-x-hidden">
            {/* Mobile Navigation Links */}
            <button
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className="text-left text-white hover:text-red-500 transition-colors py-2"
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => {
                navigate("/all-seminar");
                setMobileMenuOpen(false);
              }}
              className="text-left text-white hover:text-red-500 transition-colors py-2"
            >
              Tüm Seminerler
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setMobileMenuOpen(false);
              }}
              className="text-left text-white hover:text-red-500 transition-colors py-2"
            >
              Hakkımızda
            </button>
            <button
              onClick={() => {
                navigate("/contact");
                setMobileMenuOpen(false);
              }}
              className="text-left text-white hover:text-red-500 transition-colors py-2"
            >
              İletişim
            </button>

            {/* Divider */}
            <div className="border-t border-neutral-700 my-2"></div>

            {/* Categories Dropdown */}
            <button
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
              className="flex items-center justify-between text-white hover:text-red-500 transition-colors py-2"
            >
              <span>Kategoriler</span>
              <span
                className={`transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {mobileCategoriesOpen && (
              <div className="grid grid-cols-2 gap-3 text-sm pl-4 animate-in slide-in-from-top duration-200">
                {categories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(`/all-seminar?category=${item.slug}`);
                      setMobileMenuOpen(false);
                      setMobileCategoriesOpen(false);
                    }}
                    className={`text-left transition hover:text-white py-1 ${
                      item.highlight
                        ? "text-red-500 font-semibold"
                        : "text-neutral-300"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Icons */}
            <div className="flex items-center gap-4 pt-4 border-t border-neutral-700">
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="flex items-center gap-2 text-white hover:text-red-500"
              >
                <img
                  src="icons8-search-30.png"
                  className="w-6 h-6"
                  alt="Search"
                />
                <span>Ara</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
