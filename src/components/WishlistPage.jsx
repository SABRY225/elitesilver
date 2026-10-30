import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error("Error reading wishlist:", e);
    }
  }, []);

  const saveWishlist = (items) => {
    localStorage.setItem("wishlist", JSON.stringify(items));
    setWishlistItems(items);
    window.dispatchEvent(
      new CustomEvent("wishlistUpdated", { detail: items })
    );
  };

  const removeFromWishlist = (productId) => {
    const updatedItems = wishlistItems.filter((item) => item.id !== productId);
    saveWishlist(updatedItems);
    toast.success(t("removedFromWishlist") || (isRTL ? "تم الحذف من المفضلة" : "Removed from wishlist"));
  };

  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} ${t("addedToBag") || (isRTL ? "تمت إضافتها إلى السلة!" : "added to bag!")}`);
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  };

  // حالة المفضلة الفارغة
  if (wishlistItems.length === 0) {
    return (
      <div
        className="min-h-screen bg-[#070709] text-white flex flex-col select-none"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-400 mx-auto shadow-inner">
                <Heart className="w-12 h-12 text-red-500 fill-red-500/20" />
              </div>
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full pointer-events-none"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {t("yourWishlistIsEmpty") || (isRTL ? "قائمة رغباتك فارغة" : "Your Wishlist is Empty")}
            </h1>

            <p className="text-silver-400 text-sm sm:text-base mb-8 font-light leading-relaxed">
              {t("addFavoriteProducts") ||
                (isRTL
                  ? "أضف قطعك المفضلة من الفضة عيار 925 بالضغط على أيقونة القلب لتجدها هنا دائماً."
                  : "Save your favorite 925 sterling silver masterpieces by clicking the heart icon.")}
            </p>

            <Link
              to="/category/all"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 silver-btn-luxury text-black rounded-full font-black uppercase tracking-wider text-xs sm:text-sm shadow-xl active:scale-95 transition-all"
            >
              <span>{t("exploreCollections") || (isRTL ? "اكتشف التشكيلات" : "Explore Collections")}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#070709] text-white select-none"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24">
        {/* ترويسة الصفحة */}
        <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300 font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-silver-400" />
              <span>ELITE SILVER 925</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("myWishlist") || (isRTL ? "قائمة المفضلة" : "My Wishlist")}
            </h1>
            <p className="text-silver-400 text-xs sm:text-sm mt-1 font-medium">
              {wishlistItems.length} {isRTL ? "قطع محفوظة في قائمتك" : "pieces saved"}
            </p>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white font-bold transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-silver-300" />
            <span>{t("shoppingBag") || (isRTL ? "عرض السلة" : "View Bag")}</span>
          </Link>
        </header>

        {/* شبكة القطع المفضلة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence>
            {wishlistItems.map((product) => {
              const numericPrice = parseFloat(product.price) || 0;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  className="group bg-gradient-to-b from-white/[0.06] to-white/[0.02] rounded-3xl p-4 border border-white/10 hover:border-silver-400/50 transition-all duration-400 flex flex-col justify-between shadow-lg hover:shadow-2xl"
                >
                  <div>
                    {/* الصورة والشارات */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/40 mb-4">
                      {/* شارة الفضة */}
                      <div className="absolute top-3 ltr:left-3 rtl:right-3 z-20">
                        <span className="bg-white/90 backdrop-blur-md text-black text-[9px] font-black px-2.5 py-1 tracking-wider uppercase rounded-full shadow-sm">
                          {isRTL ? "فضة ٩٢٥" : "925 Silver"}
                        </span>
                      </div>

                      {/* زر الحذف السريع من المفضلة */}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label="Remove from wishlist"
                        className="absolute top-3 ltr:right-3 rtl:left-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
                        title={isRTL ? "إزالة من المفضلة" : "Remove"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <img
                        src={
                          product.image?.startsWith("http")
                            ? product.image
                            : `${import.meta.env.VITE_URL}/${product.image}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80";
                        }}
                      />

                      {/* طبقة سريعة لمعاينة التفاصيل */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Link
                          to={`/product/${product.id}`}
                          className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl hover:bg-silver-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRTL ? "عرض التفاصيل" : "View Piece"}</span>
                        </Link>
                      </div>
                    </div>

                    {/* معلومات المنتج */}
                    <div className="px-1 mb-3">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-sm font-bold text-white hover:text-silver-300 transition-colors line-clamp-1 mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="text-[11px] text-silver-400">
                        {isRTL ? "صياغة إيطالية فاخرة" : "Handcrafted Luxury"}
                      </div>
                    </div>
                  </div>

                  {/* السعر وزر النقل للسلة */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-baseline justify-between mb-3 px-1">
                      <span className="text-[10px] text-silver-400 uppercase tracking-wider">
                        {t("currentPrice") || (isRTL ? "السعر" : "Price")}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold font-mono text-white">
                          {numericPrice.toLocaleString(isRTL ? "ar-JO" : "en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[10px] font-bold text-silver-400 uppercase">
                          {t("currency")}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 silver-btn-luxury text-black rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t("addToBag") || (isRTL ? "إضافة إلى السلة" : "Move to Cart")}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;