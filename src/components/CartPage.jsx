import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiShield } from "react-icons/fi";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
    // تفعيل حدث لتحديث العداد في النيفبار إذا لزم الأمر
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    saveCart(updatedItems);
  };

  const getTotal = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-6 py-48">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="relative inline-block mb-8">
              <FiShoppingBag className="w-24 h-24 text-white/10 mx-auto" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-0 right-0 w-6 h-6 bg-[#C0C0C0] rounded-full border-4 border-[#0a0a0a]"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif mb-4 ">{t('yourCartIsEmpty')}</h1>
            <p className="text-lg text-gray-500 mb-10 max-w-sm mx-auto font-light leading-relaxed">
              {t('addSomeProducts')}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-full hover:bg-[#C0C0C0] hover:text-white transition-all duration-500 font-bold uppercase tracking-widest text-sm"
            >
              {t('startDiscovery')} <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
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
      
      <main className="max-w-7xl mx-auto px-6  pb-24 pt-48">
        {/* Page Title */}
        <div className="mb-16 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif  mb-2">{t('shoppingBag')}</h1>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-black">
              {cartItems.length} {t('exquisitePieces')}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#C0C0C0] text-xs font-bold uppercase tracking-widest bg-[#C0C0C0]/5 px-4 py-2 rounded-full border border-[#C0C0C0]/20">
            <FiShield /> {t('secureCheckout')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item.id}
                  className="group relative grid grid-cols-12 gap-6 items-center p-6 bg-[#111] rounded-3xl border border-white/5 hover:border-[#C0C0C0]/30 transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="col-span-4 md:col-span-3 aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_URL}/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Info Container */}
                  <div className="col-span-8 md:col-span-9 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-serif tracking-wide group-hover:text-[#C0C0C0] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[#C0C0C0] font-bold text-xl">
                        {item.price.toLocaleString()} <span className="text-[10px] uppercase font-light text-gray-500">{t('currency')}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-white/10 rounded-full p-1 bg-black/20">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:text-[#C0C0C0] transition-colors"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:text-[#C0C0C0] transition-colors"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors p-2"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right hidden md:block">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{t('subtotal')}</p>
                      <p className="text-2xl font-serif">
                        {(item.price * item.quantity).toLocaleString()} <span className="text-xs">{t('currency')}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5">
              <h2 className="text-2xl font-serif  mb-8 border-b border-white/5 pb-4">{t('summary')}</h2>
              
              <div className="space-y-6 mb-10 text-sm font-light">
                <div className="flex justify-between text-gray-400">
                  <span className="uppercase tracking-widest text-[10px]">{t('subtotal')}</span>
                  <span>{getTotal().toLocaleString()} {t('currency')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span className="uppercase tracking-widest text-[10px]">{t('delivery')}</span>
                  <span className="text-[#C0C0C0] uppercase text-[9px] font-black">{t('complimentary')}</span>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <span className="uppercase tracking-[0.2em] text-[10px] font-black text-white">{t('total')}</span>
                  <div className="text-right">
                    <p className="text-4xl font-serif text-[#C0C0C0] leading-none">
                      {getTotal().toLocaleString()}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-2">{t('vatIncluded')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-3 py-6 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#C0C0C0] hover:text-white transition-all duration-500 shadow-xl shadow-white/5"
                >
                  {t('proceedToCheckout')} <FiArrowRight className={isRTL ? 'rotate-180' : ''} />
                </Link>
                <Link
                  to="/"
                  className="w-full block text-center py-6 border border-white/5 text-gray-500 rounded-2xl text-sm uppercase font-black tracking-widest hover:border-white/20 hover:text-white transition-all"
                >
                  {t('continueShopping')}
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                <div className="text-center">
                  <FiShield className="mx-auto mb-2 text-gray-600" />
                  <p className="text-[8px] uppercase tracking-tighter text-gray-500 leading-tight">{t('twoYearWarranty')}</p>
                </div>
                <div className="text-center">
                  <FiShoppingBag className="mx-auto mb-2 text-gray-600" />
                  <p className="text-[8px] uppercase tracking-tighter text-gray-500 leading-tight">{t('authenticSilver')}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;