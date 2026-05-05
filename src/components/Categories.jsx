import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiLoader, FiChevronLeft, FiBox, FiShoppingBag } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";

function Categories() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_URL}/categories`),
        ]);
        setProducts(prodRes.data.slice(0, 8));
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-40 bg-[#0a0a0a] text-center flex flex-col justify-center items-center gap-6">
        <div className="relative w-20 h-20">
          <FiLoader className="animate-spin text-5xl text-silver-500 absolute inset-0 m-auto" />
          <div className="absolute inset-0 border-2 border-silver-500/20 rounded-full"></div>
        </div>
        <span className="font-bold tracking-[0.4em] uppercase text-[10px] text-silver-500/60 animate-pulse">
          {isAr ? "جاري تحميل الفخامة..." : "Loading Luxury..."}
        </span>
      </div>
    );
  }

  return (
    <section className="py-20 sm:py-24 bg-[#fafafa] relative overflow-hidden" id="products" dir={isAr ? "rtl" : "ltr"}>
      
      {/* زخارف خلفية خفيفة */}
      <div className="absolute top-0 left-0 w-full h-52 sm:h-64 bg-gradient-to-b from-silver-50/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* --- قسم التصنيفات (Collections) --- */}
        <div className="mb-24 sm:mb-28">
          <div className={`flex flex-col md:flex-row justify-between items-center mb-10 sm:mb-16 gap-4 sm:gap-6 ${isAr ? 'md:border-r-4' : 'md:border-l-4'} border-silver-400 px-4 sm:px-6`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-silver-700 to-gray-900 bg-clip-text text-transparent luxury-heading tracking-tight">
                {t('browseCollections')}
              </h2>
              <p className="text-gray-500 mt-2 text-base sm:text-lg font-bold">
                {isAr ? "قطع حصرية صُممت للنخبة" : "Exclusive pieces crafted for the elite"}
              </p>
            </div>
            <Link
              to="/category/all"
              className="group flex items-center gap-3 text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-800 hover:text-silver-600 transition-all"
            >
              <span className="border-b-2 border-silver-400/30 group-hover:border-silver-600 pb-1">{t('viewAll')}</span>
              {isAr ? <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> : <FiArrowRight className="group-hover:translate-x-2 transition-transform" />}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {/* All Category Card */}
            {/* <Link to="/category/all" className="group text-center">
              <div className="relative aspect-square mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-silver-400 transition-all duration-500 p-1">
                <div className="w-full h-full bg-neutral-900 rounded-full flex flex-col items-center justify-center text-white shadow-xl">
                  <FiBox className="text-3xl mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-light tracking-[0.2em]">{t('fullCollection')}</span>
                </div>
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-silver-600 transition-colors">
                {isAr ? "الكل" : "All"}
              </h3>
            </Link> */}

            {categories.map((cat, index) => (
              <Link key={cat.id} to={`/category/${cat.id}`} className="group text-center">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-silver-400 transition-all duration-500 p-1">
                  <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden shadow-lg relative">
                    {cat.image ? (
                      <img
                        src={cat.image.startsWith("http") ? cat.image : `${import.meta.env.VITE_URL}/${cat.image}`}
                        alt={isAr ? cat.name : cat.name_en}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-800 group-hover:text-silver-600 transition-colors">
                  {isAr ? cat.name : cat.name_en}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* --- قسم المنتجات (Latest Designs) --- */}
        <div className={`flex flex-col md:flex-row justify-between mb-10 sm:mb-16 gap-4 sm:gap-6 ${isAr ? 'md:border-r-4' : 'md:border-l-4'} border-silver-400 px-4 sm:px-6`} id="productsCats">
           <div className={isAr ? "text-right" : "text-left"}>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-silver-700 bg-clip-text text-transparent luxury-heading tracking-tight">
              {t('latestDesigns')}
            </h2>
            <p className="text-gray-500 mt-2 text-base sm:text-lg font-bold ">
              {t('pureSilver')}
            </p>
          </div>
          <Link to="/category/all" className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-silver-600 hover:text-black transition-all">
            {t('exploreMore')} {isAr ? <FiChevronLeft /> : <FiChevronLeft className="rotate-180" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {products.map((item) => (
            <motion.div
              whileHover={{ y: -10 }}
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-sm text-black text-[8px] font-black px-3 py-1 tracking-widest uppercase rounded-full shadow-sm">
                    {isAr ? "فضة ٩٢٥" : "925 Silver"}
                  </span>
                </div>
                
                <img
                  src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_URL}/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                   <Link
                    to={`/product/${item.id}`}
                    className="bg-silver-500 text-black font-bold py-3 px-8 text-xs tracking-widest uppercase rounded-full hover:bg-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                  >
                    {isAr ? "عرض التفاصيل" : "Quick View"}
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 text-center">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2 line-clamp-1 group-hover:text-silver-600 transition-colors">
                  {item.name}
                </h3>
                <div className="flex flex-col items-center gap-4">
                    <div className="h-[1px] w-8 bg-silver-300"></div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-serif font-medium text-gray-900">{item.price}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-tighter">JOD</span>
                    </div>
                    <Link 
                        to={`/product/${item.id}`}
                        className="w-full py-3 border border-gray-900 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all rounded-lg"
                    >
                        <FiShoppingBag /> {isAr ? "اطلب الآن" : "Order Now"}
                    </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;