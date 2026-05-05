import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch, FiFilter, FiX, FiArrowRight, FiSliders, FiShoppingBag } from "react-icons/fi";
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
    priceRange: '',
    sortBy: 'name'
  });
  const { t, isRTL } = useLanguage();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        
        // إعداد query parameters
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.priceRange) params.append('priceRange', filters.priceRange);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/search?${params.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        // في حالة فشل الـ API، يمكن عرض رسالة خطأ أو الرجوع للبيانات المحلية
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [query, filters]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
        
        {/* Header Section */}
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-serif mb-4  uppercase tracking-tighter">
                {t('searchResults')}
              </h1>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="w-8 h-[1px] bg-[#C0C0C0]"></span>
                <p className="text-sm tracking-[0.2em] uppercase font-light">
                  {query ? `${t('discovery')} / ${query}` : t('allCollections')}
                </p>
              </div>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
              <span className="text-[#C0C0C0] font-bold">{products.length}</span> 
              <span className="text-xs uppercase tracking-widest text-gray-400 ml-2"> {t('itemsFound')}</span>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-3 space-y-10">
            <div className="sticky top-32">
              <div className="flex items-center gap-2 mb-8 text-[#C0C0C0]">
                <FiSliders size={18} />
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">{t('refineBy')}</h3>
              </div>

              {/* Sort Section */}
              <div className="mb-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">{t('sortBy')}</label>
                <div className="flex flex-col gap-2">
                  {['name', 'price-low', 'price-high'].map((option) => (
                    <FilterOption 
                      key={option}
                      label={t(option)}
                      active={filters.sortBy === option}
                      onClick={() => setFilters({ ...filters, sortBy: option })}
                    />
                  ))}
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-4">{t('priceRange')}</label>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t('allPrices'), val: '' },
                    { label: '0 - 500 JOD', val: '0-500' },
                    { label: '500 - 1500 JOD', val: '500-1500' },
                    { label: '1500+ JOD', val: '1500' }
                  ].map((range) => (
                    <FilterOption 
                      key={range.val}
                      label={range.label}
                      active={filters.priceRange === range.val}
                      onClick={() => setFilters({ ...filters, priceRange: range.val })}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setFilters({ priceRange: '', sortBy: 'name' })}
                className="w-full py-4 text-[10px] font-black uppercase tracking-widest border border-white/10 rounded-xl hover:bg-white/5 transition-all"
              >
                {t('resetFilters')}
              </button>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingSkeleton />
              ) : products.length === 0 ? (
                <EmptyState t={t} />
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12"
                >
                  {products.map((product, idx) => (
                    <ProductCard key={product.id || idx} product={product} t={t} isRTL={isRTL} />
                  ))}
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

/* --- المكونات الفرعية المحسنة --- */

const FilterOption = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 flex justify-between items-center ${
      active ? 'bg-[#C0C0C0] text-black font-bold' : 'bg-white/5 text-gray-400 hover:bg-white/10'
    }`}
  >
    {label}
    {active && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
  </button>
);

const ProductCard = ({ product, t, isRTL }) => (
  <motion.div 
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="group"
  >
    <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-2xl bg-[#111] aspect-[4/5]">
      <img
        src={product.image?.startsWith("http") ? product.image : `${import.meta.env.VITE_URL}/${product.image}`}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C0C0C0] flex items-center gap-2">
          {t('discoverMore')} <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
        </span>
      </div>
    </Link>
    <div className="mt-6 text-center">
      <h3 className="text-sm font-serif tracking-wide text-white group-hover:text-[#C0C0C0] transition-colors line-clamp-1 uppercase">
        {product.name}
      </h3>
      <p className="text-xs font-bold text-gray-500 mt-2 tracking-widest uppercase">
        {product.price} <span className="text-[9px] opacity-60">JOD</span>
      </p>
    </div>
  </motion.div>
);

const EmptyState = ({ t }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10"
  >
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
      <FiSearch size={30} />
    </div>
    <h3 className="text-xl font-serif  mb-2">{t('noResultsTitle')}</h3>
    <p className="text-gray-500 text-sm max-w-xs mx-auto font-light leading-relaxed">
      {t('noResultsDesc')}
    </p>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-white/5 aspect-[4/5] rounded-2xl mb-4"></div>
        <div className="h-3 bg-white/5 w-3/4 mx-auto mb-2 rounded"></div>
        <div className="h-3 bg-white/5 w-1/4 mx-auto rounded"></div>
      </div>
    ))}
  </div>
);

export default SearchResults;