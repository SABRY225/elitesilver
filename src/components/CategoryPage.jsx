import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "./Navbar";
import { FiArrowRight, FiSearch, FiLoader, FiFilter, FiChevronDown, FiPlus } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";

function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const url = slug === "all" 
          ? `${import.meta.env.VITE_API_URL}/products` 
          : `${import.meta.env.VITE_API_URL}/products?categoryId=${slug}`;
        
        const res = await axios.get(url);
        let data = res.data;
         if(slug == 6){
            navigate("/custom-order");
          }
        if (sortBy === "price-low") data.sort((a, b) => a.price - b.price);
        if (sortBy === "price-high") data.sort((a, b) => b.price - a.price);

        setProducts(data);

        if (slug !== "all") {
          const catRes = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${slug}`);
          setCategoryName(catRes.data.name); 
        } else {
          setCategoryName(t('allCollections'));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };

    fetchCategoryData();
  }, [slug, sortBy, language]);

  return (
    <div className="min-h-screen bg-[#000]/80 font-['Tajawal'] text-white overflow-x-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-24">
        <Navbar />
      </div>
      
      <main className="container mx-auto px-4 md:px-6 relative z-20 mt-24">
        
        {/* Professional Toolbar - التعديل هنا ليكون مرناً */}
        <div className=" mt-48 py-4 md:py-6 border-b border-white/5 mb-8 md:mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-40 bg-black/40 backdrop-blur-md ">
          
          <div className="flex items-center gap-4 group cursor-default">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-white/10 flex items-center justify-center rounded-full group-hover:border-silver-500/50 transition-colors bg-silver-400">
              <FiFilter className="text-white text-sm md:text-base" />
            </div>
            <span className="font-bold text-[12px] md:text-[15px] tracking-[0.1em] md:tracking-[0.2em] text-gray-400 uppercase">
              {t('found')} {products.length} {t('masterpieces')}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-silver-500/10 md:bg-silver-500 px-4 md:px-6 py-2 md:py-3 border border-white/5 rounded-full w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-[12px] md:text-[15px] font-bold text-white uppercase tracking-widest">{t('sortBy')}:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[11px] md:text-[13px] font-bold text-white border-0 outline-none cursor-pointer uppercase tracking-widest transition-colors"
            >
              <option value="latest" className="bg-[#000]">{t('latestArrivals')}</option>
              <option value="price-low" className="bg-[#000]">{t('priceLow')}</option>
              <option value="price-high" className="bg-[#000]">{t('priceHigh')}</option>
            </select>
          </div>
        </div>

        {/* Product Grid - تعديل توزيع الأعمدة */}
          <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-12 pb-20 md:pb-40"
            >
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : products.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-10 md:gap-y-20 pb-20 md:pb-40 "
            >
              {products.map((item, index) => (
                <ProductCard key={item.id} item={item} index={index} t={t} isRTL={isRTL} />
              ))}
            </motion.div>
          ) : (
            <EmptyState t={t} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ProductCard({ item, index, t, isRTL }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111] border border-white/5 group-hover:border-silver-500/30 transition-all duration-700">
        
        {/* Mobile-Friendly Overlay - تظهر بالأصابع أو الحوم */}
        <div className="absolute inset-0 bg-black/60 opacity-0 md:group-hover:opacity-100 transition-all duration-500 z-10 flex flex-col items-center justify-center gap-2 md:gap-4 translate-y-4 md:group-hover:translate-y-0 p-4 md:p-6 text-center">
            <Link 
              to={`/product/${item.id}`} 
              className="w-full bg-white text-black py-2 md:py-4 text-[10px] md:text-[15px] font-black tracking-[0.1em] md:tracking-[0.3em] uppercase hover:bg-silver-500 transition-all hover:text-white"
            >
              {t('viewDetail')}
            </Link>
            <button className="w-full border border-white/20 text-white py-2 md:py-4 text-[10px] md:text-[15px] font-black tracking-[0.1em] md:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all">
               {t('quickAdd')} <FiPlus className={`inline ${isRTL ? 'mr-1 md:mr-2' : 'ml-1 md:ml-2'}`} />
            </button>
        </div>

        <img
          src={import.meta.env.VITE_URL+'/'+item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 md:opacity-80 group-hover:opacity-100"
        />
        
        <div className={`absolute top-2 md:top-4 ${isRTL ? 'right-2 md:right-4' : 'left-2 md:left-4'} bg-[#0a0a0a]/80 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 border border-white/10 z-20`}>
           <span className="text-[6px] md:text-[8px] font-bold text-silver-500 tracking-[0.1em] md:tracking-[0.2em] uppercase">Italy 925</span>
        </div>
      </div>

      <div className="mt-4 md:mt-8 text-center px-2">
        <h3 className="text-sm md:text-2xl font-medium text-white mb-1 md:mb-2 tracking-tight group-hover:text-silver-500 transition-colors uppercase truncate">{item.name}</h3>
        <div className="flex flex-col items-center">
          <span className="text-base md:text-2xl font-black text-white tracking-tighter">
             {item.price} <span className="text-[8px] md:text-[10px] text-silver-600 font-normal mx-0.5 md:mx-1">{t('currency')}</span>
          </span>
          <div className="w-8 md:w-12 h-[1px] bg-white/10 mt-2 md:mt-4 group-hover:w-16 md:group-hover:w-24 group-hover:bg-silver-500 transition-all duration-700"></div>
        </div>
      </div>
    </motion.div>
  );
}

// ... باقي المكونات (EmptyState و SkeletonCard) مع تعديلات بسيطة في الـ padding
function EmptyState({ t }) {
  return (
    <div className="text-center py-20 md:py-60 bg-[#080808] border border-white/5 mx-4">
      <div className="text-silver-500/20 text-5xl md:text-8xl mb-6 md:mb-10 font-serif ">Pure</div>
      <h3 className="text-lg md:text-2xl font-bold text-white tracking-widest uppercase ">{t('collectionCrafting')}</h3>
      <p className="text-gray-500 mt-4 text-xs md:text-sm font-light max-w-xs md:max-w-sm mx-auto px-4">{t('collectionCraftingDesc')}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="aspect-[3/4] bg-white/[0.03] animate-pulse border border-white/5"></div>
      <div className="h-3 md:h-4 bg-white/[0.03] w-2/3 mx-auto rounded-full"></div>
      <div className="h-4 md:h-6 bg-white/[0.03] w-1/3 mx-auto rounded-full"></div>
    </div>
  );
}

export default CategoryPage;