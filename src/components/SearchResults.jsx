import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Eye,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: "",
    sortBy: "name",
  });
  const { t, isRTL } = useLanguage();

  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.priceRange) params.append("priceRange", filters.priceRange);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/search?${params.toString()}`
        );
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query, filters]);

  return (
    <div
      className="min-h-screen bg-[#070709] text-white select-none flex flex-col justify-between"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24 max-w-7xl flex-1">
        {/* Header Section */}
        <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300 font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-silver-400" />
              <span>ELITE SILVER 925</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("searchResults") || (isRTL ? "نتائج البحث" : "Search Results")}
            </h1>
            <p className="text-silver-400 text-xs sm:text-sm mt-2 font-light">
              {query
                ? `${isRTL ? "نتائج البحث عن:" : "Searching for:"} "${query}"`
                : t("allCollections") || (isRTL ? "المجموعة الكاملة" : "All Collections")}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md text-xs">
            <span className="font-bold text-white font-mono">{products.length}</span>
            <span className="text-silver-400">
              {t("itemsFound") || (isRTL ? "قطعة تم العثور عليها" : "items found")}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* شريط الفلاتر والفرز الجانبي */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5 sm:p-6 rounded-3xl border border-white/10 sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-white pb-3 border-b border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-silver-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {t("refineBy") || (isRTL ? "تصفية وفرز النتائج" : "Refine Search")}
                </h3>
              </div>

              {/* الترتيب حسب */}
              <div className="mb-6">
                <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-3">
                  {t("sortBy") || (isRTL ? "الترتيب حسب" : "Sort By")}
                </label>
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: "name", label: isRTL ? "الاسم" : "Name" },
                    { id: "price-low", label: isRTL ? "السعر: من الأقل للأعلى" : "Price: Low to High" },
                    { id: "price-high", label: isRTL ? "السعر: من الأعلى للأقل" : "Price: High to Low" },
                  ].map((option) => (
                    <FilterOption
                      key={option.id}
                      label={option.label}
                      active={filters.sortBy === option.id}
                      onClick={() => setFilters({ ...filters, sortBy: option.id })}
                      isRTL={isRTL}
                    />
                  ))}
                </div>
              </div>

              {/* نطاق السعر */}
              <div className="mb-6">
                <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-3">
                  {t("priceRange") || (isRTL ? "نطاق السعر" : "Price Range")}
                </label>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: isRTL ? "جميع الأسعار" : "All Prices", val: "" },
                    { label: "0 - 50 JOD", val: "0-50" },
                    { label: "50 - 150 JOD", val: "50-150" },
                    { label: "150+ JOD", val: "150" },
                  ].map((range) => (
                    <FilterOption
                      key={range.val}
                      label={range.label}
                      active={filters.priceRange === range.val}
                      onClick={() => setFilters({ ...filters, priceRange: range.val })}
                      isRTL={isRTL}
                    />
                  ))}
                </div>
              </div>

              {/* إعادة تعيين الفلاتر */}
              <button
                onClick={() => setFilters({ priceRange: "", sortBy: "name" })}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-white/30 text-silver-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("resetFilters") || (isRTL ? "إعادة تعيين" : "Reset Filters")}</span>
              </button>
            </div>
          </aside>

          {/* شبكة نتائج المنتجات */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 animate-pulse h-[340px]"
                    >
                      <div className="aspect-[4/5] bg-white/5 rounded-2xl w-full mb-3" />
                      <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                /* حالة عدم وجود نتائج */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-28 bg-white/[0.02] rounded-3xl border border-white/10 p-8 max-w-lg mx-auto"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-silver-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t("noResultsTitle") || (isRTL ? "لم يتم العثور على نتائج" : "No Results Found")}
                  </h3>
                  <p className="text-silver-400 text-xs sm:text-sm font-light max-w-xs mx-auto mb-6 leading-relaxed">
                    {t("noResultsDesc") ||
                      (isRTL
                        ? "لم نتمكن من العثور على أي قطع تطابق بحثك. جرب كلمات مفتاحية أخرى."
                        : "No matching pieces found. Try using different keywords.")}
                  </p>
                  <Link
                    to="/category/all"
                    className="inline-flex items-center gap-2 px-6 py-3 silver-btn-luxury text-black rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
                  >
                    <span>{t("browseCollections") || (isRTL ? "تصفح التشكيلات" : "Browse Collections")}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </motion.div>
              ) : (
                /* شبكة المنتجات */
                <motion.div
                  layout
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                >
                  {products.map((product) => {
                    const numericPrice = parseFloat(product.price) || 0;
                    return (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-gradient-to-b from-white/[0.06] to-white/[0.02] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/10 hover:border-silver-400/50 shadow-lg hover:shadow-2xl transition-all duration-400 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 mb-3.5">
                            <div className="absolute top-2.5 ltr:left-2.5 rtl:right-2.5 z-20">
                              <span className="bg-white/95 backdrop-blur-md text-black text-[9px] font-black px-2 py-0.5 tracking-wider uppercase rounded-full shadow-sm">
                                {isRTL ? "فضة ٩٢٥" : "925 Silver"}
                              </span>
                            </div>

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
                                  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80";
                              }}
                            />

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                              <Link
                                to={`/product/${product.id}`}
                                className="bg-white text-black font-bold py-2 px-4 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xl hover:bg-silver-200 transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isRTL ? "التفاصيل" : "Details"}</span>
                              </Link>
                            </div>
                          </div>

                          <div className="px-1 mb-2.5">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="text-xs sm:text-sm font-bold text-white hover:text-silver-300 transition-colors line-clamp-1 mb-1">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="text-[10px] text-silver-400">
                              {isRTL ? "فضة إسترلينية إيطالية" : "Italian Sterling Silver"}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-white/10 flex items-baseline justify-between px-1">
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
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const FilterOption = ({ label, active, onClick, isRTL }) => (
  <button
    onClick={onClick}
    className={`w-full text-start px-3.5 py-2.5 rounded-xl text-xs transition-all flex justify-between items-center cursor-pointer ${
      active
        ? "bg-white text-black font-bold shadow-md"
        : "bg-white/5 text-silver-300 hover:bg-white/10 hover:text-white"
    }`}
  >
    <span>{label}</span>
    {active && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
  </button>
);

export default SearchResults;