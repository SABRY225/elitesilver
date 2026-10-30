import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Phone,
  User,
  MapPin,
  Plus,
  Minus,
  CreditCard,
  CheckCircle2,
  Coins,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

const SilverCheckout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState({ id: null, fullName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    secondaryPhone: "",
    cityId: "",
    address: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (savedUser) {
        setUser({ id: savedUser.id, fullName: savedUser.name });
        setFormData((prev) => ({
          ...prev,
          fullName: savedUser.name || "",
          phone: savedUser.phone ? savedUser.phone.replace("+962", "") : "",
          address: savedUser.address || "",
        }));
      }
    } catch (e) {
      console.error(e);
    }

    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/city/shipping-cities`
        );
        if (Array.isArray(response.data)) {
          setCities(response.data);
          if (response.data.length > 0) {
            setSelectedCity(response.data[0]);
            setFormData((prev) => ({ ...prev, cityId: response.data[0].id }));
          }
        }
      } catch (error) {
        console.error("Error fetching cities", error);
      }
    };
    fetchCities();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!state) {
    return (
      <div
        className="min-h-screen bg-[#070709] text-white flex flex-col justify-between"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Coins className="w-16 h-16 text-silver-400 mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            {t("productNotFound") || (isRTL ? "لم يتم تحديد سبيكة للطلب" : "No bullion selected")}
          </h2>
          <Link
            to="/#investment-section"
            className="silver-btn-luxury px-8 py-3 rounded-full text-black font-bold text-xs uppercase"
          >
            {isRTL ? "العودة لبورصة الفضة" : "Back to Bullion Rates"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const productPrice = parseFloat(state.price) || 0;
  const deliveryFee = selectedCity ? parseFloat(selectedCity.price) || 0 : 0;
  const totalAmount = productPrice * quantity + deliveryFee;

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const city = cities.find((c) => c.id === parseInt(cityId));
    setSelectedCity(city);
    setFormData((prev) => ({ ...prev, cityId }));
  };

  const handlePhoneChange = (name, val) => {
    const nums = val.replace(/\D/g, "");
    if (nums.length <= 9) {
      setFormData((prev) => ({ ...prev, [name]: nums }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.cityId) {
      toast.error(t("fillAllFields") || (isRTL ? "يرجى ملء كافة الحقول المطلوبة" : "Please fill all required fields"));
      return;
    }

    if (formData.phone.length < 9) {
      toast.error(
        isRTL
          ? "يرجى إدخال رقم هاتف صحيح مكون من 9 أرقام"
          : "Please enter a valid 9-digit phone number"
      );
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(
      t("processingOrder") || (isRTL ? "جاري تنفيذ طلب السبيكة..." : "Processing bullion order...")
    );

    try {
      const finalData = {
        ...formData,
        phone: `+962${formData.phone}`,
        secondaryPhone: formData.secondaryPhone
          ? `+962${formData.secondaryPhone}`
          : "",
        userId: user.id,
        quantity: quantity,
        total_price: totalAmount,
        productName: state.name,
        productPrice: state.price,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/orders/silver`, finalData);
      toast.dismiss(loadingToast);
      toast.success(
        t("orderSuccess") || (isRTL ? "تم تسجيل طلب السبيكة بنجاح!" : "Bullion order placed successfully!")
      );
      navigate("/order-success");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        t("orderError") || (isRTL ? "فشل تقديم الطلب، يرجى المحاولة لاحقاً" : "Failed to place order")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#070709] text-white select-none flex flex-col justify-between"
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
          <span>{isRTL ? "العودة إلى بورصة الفضة" : "Back to Bullion Market"}</span>
        </button>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
        >
          {/* الجانب الأيمن / الأيسر: بيانات التوصيل والدفع */}
          <div className="lg:col-span-7 space-y-10">
            <header className="mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono mb-3">
                <Coins className="w-3.5 h-3.5" />
                <span>Ag 999.0 Fine Silver</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {isRTL ? "تأكيد طلب سبائك الفضة" : "Bullion Order Checkout"}
              </h1>
              <p className="text-silver-400 text-xs sm:text-sm mt-1.5 font-light">
                {t("completeDetailsToFinishOrder") ||
                  (isRTL
                    ? "أكمل تفاصيل التوصيل لاستلام سبائكك المعتمدة مع شهادات النقاء."
                    : "Complete delivery details to receive your certified silver bullion.")}
              </p>
            </header>

            <section className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
              {user.id && (
                <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-300 p-4 rounded-2xl border border-emerald-500/20 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {t("welcome")}, {user.fullName}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* الاسم الكامل */}
                <div>
                  <label className="block text-xs font-bold text-silver-300 mb-2">
                    {t("fullName")} *
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute top-1/2 -translate-y-1/2 ${
                        isRTL ? "right-3.5" : "left-3.5"
                      } text-silver-400 w-4 h-4`}
                    />
                    <input
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder={isRTL ? "الاسم الكامل للمشتري" : "Buyer's Full Name"}
                      className={`w-full ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      } py-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none transition-colors`}
                    />
                  </div>
                </div>

                {/* أرقام الهواتف */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-silver-300 mb-2">
                      {t("phone")} *
                    </label>
                    <div className="flex items-center" dir="ltr">
                      <span className="bg-white/5 border border-r-0 border-white/15 px-3 py-3.5 rounded-l-xl text-silver-300 font-mono text-xs">
                        +962
                      </span>
                      <input
                        required
                        type="tel"
                        maxLength="9"
                        placeholder="7XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) =>
                          handlePhoneChange("phone", e.target.value)
                        }
                        className="flex-1 px-4 py-3.5 bg-black/60 border border-white/15 rounded-r-xl text-xs font-mono text-white focus:border-silver-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-silver-300 mb-2">
                      {t("secondaryPhone") || (isRTL ? "هاتف بديل (اختياري)" : "Alternate Phone")}
                    </label>
                    <div className="flex items-center" dir="ltr">
                      <span className="bg-white/5 border border-r-0 border-white/15 px-3 py-3.5 rounded-l-xl text-silver-300 font-mono text-xs">
                        +962
                      </span>
                      <input
                        type="tel"
                        maxLength="9"
                        placeholder="7XXXXXXXX"
                        value={formData.secondaryPhone}
                        onChange={(e) =>
                          handlePhoneChange("secondaryPhone", e.target.value)
                        }
                        className="flex-1 px-4 py-3.5 bg-black/60 border border-white/15 rounded-r-xl text-xs font-mono text-white focus:border-silver-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* المدينة والعنوان */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-silver-300 mb-2">
                      {t("city")} *
                    </label>
                    <div className="relative">
                      <MapPin
                        className={`absolute top-1/2 -translate-y-1/2 ${
                          isRTL ? "right-3.5" : "left-3.5"
                        } text-silver-400 w-4 h-4 pointer-events-none`}
                      />
                      <select
                        required
                        value={formData.cityId}
                        onChange={handleCityChange}
                        className={`w-full ${
                          isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                        } py-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white focus:border-silver-400 focus:outline-none transition-colors cursor-pointer`}
                      >
                        <option value="" className="bg-[#0e0e13]">
                          {t("selectCity")}...
                        </option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id} className="bg-[#0e0e13]">
                            {city.name} {city.price > 0 ? `(${city.price} JOD)` : `(${isRTL ? "مجاني" : "Free"})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-silver-300 mb-2">
                      {t("address")} *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder={t("detailedAddress") || (isRTL ? "الشارع، البناية..." : "Street, Building...")}
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* طرق الدفع */}
              <div className="pt-6 border-t border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-silver-300 mb-4">
                  {t("paymentMethod")}
                </label>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "cod" })
                    }
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      formData.paymentMethod === "cod"
                        ? "border-white bg-white/10 shadow-lg"
                        : "border-white/10 bg-black/40 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-silver-300" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {t("cashOnDelivery")}
                        </div>
                        <div className="text-[10px] text-silver-400">
                          {t("payWhenReceive")}
                        </div>
                      </div>
                    </div>
                    {formData.paymentMethod === "cod" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>

                  <div
                    onClick={() =>
                      toast(
                        isRTL
                          ? "الدفع بالبطاقات متاح قريباً"
                          : "Card payment coming soon",
                        { icon: "⏳" }
                      )
                    }
                    className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="text-xs font-bold text-gray-400">
                          {t("creditCard")}
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">
                          {t("comingSoon")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* الجانب الأيمن / الأيسر: ملخص السبيكة وتأكيد الشراء */}
          <aside className="lg:col-span-5 sticky top-32 space-y-6">
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-xl shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{t("orderSummary")}</span>
              </h3>

              {/* بطاقة السبيكة المطلوبة */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-silver-200 shrink-0">
                    <Coins className="w-7 h-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {state.name}
                    </h4>
                    <p className="text-xs font-mono text-silver-300 mt-0.5">
                      {productPrice.toLocaleString()}{" "}
                      <span className="text-[10px] text-silver-400 uppercase">
                        {t("currency")}
                      </span>
                    </p>
                  </div>
                </div>

                {/* أزرار زيادة ونقصان الكمية */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 flex items-center justify-center text-silver-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs min-w-[16px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-6 h-6 flex items-center justify-center text-silver-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* الحسابات */}
              <div className="space-y-3.5 mb-6 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between text-silver-300">
                  <span>{t("subtotal")}</span>
                  <span className="font-mono font-bold text-white">
                    {(productPrice * quantity).toLocaleString()}{" "}
                    {t("currency")}
                  </span>
                </div>

                <div className="flex justify-between text-silver-300">
                  <span>{t("shipping")}</span>
                  <span
                    className={
                      deliveryFee > 0
                        ? "font-mono font-bold text-white"
                        : "text-emerald-400 font-bold"
                    }
                  >
                    {deliveryFee > 0
                      ? `+ ${deliveryFee} ${t("currency")}`
                      : t("free") || (isRTL ? "مجاني" : "Free")}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-silver-400 block">
                      {t("totalAmount")}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {isRTL ? "شامل الضريبة وفحص النقاء" : "Assay & VAT Included"}
                    </span>
                  </div>

                  <div className="text-end">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                      {totalAmount.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-silver-400 ms-1 uppercase">
                      {t("currency")}
                    </span>
                  </div>
                </div>
              </div>

              {/* زر التأكيد والدفع */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 silver-btn-luxury text-black rounded-xl font-black text-sm uppercase tracking-wider shadow-xl active:scale-95 transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {isSubmitting
                    ? t("processingOrder") || (isRTL ? "جاري التأكيد..." : "Confirming...")
                    : t("confirmAndPay") || (isRTL ? "أكد واطلب الآن" : "Confirm & Order Now")}
                </span>
                {!isSubmitting &&
                  (isRTL ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  ))}
              </button>
            </div>

            {/* شارة الضمان والأمان */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <Award className="w-5 h-5 text-silver-300 shrink-0 mt-0.5" />
              <div className="text-xs text-silver-400 leading-relaxed">
                <strong className="text-white block mb-0.5">
                  {isRTL ? "ضمان الأصالة والشهادة المعتمدة:" : "Certified Bullion Warranty:"}
                </strong>
                {t("deliveryInfo")}
              </div>
            </div>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default SilverCheckout;