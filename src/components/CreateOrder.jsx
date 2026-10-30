import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Upload,
  User,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  RotateCcw,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "../contexts/LanguageContext";
import toast from "react-hot-toast";

const CreateOrder = () => {
  const { t, language, isRTL } = useLanguage();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (savedUser) {
        setCustomerInfo({
          name: savedUser.name || "",
          phone: savedUser.phone ? savedUser.phone.replace("+962", "") : "",
          address: savedUser.address || "",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error(
        isRTL
          ? "يرجى رفع صورة التصميم المطلوب تنفيذه"
          : "Please upload your design reference image"
      );
      return;
    }

    if (!customerInfo.phone || customerInfo.phone.length < 9) {
      toast.error(
        isRTL
          ? "يرجى إدخال رقم هاتف صحيح مكون من 9 أرقام"
          : "Please enter a valid 9-digit phone number"
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const fullPhone = `+962${customerInfo.phone}`;

    formData.append("customerName", customerInfo.name);
    formData.append("customerPhone", fullPhone);
    formData.append("customerAddress", customerInfo.address);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/custom/order`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSubmitted(true);
      toast.success(
        t("success_title") ||
          (isRTL ? "تم استلام طلبك بنجاح!" : "Custom design submitted!")
      );
    } catch (err) {
      toast.error(
        isRTL
          ? "فشل في إرسال الطلب، يرجى المحاولة لاحقاً"
          : "Submission failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-[#070709] flex flex-col justify-between text-white select-none"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 py-40">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 sm:p-14 rounded-3xl sm:rounded-[3rem] border border-white/10 backdrop-blur-2xl shadow-2xl max-w-lg w-full"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <CheckCircle2 className="text-emerald-400 w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
              {t("success_title") || (isRTL ? "وصل طلبك بنجاح!" : "Order Received!")}
            </h2>

            <p className="text-silver-400 text-sm leading-relaxed mb-8 font-light">
              {t("success_msg") ||
                (isRTL
                  ? "سيتواصل معك فريق النخبة عبر الواتساب أو الهاتف لمراجعة أدق تفاصيل القطعة وتحديد التكلفة ومدة التنفيذ."
                  : "Our design master will contact you on WhatsApp/Phone shortly with exact quotation.")}
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setDescription("");
                setImage(null);
                setPreview(null);
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 silver-btn-luxury text-black rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t("back_btn") || (isRTL ? "إرسال طلب تصميم آخر" : "Submit Another Design")}</span>
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="bg-[#070709] text-white select-none min-h-screen flex flex-col justify-between"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-24 max-w-6xl flex-1">
        {/* ترويسة الصفحة */}
        <header className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-silver-300 font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-silver-400" />
            <span>ELITE BESPOKE ATELIER</span>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4"
          >
            {t("title") || (isRTL ? "طلب تفصيل خاص" : "Custom Jewelry Commission")}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-silver-400 text-sm sm:text-base font-light leading-relaxed"
          >
            {t("subtitle") ||
              (isRTL
                ? "ارفع تصميمك أو صورة القطعة التي تحلم بها، وسنقوم بصياغتها يدوياً بأعلى معايير الفضة الإيطالية عيار 925."
                : "Upload your reference design, and our master silversmiths will craft it in Italian 925 silver.")}
          </motion.p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* الجانب الأيمن / الأيسر: البيانات والوصف */}
          <div className="lg:col-span-7 space-y-8">
            {/* البيانات الشخصية */}
            <section className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl">
              <h3 className="text-base sm:text-lg font-bold mb-6 flex items-center gap-2.5 border-b border-white/10 pb-4">
                <User className="w-5 h-5 text-silver-300" />
                <span>{t("personal_info") || (isRTL ? "معلومات التواصل" : "Contact Information")}</span>
              </h3>

              <div className="space-y-4">
                {/* الاسم */}
                <div>
                  <label className="text-[11px] font-bold text-silver-400 uppercase tracking-wider block mb-2">
                    {t("name_label") || (isRTL ? "الاسم بالكامل" : "Full Name")} *
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
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      className={`w-full ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      } py-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none transition-colors`}
                      placeholder={isRTL ? "أدخل اسمك" : "Enter your name"}
                    />
                  </div>
                </div>

                {/* الهاتف */}
                <div>
                  <label className="text-[11px] font-bold text-silver-400 uppercase tracking-wider block mb-2">
                    {t("phone_label") || (isRTL ? "رقم الهاتف (الأردن)" : "Phone Number (Jordan)")} *
                  </label>
                  <div className="flex items-center" dir="ltr">
                    <span className="bg-white/5 border border-r-0 border-white/15 px-3.5 py-3.5 rounded-l-xl text-silver-300 font-mono text-xs">
                      +962
                    </span>
                    <input
                      required
                      type="tel"
                      maxLength="9"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="7XXXXXXXX"
                      className="flex-1 px-4 py-3.5 bg-black/60 border border-white/15 rounded-r-xl text-xs font-mono text-white focus:border-silver-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* العنوان */}
                <div>
                  <label className="text-[11px] font-bold text-silver-400 uppercase tracking-wider block mb-2">
                    {t("address_label") || (isRTL ? "عنوان التوصيل" : "Delivery Address")} *
                  </label>
                  <div className="relative">
                    <MapPin
                      className={`absolute top-4 ${
                        isRTL ? "right-3.5" : "left-3.5"
                      } text-silver-400 w-4 h-4`}
                    />
                    <textarea
                      required
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                      rows="3"
                      placeholder={isRTL ? "المدينة، المنطقة، الشارع..." : "City, Area, Street..."}
                      className={`w-full ${
                        isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                      } p-3.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none transition-colors resize-none`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* تفاصيل ووصف التصميم */}
            <section className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-xl">
              <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2.5 border-b border-white/10 pb-4">
                <FileText className="w-5 h-5 text-silver-300" />
                <span>{t("design_details") || (isRTL ? "تفاصيل القطعة المطلوبة" : "Design Details")}</span>
              </h3>

              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                placeholder={
                  t("desc_placeholder") ||
                  (isRTL
                    ? "اوصف لنا القطعة بالتفصيل (النوع: خاتم/سوار/قلادة، القياس التقريبي، العيار، تفاصيل النقش أو الأحجار المطلوبة)..."
                    : "Describe your piece (Type, size, engraving details, stone preference)...")
                }
                className="w-full p-4 bg-black/60 border border-white/15 rounded-2xl text-xs text-white placeholder-gray-500 focus:border-silver-400 focus:outline-none resize-none transition-colors"
              />
            </section>
          </div>

          {/* الجانب الأيمن / الأيسر: رفع صورة التصميم والزر */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
            <div className="p-3 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
              <input
                type="file"
                id="img-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />

              {preview ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative h-80 sm:h-96 w-full group rounded-2xl overflow-hidden border border-white/10"
                >
                  <img
                    src={preview}
                    alt="Design Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImage(null);
                      }}
                      className="bg-red-500 p-3.5 rounded-full hover:scale-110 transition-transform shadow-2xl text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <label
                  htmlFor="img-upload"
                  className="flex flex-col items-center justify-center h-80 sm:h-96 cursor-pointer hover:bg-white/5 transition-all group rounded-2xl border-2 border-dashed border-white/20 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                    <Upload className="w-8 h-8 text-silver-300" />
                  </div>
                  <p className="font-bold text-sm text-white mb-1.5">
                    {t("upload_label") || (isRTL ? "اضغط لرفع صورة التصميم" : "Upload Design Image")}
                  </p>
                  <p className="text-silver-500 text-[11px]">
                    {t("upload_hint") || (isRTL ? "يدعم صور JPG أو PNG" : "Supports JPG, PNG")}
                  </p>
                </label>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 silver-btn-luxury text-black rounded-xl font-black text-sm uppercase tracking-wider shadow-xl active:scale-95 transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? t("sending") || (isRTL ? "جاري الإرسال..." : "Sending...") : t("submit") || (isRTL ? "إرسال طلب التفصيل للنخبة" : "Submit Commission")}</span>
              {!loading &&
                (isRTL ? (
                  <ArrowLeft className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                ))}
            </button>

            <div className="text-center text-[11px] text-silver-400/80 leading-relaxed px-4">
              {isRTL
                ? "سيتواصل معك فريق النخبة عبر الواتساب فور مراجعة الصورة لتأكيد السعر النهائي ومدة التنفيذ."
                : "Our master goldsmith will reach out on WhatsApp to confirm lead time & final pricing."}
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreateOrder;