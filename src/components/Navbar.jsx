import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Heart,
  ShoppingBag,
  User,
  Globe,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  Coins,
  Package,
  Compass,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import AuthModal from "./AuthModal";
import axios from "axios";
import LogoImg from "../images/logo.png";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // إغلاق قائمة المستخدم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // وظيفة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  // كلمات البحث الشائعة
  const trendingSearches = [
    { label: isRTL ? "خواتم 925" : "925 Rings", query: "خواتم" },
    { label: isRTL ? "سبائك فضة" : "Silver Bullion", query: "سبيكة" },
    { label: isRTL ? "أساور إيطالية" : "Bracelets", query: "أساور" },
    { label: isRTL ? "سلاسل وقلادات" : "Necklaces", query: "قلادات" },
  ];

  // جلب التصنيفات من الـ API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`
      );
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([
        { id: 1, name: "خواتم", name_en: "Rings" },
        { id: 2, name: "قلادات", name_en: "Necklaces" },
        { id: 3, name: "أساور", name_en: "Bracelets" },
        { id: 4, name: "أقراط", name_en: "Earrings" },
        { id: 5, name: "ساعات", name_en: "Watches" },
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserDropdownOpen(false);
    window.dispatchEvent(new CustomEvent("authUpdated"));
    navigate("/");
  };

  // تأثير لتغيير خلفية الـ Navbar عند التمرير
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // جلب التصنيفات عند التحميل
  useEffect(() => {
    fetchCategories();
  }, []);

  // تحديث عدد العناصر في السلة والمفضلة
  useEffect(() => {
    const updateCounts = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistCount(wishlist.length);
        setCartCount(cart.reduce((total, item) => total + (item.quantity || 1), 0));
      } catch (err) {
        console.error("Error reading cart/wishlist counts:", err);
      }
    };

    updateCounts();
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  // تحديث حالة تسجيل الدخول
  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateUser();
    window.addEventListener("authUpdated", updateUser);
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("authUpdated", updateUser);
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return (
    <>
      {/* =========================================================
          1. شريط التنقل العلوي الرئيسي (Main Fixed Navigation Bar)
         ========================================================= */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 sm:px-8 lg:px-12 select-none ${
          scrolled
            ? "bg-[#070709]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)] py-3"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-4 sm:py-5"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* الجانب الأيسر (القائمة الجانبية + الروابط السريعة للشاشات الكبيرة) */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1">
            {/* زر فتح القائمة الجانبية */}
            <button
              onClick={() => setOpenMenu(true)}
              aria-label="Open Navigation Menu"
              className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            >
              <Menu className="w-5 h-5 text-silver-200" />
            </button>

            {/* روابط سطح المكتب المباشرة */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase text-silver-300">
              
              <Link
                to="/"
                className="hover:text-white transition-colors relative group py-1 flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-silver-400" />
                <span>{isRTL ? "الرئيسية" : "Home"}</span>
                <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-silver-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>

              <Link
                to="/category/all"
                className="hover:text-white transition-colors relative group py-1 flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-silver-400" />
                <span>{t("collections") || (isRTL ? "التشكيلات" : "Collections")}</span>
                <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-silver-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>

              <Link
                to="/custom-order"
                className="hover:text-white transition-colors relative group py-1 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-silver-400" />
                <span>{t("customOrder") || (isRTL ? "طلب تفصيل خاص" : "Custom Order")}</span>
                <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-silver-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* المنتصف: الشعار الرسمي للمتجر */}
          <div className="flex justify-center items-center shrink-0">
            <Link
              to="/"
              className="transition-transform duration-300 hover:scale-105"
            >
              <img
                src={LogoImg}
                alt="Elite Silver 925"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]"
              />
            </Link>
          </div>

          {/* الجانب الأيمن: أيقونات البحث، المفضلة، السلة، الحساب، وتغيير اللغة */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
            {/* تبديل اللغة (Desktop) */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle Language"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-bold tracking-widest text-silver-200 hover:text-white transition-all uppercase cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === "ar" ? "EN" : "عربي"}</span>
            </button>

            {/* زر البحث */}
            <button
              onClick={() => setShowSearch(true)}
              aria-label="Search"
              className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-silver-200 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* المفضلة (Wishlist) */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-silver-200 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(220,38,38,0.7)] animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* سلة التسوق (Shopping Cart) */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-silver-200 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(16,185,129,0.7)]">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* حساب المستخدم (User Profile Menu) */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="User Menu"
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-900 to-silver-600 text-white font-bold text-xs flex items-center justify-center">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="hidden xl:inline text-xs font-semibold max-w-[90px] truncate">
                      {user.name || (isRTL ? "حسابي" : "Account")}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-silver-400 hidden sm:block" />
                  </button>

                  {/* القائمة المنسدلة لحساب المستخدم */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full mt-2.5 ${
                          isRTL ? "left-0" : "right-0"
                        } w-56 bg-[#0f0f13] border border-white/15 rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50`}
                      >
                        <div className="px-3 py-2 border-b border-white/10 mb-2">
                          <p className="text-xs text-silver-400">{isRTL ? "مرحباً بك" : "Welcome"}</p>
                          <p className="text-sm font-bold text-white truncate">{user.name || user.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-silver-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-silver-400" />
                          <span>{t("profile") || (isRTL ? "الملف الشخصي" : "Profile")}</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-silver-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <Package className="w-4 h-4 text-silver-400" />
                          <span>{t("myOrders") || (isRTL ? "طلباتي" : "My Orders")}</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors mt-1 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t("logout") || (isRTL ? "تسجيل الخروج" : "Logout")}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  aria-label="Login"
                  className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-silver-200 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  title={t("signIn") || "تسجيل الدخول"}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================
          2. القائمة الجانبية الفاخرة (Luxury Drawer Side Menu)
         ========================================================= */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* خلفية التعتيم الشفافة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenMenu(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-[60]"
            />

            {/* لوحة القائمة الجانبية */}
            <motion.div
              initial={{ x: isRTL ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={`fixed top-0 ${
                isRTL ? "right-0" : "left-0"
              } h-full w-full max-w-sm sm:max-w-md bg-[#0a0a0d] z-[70] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-${
                isRTL ? "l" : "r"
              } border-white/10 flex flex-col text-white select-none`}
            >
              {/* رأس القائمة */}
              <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <img src={LogoImg} alt="Logo" className="h-10 w-auto object-contain" />
                  <div>
                    <h2 className="text-base font-bold text-white tracking-wider">
                      ELITE SILVER 925
                    </h2>
                    <p className="text-[10px] text-silver-400 tracking-widest uppercase">
                      {isRTL ? "مجوهرات الفضة الإسترلينية" : "Italian Sterling Silver"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOpenMenu(false)}
                  aria-label="Close Menu"
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-silver-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* عناصر التحكم (اللغة + الحساب) */}
              <div className="p-6 border-b border-white/10 space-y-3 bg-white/[0.01]">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setOpenMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all cursor-pointer text-xs font-semibold"
                >
                  <span className="flex items-center gap-2.5 text-silver-200">
                    <Globe className="w-4 h-4 text-silver-400" />
                    <span>{language === "ar" ? "English Version" : "النسخة العربية"}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    {language === "ar" ? "EN" : "عربي"}
                  </span>
                </button>

                {user ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setOpenMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-xs font-semibold cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 text-white">
                        <User className="w-4 h-4 text-silver-400" />
                        <span>{t("profile") || (isRTL ? "الملف الشخصي" : "Profile")}</span>
                      </span>
                      <span className="text-[11px] text-silver-400 truncate max-w-[120px]">
                        {user.name}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handleLogout();
                        setOpenMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-2xl transition-all text-xs font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("logout") || (isRTL ? "تسجيل الخروج" : "Logout")}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setOpenMenu(false);
                    }}
                    className="w-full silver-btn-luxury py-3 px-4 rounded-2xl text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>{t("signIn") || (isRTL ? "تسجيل الدخول / إنشاء حساب" : "Sign In / Register")}</span>
                  </button>
                )}
              </div>

              {/* قائمة الروابط والأقسام (Menu Categories & Navigation) */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-silver-500 mb-4 px-2">
                    {isRTL ? "الأقسام الرئيسية" : "Main Navigation"}
                  </div>

                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => {
                          navigate("/");
                          setOpenMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition-all text-sm font-semibold text-silver-200 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <Compass className="w-4 h-4 text-silver-400" />
                          <span>{t("home") || (isRTL ? "الرئيسية" : "Home")}</span>
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => {
                          navigate("/category/all");
                          setOpenMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition-all text-sm font-semibold text-silver-200 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <Layers className="w-4 h-4 text-silver-400" />
                          <span>{t("allCollections") || (isRTL ? "المجموعة الكاملة" : "All Collections")}</span>
                        </span>
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() => {
                          navigate("/custom-order");
                          setOpenMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition-all text-sm font-semibold text-silver-200 hover:text-white cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-silver-400" />
                          <span>{t("customOrder") || (isRTL ? "طلب تفصيل خاص" : "Custom Order")}</span>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* قائمة التصنيفات الفرعية */}
                <div className="pt-4 border-t border-white/10">
                  <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-silver-500 mb-4 px-2">
                    {t("categories") || (isRTL ? "تصنيفات المجوهرات" : "Jewelry Categories")}
                  </div>

                  <ul className="space-y-2">
                    {loadingCategories ? (
                      <li className="text-gray-500 text-xs px-2">{t("loading")}</li>
                    ) : (
                      categories.map((category) => (
                        <li key={category.id}>
                          <button
                            onClick={() => {
                              navigate(`/category/${category.id}`);
                              setOpenMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all text-sm font-light text-silver-300 hover:text-white group cursor-pointer"
                          >
                            <span>{language === "ar" ? category.name : category.name_en || category.name}</span>
                            <span className="text-silver-600 group-hover:text-silver-300 transition-colors">
                              {isRTL ? <ChevronDown className="w-3.5 h-3.5 rotate-90" /> : <ChevronDown className="w-3.5 h-3.5 -rotate-90" />}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* =========================================================
          3. مودال البحث الفاخر (Luxury Search Modal)
         ========================================================= */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[80] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0f0f14] border border-white/15 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative text-white"
            >
              {/* رأس المودال */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-silver-300">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {t("searchaboutproducts")}
                    </h3>
                    <p className="text-[11px] text-silver-400">
                      {isRTL ? "ابحث بالاسم، التصنيف، أو العيار" : "Search by piece, category, or purity"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowSearch(false)}
                  aria-label="Close Search"
                  className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-silver-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* فورم البحث */}
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full px-5 py-4 bg-black/60 border border-white/20 rounded-2xl focus:outline-none focus:border-silver-400 focus:ring-1 focus:ring-silver-400 text-white placeholder:text-gray-500 text-sm transition-all"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "left-4" : "right-4"
                      } text-gray-400 hover:text-white cursor-pointer`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* كلمات البحث المقترحة */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-silver-500 font-medium me-1">
                    {isRTL ? "الأكثر بحثاً:" : "Trending:"}
                  </span>
                  {trendingSearches.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(item.query)}`);
                        setShowSearch(false);
                      }}
                      className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-silver-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 silver-btn-luxury text-black font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>{t("search")}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          4. نافذة تسجيل الدخول والمصادقة (Auth Modal)
         ========================================================= */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navbar;