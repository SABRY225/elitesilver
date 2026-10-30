import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Filter,
  ChevronDown,
  ShoppingBag,
  Heart,
  Eye,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Gem,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";

function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  // جلب بيانات التصنيف والمنتجات
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        if (slug === "6") {
          navigate("/custom-order");
          return;
        }

        const url =
          slug === "all"
            ? `${import.meta.env.VITE_API_URL}/products`
            : `${import.meta.env.VITE_API_URL}/products?categoryId=${slug}`;

        const res = await axios.get(url);
        let data = res.data;

        if (Array.isArray(data)) {
          if (sortBy === "price-low") data.sort((a, b) => a.price - b.price);
          if (sortBy === "price-high") data.sort((a, b) => b.price - a.price);
          setProducts(data);
        }

        if (slug !== "all") {
          const catRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/categories/${slug}`
          );
          setCategoryName(catRes.data?.name || "");
        } else {
          setCategoryName(t("allCollections") || (isRTL ? "المجموعة الكاملة" : "All Collections"));
        }
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, sortBy, language, isRTL, navigate, t]);

  // مزامنة المفضلة
  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistIds(new Set(saved.map((item) => item.id)));
      } catch (e) {
        console.error(e);
      }
    };
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    return () => window.removeEventListener("wishlistUpdated", syncWishlist);
  }, []);

  const toggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = saved.some((item) => item.id === product.id);
      let updated;
      if (exists) {
        updated = saved.filter((item) => item.id !== product.id);
        toast.success(t("removedFromWishlist") || (isRTL ? "تم الحذف من المفضلة" : "Removed from wishlist"));
      } else {
        updated = [...saved, product];
        toast.success(t("addedToWishlist") || (isRTL ? "تمت الإضافة إلى المفضلة" : "Added to wishlist"));
      }
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlistIds(new Set(updated.map((item) => item.id)));
      window.dispatchEvent(new CustomEvent("wishlistUpdated", { detail: updated }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((i) => i.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} ${t("addedToBag") || (isRTL ? "تمت إضافتها إلى السلة!" : "added to bag!")}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#070709] text-white select-none overflow-x-hidden flex flex-col justify-between"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24 flex-1">
        {/* ترويسة التصنيف والمسار (Category Header Banner) */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300 font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-silver-400" />
              <span>ELITE SILVER 925</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {categoryName || t("collections")}
            </h1>
            <p className="text-silver-400 text-xs sm:text-sm mt-2 max-w-xl font-light">
              {t("categoryHeroDesc") ||
                (isRTL
                  ? "نصوغ من الفضة حكايات لا تنتهي، قطع صُممت لتكون إرثاً يزين معصم النخبة."
                  : "Handcrafted 925 Italian sterling silver creations crafted for perfection.")}
            </p>
          </div>

          {/* شريط الأدوات والفلترة */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300">
              <Filter className="w-3.5 h-3.5 text-silver-400" />
              <span>
                {products.length} {t("masterpieces") || (isRTL ? "قطعة فنية" : "pieces")}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white">
              <span className="text-silver-400 text-[11px]">{t("sortBy")}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white border-0 outline-none cursor-pointer text-xs font-bold"
              >
                <option value="latest" className="bg-[#0e0e13]">
                  {t("latestArrivals") || (isRTL ? "أحدث الواصلين" : "Latest")}
                </option>
                <option value="price-low" className="bg-[#0e0e13]">
                  {t("priceLow") || (isRTL ? "الأقل سعراً" : "Price: Low to High")}
                </option>
                <option value="price-high" className="bg-[#0e0e13]">
                  {t("priceHigh") || (isRTL ? "الأعلى سعراً" : "Price: High to Low")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* شبكة المنتجات */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 animate-pulse h-[360px] flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] bg-white/5 rounded-2xl w-full" />
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((item) => {
                const isWishlisted = wishlistIds.has(item.id);
                const numericPrice = parseFloat(item.price) || 0;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-gradient-to-b from-white/[0.06] to-white/[0.02] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/10 hover:border-silver-400/50 shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col justify-between"
                  >
                    <div>
                      {/* حاوية الصورة والشارات */}
                      <div className="relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 mb-3.5">
                        <div className="absolute top-2.5 ltr:left-2.5 rtl:right-2.5 z-20">
                          <span className="bg-white/95 backdrop-blur-md text-black text-[9px] font-black px-2 py-0.5 tracking-wider uppercase rounded-full shadow-sm">
                            {isRTL ? "فضة ٩٢٥" : "925 Silver"}
                          </span>
                        </div>

                        {/* زر المفضلة */}
                        <button
                          onClick={(e) => toggleWishlist(e, item)}
                          aria-label="Wishlist"
                          className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isWishlisted
                                ? "fill-red-500 text-red-500"
                                : "text-white"
                            }`}
                          />
                        </button>

                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `${import.meta.env.VITE_URL}/${item.image}`
                          }
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80";
                          }}
                        />

                        {/* طبقة المعاينة السريعة */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] p-3">
                          <Link
                            to={`/product/${item.id}`}
                            className="bg-white text-black font-bold py-2 px-4 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl hover:bg-silver-200 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t("viewDetail") || (isRTL ? "التفاصيل" : "Details")}</span>
                          </Link>
                        </div>
                      </div>

                      {/* تفاصيل المنتج */}
                      <div className="px-1 mb-2.5">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-white hover:text-silver-300 transition-colors line-clamp-1 mb-1">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="text-[10px] text-silver-400">
                          {isRTL ? "فضة إسترلينية إيطالية" : "Italian Sterling Silver"}
                        </div>
                      </div>
                    </div>

                    {/* السعر وزر الإضافة السريعة */}
                    <div className="pt-2.5 border-t border-white/10">
                      <div className="flex items-baseline justify-between mb-2.5 px-1">
                        <span className="text-[10px] text-silver-400 uppercase">
                          {t("currentPrice") || (isRTL ? "السعر" : "Price")}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-bold font-mono text-white">
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
                        onClick={(e) => handleQuickAdd(e, item)}
                        className="w-full py-2.5 silver-btn-luxury text-black rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t("quickAdd") || (isRTL ? "إضافة سريعة" : "Quick Add")}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* حالة التصنيف الفارغ */
            <div className="text-center py-32 bg-white/[0.02] border border-white/10 rounded-3xl p-8 max-w-xl mx-auto">
              <Gem className="w-16 h-16 text-silver-400/40 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {t("collectionCrafting") || (isRTL ? "المجموعة قيد الصياغة" : "Crafting in Progress")}
              </h3>
              <p className="text-silver-400 text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
                {t("collectionCraftingDesc") ||
                  (isRTL
                    ? "نحن الآن في مرحلة الصياغة اليدوية لقطع فريدة تليق بهذا القسم."
                    : "We are currently handcrafting unique pieces worthy of this collection.")}
              </p>
            </div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default CategoryPage;