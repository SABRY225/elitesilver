import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Truck,
  Lock,
  CheckCircle2,
  Gift,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "../contexts/LanguageContext";
import toast from "react-hot-toast";
import axios from "axios";

function CheckoutPage() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [cartItems, setCartItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [shippingFees, setShippingFees] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    city: "",
    address: "",
    phone: "",
    alternatePhone: "",
  });

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);
    } catch (e) {
      console.error(e);
    }
    fetchCities();
    loadUserData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const loadUserData = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const u = JSON.parse(userData);
        setUser(u);
        setFormData((prev) => ({
          ...prev,
          fullName: u.name || "",
          address: u.address || "",
          phone: u.phone ? u.phone.replace("+962", "") : "",
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/city/shipping-cities`
      );
      const citiesData = res.data;
      if (Array.isArray(citiesData)) {
        setCities(citiesData);
        const fees = {};
        citiesData.forEach((city) => {
          fees[city.id] = city.price;
        });
        setShippingFees(fees);

        if (citiesData.length > 0) {
          setFormData((prev) => ({ ...prev, city: citiesData[0].id }));
        }
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      Number(total) + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const shipping = Number(shippingFees[formData.city]) || 0;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "alternatePhone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 9) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.city ||
      !formData.address ||
      !formData.phone
    ) {
      toast.error(
        t("fillAllFields") || (isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
      );
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      t("processingOrder") || (isRTL ? "جاري إرسال طلبك..." : "Processing your order...")
    );

    try {
      const orderData = {
        fullName: formData.fullName,
        city: formData.city,
        address: formData.address,
        phone: "+962" + formData.phone,
        alternatePhone: formData.alternatePhone
          ? "+962" + formData.alternatePhone
          : "",
        paymentMethod,
        cartItems,
        subtotal,
        shipping,
        total,
        ...(user && { userId: user.id }),
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders/new`, orderData);

      toast.dismiss(loadingToast);
      toast.success(
        t("orderSuccess") || (isRTL ? "تم تقديم طلبك بنجاح!" : "Order placed successfully!")
      );

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/order-success");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        t(error?.response?.data?.error) ||
          (isRTL ? "فشل تقديم الطلب، يرجى المحاولة لاحقاً" : "Failed to place order. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems || cartItems.length === 0)
    return (
      <div
        className="min-h-screen bg-[#070709] text-white flex flex-col justify-between"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {isRTL ? "لا توجد عناصر لإتمام الدفع" : "No items to checkout"}
          </h2>
          <Link
            to="/category/all"
            className="silver-btn-luxury px-8 py-3 rounded-full text-black font-bold text-xs uppercase"
          >
            {t("browseCollections") || (isRTL ? "تصفح التشكيلات" : "Browse Collections")}
          </Link>
        </div>
        <Footer />
      </div>
    );

  return (
    <div
      className="bg-[#070709] min-h-screen text-white select-none flex flex-col justify-between"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24 max-w-6xl flex-1">
        {/* زر العودة */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-silver-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-8 cursor-pointer"
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{t("backToCart") || (isRTL ? "العودة إلى السلة" : "Back to Cart")}</span>
        </button>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
        >
          {/* الجانب الأيمن / الأيسر: بيانات الشحن والدفع */}
          <div className="lg:col-span-7 space-y-10">
            {/* معلومات الشحن */}
            <section className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/10">
                <Truck className="w-5 h-5 text-silver-300" />
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {t("shippingInformation") || (isRTL ? "معلومات التوصيل والشحن" : "Shipping Information")}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* الاسم الكامل */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-2">
                    {t("fullName") || (isRTL ? "الاسم الكامل" : "Full Name")} *
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "right-3.5" : "left-3.5"
                      } text-silver-400 w-4 h-4`}
                    />
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder={isRTL ? "أدخل اسمك بالكامل" : "Enter your full name"}
                      className={`w-full ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      } py-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                {/* المدينة */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-2">
                    {t("city") || (isRTL ? "المدينة" : "City")} *
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "right-3.5" : "left-3.5"
                      } text-silver-400 w-4 h-4 pointer-events-none`}
                    />
                    <select
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      } py-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-silver-400 focus:outline-none transition-colors cursor-pointer`}
                    >
                      <option value="" className="bg-[#0e0e13]">
                        {t("selectCity") || (isRTL ? "اختر المدينة" : "Select city")}
                      </option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id} className="bg-[#0e0e13]">
                          {city.name} {city.price > 0 ? `(${city.price} JOD)` : `(${isRTL ? "توصيل مجاني" : "Free Delivery"})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* العنوان التفصيلي */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-2">
                    {t("address") || (isRTL ? "العنوان بالتفصيل" : "Detailed Address")} *
                  </label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder={
                      t("Street, Building, Apartment...") ||
                      (isRTL ? "الشارع، البناية، رقم الشقة..." : "Street, Building, Apartment...")
                    }
                    className="w-full p-4 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* الهاتف الرئيسي */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-2">
                    {t("phone") || (isRTL ? "رقم الهاتف" : "Phone")} *
                  </label>
                  <div className="flex items-center" dir="ltr">
                    <span className="bg-white/5 border border-r-0 border-white/15 px-3 py-3.5 rounded-l-xl text-silver-300 font-mono text-xs">
                      +962
                    </span>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      type="tel"
                      placeholder="7XXXXXXXX"
                      className="flex-1 px-4 py-3.5 bg-black/60 border border-white/15 rounded-r-xl text-xs font-mono text-white focus:border-silver-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* هاتف بديل */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-silver-400 block mb-2">
                    {t("alternatePhone") || (isRTL ? "رقم هاتف بديل (اختياري)" : "Alternate Phone")}
                  </label>
                  <div className="flex items-center" dir="ltr">
                    <span className="bg-white/5 border border-r-0 border-white/15 px-3 py-3.5 rounded-l-xl text-silver-300 font-mono text-xs">
                      +962
                    </span>
                    <input
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      type="tel"
                      placeholder="7XXXXXXXX"
                      className="flex-1 px-4 py-3.5 bg-black/60 border border-white/15 rounded-r-xl text-xs font-mono text-white focus:border-silver-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* طريقة الدفع */}
            <section className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-6 pb-4 border-b border-white/10">
                {t("paymentMethod") || (isRTL ? "طريقة الدفع" : "Payment Method")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* الدفع عند الاستلام */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === "cod"
                      ? "border-white bg-white/10 shadow-lg"
                      : "border-white/10 bg-black/40 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        paymentMethod === "cod"
                          ? "bg-white text-black"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    {paymentMethod === "cod" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">
                      {t("cashOnDelivery") || (isRTL ? "الدفع عند الاستلام" : "Cash on Delivery")}
                    </span>
                    <span className="text-[10px] text-silver-400">
                      {isRTL ? "ادفع نقداً عند استلام شحنتك" : "Pay in cash upon arrival"}
                    </span>
                  </div>
                </div>

                {/* نقاط المكافآت */}
                <div
                  onClick={() => setPaymentMethod("points")}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === "points"
                      ? "border-white bg-white/10 shadow-lg"
                      : "border-white/10 bg-black/40 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        paymentMethod === "points"
                          ? "bg-white text-black"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                    </div>
                    {paymentMethod === "points" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block mb-0.5">
                      {t("paypoints") || (isRTL ? "الدفع بالنقاط" : "Reward Points")}
                    </span>
                    <span className="text-[10px] text-silver-400">
                      {isRTL ? "استبدل نقاطك المكتسبة" : "Redeem loyalty points"}
                    </span>
                  </div>
                </div>

                {/* بطاقة ائتمان (قريباً) */}
                <div
                  onClick={() =>
                    toast(
                      isRTL
                        ? "الدفع الإلكتروني عبر البطاقات متاح قريباً"
                        : "Online card payment coming soon",
                      { icon: "⏳" }
                    )
                  }
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 block mb-0.5">
                      {t("creditCard") || (isRTL ? "بطاقة ائتمان" : "Credit Card")}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono">
                      {t("comingSoon") || (isRTL ? "قريباً" : "Coming Soon")}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* الجانب الأيمن / الأيسر: ملخص الطلب وثبيت الشراء */}
          <aside className="lg:col-span-5 sticky top-32">
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10">
                {t("orderSummary") || (isRTL ? "ملخص الطلب" : "Order Summary")}
              </h2>

              {/* عناصر السلة المصغرة */}
              <div className="max-h-60 overflow-y-auto mb-6 space-y-3 pe-1 scrollbar-thin">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-3 border-b border-white/5 items-center"
                  >
                    <div className="w-14 h-14 bg-black/40 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${import.meta.env.VITE_URL}/${item.image}`
                        }
                        className="w-full h-full object-cover"
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate mb-0.5">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-silver-400">
                        {isRTL ? "الكمية:" : "Qty:"} {item.quantity}
                      </p>
                      <p className="text-xs font-mono font-bold text-white mt-0.5">
                        {((item.price || 0) * (item.quantity || 1)).toLocaleString()}{" "}
                        <span className="text-[9px] text-silver-400">{t("currency")}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* الحسابات */}
              <div className="space-y-3.5 mb-8 text-xs">
                <div className="flex justify-between text-silver-300">
                  <span>{t("subtotal") || (isRTL ? "المجموع الفرعي" : "Subtotal")}</span>
                  <span className="font-mono font-bold text-white">
                    {subtotal.toLocaleString(isRTL ? "ar-JO" : "en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {t("currency")}
                  </span>
                </div>

                <div className="flex justify-between text-silver-300">
                  <span>{t("shipping") || (isRTL ? "رسوم التوصيل" : "Delivery Fee")}</span>
                  <span className={shipping === 0 ? "text-emerald-400 font-bold" : "font-mono font-bold text-white"}>
                    {shipping > 0
                      ? `${shipping.toLocaleString()} ${t("currency")}`
                      : t("complimentary") || (isRTL ? "مجاني" : "Free")}
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
                      {total.toLocaleString(isRTL ? "ar-JO" : "en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs font-bold text-silver-400 ms-1 uppercase">
                      {t("currency")}
                    </span>
                  </div>
                </div>
              </div>

              {/* زر تأكيد الطلب النهائي */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 silver-btn-luxury text-black rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? t("processingOrder") || (isRTL ? "جاري التأكيد..." : "Confirming...")
                    : t("completePurchase") || (isRTL ? "تأكيد الطلب الآن" : "Confirm Order Now")}
                </span>
              </button>

              <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] text-silver-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRTL ? "معاملة مشفرة ومؤمنة بالكامل 256-Bit SSL" : "256-Bit SSL Encrypted Checkout"}</span>
              </div>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default CheckoutPage;