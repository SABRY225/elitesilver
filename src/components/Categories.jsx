import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Heart,
  Eye,
  Layers,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";

function Categories() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { t, language, isRTL } = useLanguage();
  const navigate = useNavigate();

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
        ]);

        if (Array.isArray(prodRes.data)) {
          setProducts(prodRes.data.slice(0, 8));
        }

        if (Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error("Error fetching categories data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // مزامنة حالة المفضلة
  useEffect(() => {
    const syncWishlist = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlistIds(new Set(saved.map((item) => item.id)));
      } catch (e) {
        console.error("Error reading wishlist:", e);
      }
    };

    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener("wishlistUpdated", syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);

  // إضافة أو إزالة منتج من المفضلة بنقرة واحدة
  const toggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = saved.some((item) => item.id === product.id);

      let updated;
      if (exists) {
        updated = saved.filter((item) => item.id !== product.id);
        toast.success(t("removedFromWishlist") || "تم الحذف من المفضلة");
      } else {
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString(),
        };
        updated = [...saved, wishlistItem];
        toast.success(t("addedToWishlist") || "تمت الإضافة إلى المفضلة");
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlistIds(new Set(updated.map((item) => item.id)));
      window.dispatchEvent(
        new CustomEvent("wishlistUpdated", { detail: updated })
      );
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  return (
    <section
      id="products"
      className="py-20 sm:py-28 bg-gradient-to-b from-[#f9fafb] via-[#ffffff] to-[#f4f5f7] relative overflow-hidden select-none"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* 1. عناصر زخرفية فاخرة في الخلفية */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-silver-200/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-silver-300/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-silver-200/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* =========================================================
            2. قسم التصنيفات (Collections Showcase)
           ========================================================= */}
        <div className="mb-24 sm:mb-32">
          {/* ترويسة التصنيفات */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 border-b border-silver-200/60 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-silver-100 border border-silver-300/60 text-silver-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-silver-600" />
                <span>
                  {isRTL
                    ? "تشكيلات النخبة الفاخرة"
                    : "Elite Luxury Collections"}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {t("browseCollections")}
              </h2>

              <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
                {isRTL
                  ? "قطع حصرية صُممت للنخبة من أجود أنواع الفضة عيار 925"
                  : "Exclusive pieces handcrafted for the elite in pure 925 silver"}
              </p>
            </div>

            <Link
              to="/category/all"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
            >
              <span>{t("viewAll")}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                {isRTL ? (
                  <ArrowLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </span>
            </Link>
          </div>

          {/* شبكة التصنيفات (Medallion Podiums) */}
          {loading ? (
            /* هيكل تحميل التصنيفات */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-silver-200/60 mb-4" />
                  <div className="w-20 h-4 bg-silver-200/60 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 sm:gap-6 lg:gap-8">
              {/* بطاقة "المجموعة الكاملة" المميزة */}
              <Link to="/category/all" className="group flex flex-col items-center text-center">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 p-1.5 rounded-full border-2 border-dashed border-silver-400 group-hover:border-gray-900 transition-all duration-500 group-hover:scale-105 shadow-sm">
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform duration-500">
                    <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-silver-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-silver-200">
                      {isRTL ? "الكل" : "All"}
                    </span>
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-silver-700 transition-colors uppercase tracking-wider">
                  {t("allCollections") || (isRTL ? "المجموعة الكاملة" : "All Pieces")}
                </h3>
              </Link>

              {/* عناصر التصنيفات المحملة */}
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4 p-1 rounded-full border-2 border-silver-300/70 group-hover:border-gray-900 transition-all duration-500 group-hover:scale-105 shadow-md group-hover:shadow-xl">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                      {cat.image ? (
                        <img
                          src={
                            cat.image.startsWith("http")
                              ? cat.image
                              : `${import.meta.env.VITE_URL}/${cat.image}`
                          }
                          alt={isRTL ? cat.name : cat.name_en || cat.name}
                          className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-silver-100 to-silver-200 text-gray-700 font-bold text-xl">
                          {cat.name?.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-silver-700 transition-colors uppercase tracking-wider line-clamp-1">
                    {isRTL ? cat.name : cat.name_en || cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================
            3. قسم أحدث التصاميم (Latest Designs Products Grid)
           ========================================================= */}
        <div id="productsCats" className="pt-6">
          {/* ترويسة المنتجات */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6 border-b border-silver-200/60 pb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-silver-100 border border-silver-300/60 text-silver-700 text-xs font-semibold tracking-wider uppercase mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-silver-600" />
                <span>
                  {isRTL ? "أحدث الواصلين للمتجر" : "Latest Boutique Arrivals"}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {t("latestDesigns")}
              </h2>

              <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
                {isRTL
                  ? "صياغة فنية بالفضة الإسترلينية الإيطالية تليق بأناقتك"
                  : "Handcrafted 925 sterling silver jewelry crafted for distinction"}
              </p>
            </div>

            <Link
              to="/category/all"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-900 hover:text-silver-700 transition-colors"
            >
              <span className="border-b-2 border-gray-900 group-hover:border-silver-600 pb-1">
                {t("exploreMore")}
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </span>
            </Link>
          </div>

          {/* شبكة المنتجات (Product Cards Grid) */}
          {loading ? (
            /* هيكل تحميل كروت المنتجات */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-4 border border-silver-200/60 animate-pulse flex flex-col justify-between h-[380px]"
                >
                  <div className="w-full aspect-[4/5] bg-silver-200/50 rounded-2xl mb-4" />
                  <div className="space-y-2">
                    <div className="w-3/4 h-4 bg-silver-200/60 rounded" />
                    <div className="w-1/2 h-5 bg-silver-200/60 rounded" />
                    <div className="w-full h-10 bg-silver-200/60 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((item) => {
                const isWishlisted = wishlistIds.has(item.id);
                const numericPrice = parseFloat(item.price) || 0;

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-silver-200/80 hover:border-silver-400 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      {/* حاوية صورة المنتج مع الشارات وزر المفضلة */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl bg-gray-50 mb-4">
                        {/* شارة نقاء الفضة */}
                        <div className="absolute top-3 ltr:left-3 rtl:right-3 z-20">
                          <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[9px] sm:text-[10px] font-black px-2.5 py-1 tracking-wider uppercase rounded-full shadow-sm border border-silver-200/60">
                            {isRTL ? "فضة ٩٢٥" : "925 Silver"}
                          </span>
                        </div>

                        {/* زر إضافة إلى المفضلة التفاعلي */}
                        <button
                          onClick={(e) => toggleWishlist(e, item)}
                          aria-label="Add to wishlist"
                          className="absolute top-3 ltr:right-3 rtl:left-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-silver-200/80 flex items-center justify-center text-gray-700 hover:text-red-500 transition-all duration-300 shadow-sm active:scale-90 cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${
                              isWishlisted
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </button>

                        {/* صورة المنتج */}
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `${import.meta.env.VITE_URL}/${item.image}`
                          }
                          alt={item.name}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80";
                          }}
                        />

                        {/* طبقة المعاينة السريعة الزجاجية عند مرور الماوس */}
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center backdrop-blur-[2px] p-4">
                          <Link
                            to={`/product/${item.id}`}
                            className="bg-white/95 hover:bg-white text-gray-950 font-bold py-2.5 px-5 rounded-full text-xs tracking-wider uppercase flex items-center gap-2 shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isRTL ? "معاينة القطعة" : "Quick View"}</span>
                          </Link>
                        </div>
                      </div>

                      {/* عنوان المنتج وتفاصيله */}
                      <div className="px-1 mb-3">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-silver-700 transition-colors uppercase tracking-tight line-clamp-1 mb-1">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {isRTL ? "صياغة إيطالية يدوية" : "Italian Handcrafted"}
                        </div>
                      </div>
                    </div>

                    {/* السعر وزر الطلب الفوري */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-baseline justify-between mb-3 px-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                          {t("currentPrice") || (isRTL ? "السعر" : "Price")}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg sm:text-xl font-black text-gray-900 font-mono">
                            {numericPrice.toLocaleString(
                              isRTL ? "ar-JO" : "en-US",
                              { minimumFractionDigits: 2 }
                            )}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">
                            JOD
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/product/${item.id}`}
                        className="w-full py-2.5 sm:py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isRTL ? "اطلب الآن" : "Order Now"}</span>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Categories;