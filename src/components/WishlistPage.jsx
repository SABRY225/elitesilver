import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowRight, FiInfo } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { t, isRTL } = useLanguage();

  // تحميل المفضلة من localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // حفظ المفضلة
  const saveWishlist = (items) => {
    localStorage.setItem('wishlist', JSON.stringify(items));
    setWishlistItems(items);
  };

  // إزالة منتج
  const removeFromWishlist = (productId) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    saveWishlist(updatedItems);
  };

  // إضافة للسلة
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated')); // لتحديث عداد السلة في Navbar
    // يمكن إضافة Notification هنا
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-6 py-48">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <FiHeart className="w-20 h-20 text-white/5 mx-auto" />
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-[#C0C0C0] blur-[60px] rounded-full opacity-20"
              />
            </div>
            <h1 className="text-4xl  mb-4 tracking-tight">{t('wishlistEmpty')}</h1>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto font-light leading-relaxed uppercase tracking-[0.1em] text-xs">
              {t('addFavoriteProducts')}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-12 py-4 border border-[#C0C0C0] text-[#C0C0C0] rounded-full hover:bg-[#C0C0C0] hover:text-black transition-all duration-500 font-black uppercase tracking-widest text-[10px]"
            >
              {t('exploreCollections')} <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 text-[#C0C0C0] mb-4">
              <span className="w-10 h-[1px] bg-[#C0C0C0]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('exclusiveSelection')}</span>
            </div>
            <h1 className="text-5xl font-serif ">{t('myWishlist')}</h1>
          </div>
          <p className="text-gray-500 uppercase tracking-widest text-[10px] font-black">
            {wishlistItems.length} {t('savedPieces')}
          </p>
        </header>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <AnimatePresence>
            {wishlistItems.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="group"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#111]">
                  <img
                    src={product.image?.startsWith("http") ? product.image : `${import.meta.env.VITE_URL}/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C0C0C0] hover:text-white transition-colors"
                      >
                        <FiShoppingCart size={14} /> {t('moveToCart')}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="w-14 bg-white/10 backdrop-blur-md text-white py-4 rounded-xl flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
                    <FiHeart className="w-4 h-4 text-[#C0C0C0] fill-current" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-6 text-center">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-sm font-serif tracking-widest uppercase mb-2 group-hover:text-[#C0C0C0] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[#C0C0C0] font-bold tracking-[0.1em]">
                    {product.price.toLocaleString()} <span className="text-[9px] font-light text-gray-500 uppercase">{t('JOD')}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center border-t border-white/5 pt-16"
        >
          <h2 className="text-2xl font-serif  mb-6">{t('continueYourJourney')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/shop"
              className="px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#C0C0C0] hover:text-white transition-all duration-500"
            >
              {t('backToShop')}
            </Link>
            <Link
              to="/cart"
              className="px-10 py-4 border border-white/10 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:border-white/40 transition-all duration-500 flex items-center justify-center gap-2"
            >
              <FiShoppingCart size={14} /> {t('viewBag')}
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;