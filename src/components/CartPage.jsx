import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (e) {
      console.error("Error loading cart:", e);
    }
  }, []);

  const saveCart = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    saveCart(updatedItems);
  };

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + (parseFloat(item.price) || 0) * (item.quantity || 1),
      0
    );

  // حالة السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen bg-[#070709] text-white flex flex-col select-none"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver-400 mx-auto shadow-inner">
                <ShoppingBag className="w-12 h-12 text-silver-300" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute top-1 right-1 w-5 h-5 bg-silver-400 rounded-full border-4 border-[#070709] shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {t("yourCartIsEmpty") || (isRTL ? "حقيبة التسوق فارغة" : "Your Shopping Bag is Empty")}
            </h1>

            <p className="text-silver-400 text-sm sm:text-base mb-8 font-light leading-relaxed">
              {t("addSomeProducts") ||
                (isRTL
                  ? "اكتشف بريق الفضة الإسترلينية الإيطالية وأضف قطعك المفضلة للحقيبة."
                  : "Explore our handcrafted 925 sterling silver jewelry and add your favorites.")}
            </p>

            <Link
              to="/category/all"
              className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 silver-btn-luxury text-black rounded-full font-black uppercase tracking-wider text-xs sm:text-sm shadow-xl active:scale-95 transition-all"
            >
              <span>{t("startDiscovery") || (isRTL ? "ابدأ التسوق الآن" : "Start Shopping")}</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-36 sm:pt-44">
        {/* ترويسة الصفحة */}
        <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300 font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-silver-400" />
              <span>ELITE SILVER 925</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {t("shoppingBag") || (isRTL ? "حقيبة التسوق" : "Shopping Bag")}
            </h1>
            <p className="text-silver-400 text-xs sm:text-sm mt-1 font-medium">
              {cartItems.length} {isRTL ? "قطع مميزة قيد الحجز" : "items selected"}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("secureCheckout") || (isRTL ? "دفع آمن ومشفّر" : "Secure Checkout")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* قائمة عناصر السلة */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = item.quantity || 1;
                const subtotal = price * quantity;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={item.id}
                    className="group relative p-4 sm:p-6 bg-gradient-to-b from-white/[0.06] to-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/10 hover:border-silver-400/40 transition-all duration-400 flex flex-col sm:flex-row items-center sm:items-stretch gap-5"
                  >
                    {/* الصورة */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_URL}/${item.image}`
                        }
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=200&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="text-base sm:text-lg font-bold text-white hover:text-silver-300 transition-colors line-clamp-1">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="text-[11px] text-silver-400 mt-0.5">
                            {isRTL ? "فضة إسترلينية عيار 925" : "925 Sterling Silver"}
                          </div>
                        </div>

                        {/* زر الحذف */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="p-2 text-silver-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                          title={isRTL ? "إزالة من السلة" : "Remove"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* السعر والكمية */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        {/* أزرار زيادة ونقصان الكمية */}
                        <div className="flex items-center border border-white/15 rounded-xl bg-black/40 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-silver-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-mono font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-silver-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* المجموع الفرعي للقطعة */}
                        <div className="text-end">
                          <span className="text-lg sm:text-xl font-bold font-mono text-white">
                            {subtotal.toLocaleString(isRTL ? "ar-JO" : "en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <span className="text-[11px] text-silver-400 font-bold uppercase ms-1">
                            {t("currency")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* الشريط الجانبي لملخص الطلب */}
          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                {t("orderSummary") || (isRTL ? "ملخص الطلب" : "Order Summary")}
              </h2>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-silver-300">
                  <span>{t("subtotal") || (isRTL ? "المجموع الفرعي" : "Subtotal")}</span>
                  <span className="font-mono font-bold text-white">
                    {getTotal().toLocaleString(isRTL ? "ar-JO" : "en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {t("currency")}
                  </span>
                </div>

                <div className="flex justify-between text-silver-300">
                  <span>{t("shipping") || (isRTL ? "التوصيل والشحن" : "Shipping")}</span>
                  <span className="text-emerald-400 font-bold text-xs uppercase">
                    {t("complimentary") || (isRTL ? "مجاني" : "Free")}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-white uppercase tracking-wider block">
                      {t("total") || (isRTL ? "المجموع الكلي" : "Total")}
                    </span>
                    <span className="text-[10px] text-silver-400">
                      {t("vatIncluded") || (isRTL ? "شامل كافة الضرائب" : "VAT included")}
                    </span>
                  </div>

                  <div className="text-end">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {getTotal().toLocaleString(isRTL ? "ar-JO" : "en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs font-bold text-silver-400 ms-1 uppercase">
                      {t("currency")}
                    </span>
                  </div>
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="w-full py-4 silver-btn-luxury text-black rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <span>{t("proceedToCheckout") || (isRTL ? "المتابعة للدفع" : "Proceed to Checkout")}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Link>

                <Link
                  to="/category/all"
                  className="w-full block text-center py-3.5 border border-white/10 text-silver-300 hover:text-white hover:border-white/20 rounded-xl text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
                >
                  {t("continueShopping") || (isRTL ? "متابعة التسوق" : "Continue Shopping")}
                </Link>
              </div>

              {/* شارات الثقة والضمان */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-center text-xs text-silver-400">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-silver-300 mx-auto mb-1" />
                  <span className="text-[10px] block font-medium">
                    {isRTL ? "ضمان عامين على الفضة" : "2-Year Warranty"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <Truck className="w-4 h-4 text-silver-300 mx-auto mb-1" />
                  <span className="text-[10px] block font-medium">
                    {isRTL ? "توصيل سريع ومؤمن" : "Fast Insured Delivery"}
                  </span>
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