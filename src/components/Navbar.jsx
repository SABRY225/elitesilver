import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiMenu, FiSearch, FiHeart,
    FiShoppingCart, FiUser, FiGlobe, FiX,
    FiLogOut
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import AuthModal from "./AuthModal";
import axios from "axios";
import LogoImg from "../images/logo.png"
const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const { language, toggleLanguage, t, isRTL } = useLanguage();
    const navigate = useNavigate();

    // وظيفة البحث
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSearch(false);
            setSearchQuery('');
        }
    };

    // جلب التصنيفات من الـ API
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // في حالة الفشل، استخدم قائمة افتراضية
            setCategories([
                { id: 1, name: 'rings' },
                { id: 2, name: 'necklaces' },
                { id: 3, name: 'bracelets' },
                { id: 4, name: 'earrings' },
                { id: 5, name: 'watches' },
            ]);
        } finally {
            setLoadingCategories(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new CustomEvent('authUpdated'));
        navigate('/');
    };

    // تأثير لتغيير خلفية الـ Navbar عند التمرير
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // جلب التصنيفات عند تحميل الكومبوننت
    useEffect(() => {
        fetchCategories();
    }, []);

    // تحديث عدد العناصر في السلة والمفضلة
    useEffect(() => {
        const updateCounts = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

            setWishlistCount(wishlist.length);
            setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
        };

        updateCounts();

        // الاستماع للـ custom events من ProductPage
        window.addEventListener('cartUpdated', updateCounts);
        window.addEventListener('wishlistUpdated', updateCounts);

        // الاستماع أيضاً للـ storage event (من tabs أخرى)
        window.addEventListener('storage', updateCounts);

        return () => {
            window.removeEventListener('cartUpdated', updateCounts);
            window.removeEventListener('wishlistUpdated', updateCounts);
            window.removeEventListener('storage', updateCounts);
        };
    }, []);

    // تحديث حالة المستخدم
    useEffect(() => {
        const updateUser = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                try {
                    setUser(JSON.parse(userData));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        updateUser();

        // الاستماع لتحديثات المصادقة
        window.addEventListener('authUpdated', updateUser);
        window.addEventListener('storage', updateUser);

        return () => {
            window.removeEventListener('authUpdated', updateUser);
            window.removeEventListener('storage', updateUser);
        };
    }, []);

    return (
        <>
          <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-12 py-3 ${scrolled
                ? "bg-black/70 backdrop-blur-lg shadow-md"
                : "bg-transparent py-5"
                }`} dir={isRTL ? 'rtl' : 'ltr'}>

                <div className="max-w-screen-2xl mx-auto flex items-center justify-between relative">

                    {/* LEFT SECTION - Menu & Language */}
                    <div className="flex items-center gap-1 md:gap-4 flex-1">
                        <button
                            onClick={() => setOpenMenu(true)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors group text-white"
                        >
                            <FiMenu className="text-xl md:text-2xl" />
                        </button>

                        <button
                            onClick={toggleLanguage}
                            className="hidden sm:flex items-center gap-2 text-[10px] md:text-[12px] font-bold tracking-widest hover:text-silver-400 transition text-white uppercase"
                        >
                            <FiGlobe className="text-base md:text-lg" />
                            <span className="hidden lg:inline">
                                {language === 'ar' ? 'ENGLISH' : 'العربية'}
                            </span>
                            <span className="lg:hidden">
                                {language === 'ar' ? 'EN' : 'عربي'}
                            </span>
                        </button>
                    </div>

                    {/* CENTER SECTION - LOGO */}
                    <div className="flex-[2] flex justify-center items-center">
                        <a href="/" className="transition-transform duration-300 hover:scale-105 shrink-0">
                            <img
                                src={LogoImg}
                                alt="logo"
                                className="w-20 sm:w-28 md:w-36 h-auto object-contain"
                            />
                        </a>
                    </div>

                    {/* RIGHT SECTION - ICONS */}
                    <div className="flex items-center justify-end gap-1 md:gap-4 flex-1">
                        {/* Search */}
                        <button className="p-2 text-white/80 hover:text-white transition-colors" onClick={() => setShowSearch(true)}>
                            <FiSearch className="text-lg md:text-xl" />
                        </button>

                        {/* Wishlist - Hidden on very small screens */}
                        <button className="relative p-2 text-white/80 hover:text-white transition-colors hidden sm:block" onClick={() => navigate('/wishlist')}>
                            <FiHeart className="text-lg md:text-xl" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-600 text-white text-[8px] flex items-center justify-center rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </button>

                        {/* Cart */}
                        <button className="relative p-2 text-white/80 hover:text-white transition-colors" onClick={() => navigate('/cart')}>
                            <FiShoppingCart className="text-lg md:text-xl" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-silver-600 text-white text-[8px] flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* User Profile */}
                        <div className="hidden md:block">
                            {user ? (
                                <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                                    <FiUser className="text-xl text-white/80 hover:text-white" />
                                    {/* Dropdown Menu Code stays here... */}
                                </div>
                            ) : (
                                <button onClick={() => setShowAuthModal(true)}>
                                    <FiUser className="text-xl text-white/80" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* SIDE MENU - Framer Motion */}
            <AnimatePresence>
                {openMenu && (
                    <>
                        {/* OVERLAY */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenMenu(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        />

                        {/* MENU PANEL */}
                        <motion.div
                            initial={{ x: isRTL ? "100%" : "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: isRTL ? "100%" : "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col`}
                        >
                            {/* Menu Header */}
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900">{t('explore')}</h2>
                                    <p className="text-[10px] text-silver-600 tracking-widest uppercase mt-1">{t('collections')}</p>
                                </div>
                                <button
                                    onClick={() => setOpenMenu(false)}
                                    className="p-2 hover:rotate-90 transition-transform duration-300"
                                >
                                    <FiX className="text-2xl text-gray-400" />
                                </button>
                            </div>

                            <div className="px-8 py-6 border-b border-gray-100 space-y-3">
                                <button
                                    onClick={() => {
                                        toggleLanguage();
                                        setOpenMenu(false);
                                    }}
                                    className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-100 text-gray-800 rounded-2xl hover:bg-gray-200 transition"
                                >
                                    <span className="flex items-center gap-2">
                                        <FiGlobe className="text-lg" />
                                        {language === 'ar' ? 'ENGLISH' : 'العربية'}
                                    </span>
                                    <span className="text-xs text-gray-500 uppercase">{t('language')}</span>
                                </button>

                                {user ? (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setOpenMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-3 bg-gray-100 text-gray-800 rounded-2xl hover:bg-gray-200 transition"
                                        >
                                            {t('profile')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setOpenMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition"
                                        >
                                            {t('logout')}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(true);
                                            setOpenMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-3 bg-gray-100 text-gray-800 rounded-2xl hover:bg-gray-200 transition"
                                    >
                                        {t('login')}
                                    </button>
                                )}
                            </div>

                            {/* Menu Links */}
                            <nav className="flex-1 overflow-y-auto p-8">
                                <ul className="space-y-8">
                                    {loadingCategories ? (
                                        <li className="text-gray-400">{t('loading')}</li>
                                    ) : (
                                        categories.map((category) => (
                                            <motion.li
                                                key={category.id}
                                                whileHover={{ x: isRTL ? -10 : 10 }}
                                                className="group flex items-center justify-between cursor-pointer"
                                                onClick={() => {
                                                    navigate(`/category/${category.id}`);
                                                    setOpenMenu(false);
                                                }}
                                            >
                                                <span className="text-xl font-light tracking-wide text-gray-600 group-hover:text-gray-900 group-hover:font-medium transition-all">
                                                    {language === "ar" ? category.name : category.name_en}
                                                </span>
                                                <div className="w-10 h-[1px] bg-silver-200 group-hover:w-16 group-hover:bg-silver-500 transition-all" />
                                            </motion.li>
                                        ))
                                    )}
                                </ul>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* SEARCH MODAL */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            exit={{ y: 20 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-serif font-bold text-gray-900">{t('searchaboutproducts')}</h3>
                                <button
                                    onClick={() => setShowSearch(false)}
                                    className="p-2 hover:rotate-90 transition-transform"
                                >
                                    <FiX className="text-xl text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSearch} className="space-y-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-silver-500 focus:border-transparent text-black"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-silver-600 text-white font-semibold rounded-lg hover:bg-silver-700 transition-colors"
                                >
                                    {t('search')}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AUTH MODAL */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />
        </>
    );
};

export default Navbar;