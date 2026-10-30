import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState("email");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    Address: "",
    email: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { t, isRTL } = useLanguage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 9) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (step === "email") {
      if (!formData.email) {
        newErrors.email = t("emailRequired") || (isRTL ? "البريد الإلكتروني مطلوب" : "Email is required");
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t("invalidEmail") || (isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email format");
      }

      if (!isLogin) {
        if (!formData.name)
          newErrors.name = t("nameRequired") || (isRTL ? "الاسم مطلوب" : "Name is required");

        const jordanRegex = /^(77|78|79)\d{7}$/;
        if (!formData.phone) {
          newErrors.phone = isRTL ? "رقم الهاتف مطلوب" : "Phone number is required";
        } else if (!jordanRegex.test(formData.phone)) {
          newErrors.phone = isRTL
            ? "يجب أن يبدأ الرقم بـ 77 أو 78 أو 79 ومكون من 9 أرقام"
            : "Must be 9 digits starting with 77, 78, or 79";
        }

        if (!formData.Address)
          newErrors.Address = isRTL ? "العنوان مطلوب" : "Address is required";
      }
    } else if (step === "otp") {
      if (!formData.otp) {
        newErrors.otp = t("otpRequired") || (isRTL ? "رمز التحقق مطلوب" : "OTP code is required");
      } else if (!/^\d{4}$/.test(formData.otp)) {
        newErrors.otp = t("invalidOTP") || (isRTL ? "الرمز يجب أن يتكون من 4 أرقام" : "Code must be 4 digits");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (step === "email") {
        const endpoint = isLogin
          ? `${import.meta.env.VITE_API_URL}/auth/login`
          : `${import.meta.env.VITE_API_URL}/auth/register`;

        const fullPhone = isLogin ? "" : `+962${formData.phone}`;

        const payload = isLogin
          ? { email: formData.email }
          : {
              name: formData.name,
              email: formData.email,
              phone: fullPhone,
              address: formData.Address,
            };

        await axios.post(endpoint, payload);
        toast.success(t("otpSentSuccess") || (isRTL ? "تم إرسال رمز التحقق إلى بريدك" : "Verification code sent to your email"));
        setStep("otp");
      } else if (step === "otp") {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/verify-code`,
          {
            email: formData.email,
            code: formData.otp,
          }
        );

        const { token, user: userData } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData || formData));

        window.dispatchEvent(
          new CustomEvent("authUpdated", { detail: { user: userData, token } })
        );
        toast.success(t("otpVerificationSuccess") || (isRTL ? "تم تسجيل الدخول بنجاح!" : "Logged in successfully!"));
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("authError") || (isRTL ? "حدث خطأ أثناء المصادقة" : "Authentication error"));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", Address: "", email: "", otp: "" });
    setErrors({});
    setStep("email");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-4 sm:p-6 select-none"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0e0e13] border border-white/15 rounded-3xl sm:rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.85)] w-full max-w-md overflow-hidden text-white relative"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-b from-white/10 to-transparent p-6 sm:p-8 text-center border-b border-white/10">
              <button
                onClick={onClose}
                aria-label="Close"
                className={`absolute top-4 ${
                  isRTL ? "left-4" : "right-4"
                } w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-silver-300 hover:text-white border border-white/10`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-silver-300 uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3 text-silver-400" />
                <span>ELITE SILVER 925</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {step === "email"
                  ? isLogin
                    ? t("welcomeBack") || (isRTL ? "مرحباً بعودتك" : "Welcome Back")
                    : t("createAccount") || (isRTL ? "إنشاء حساب جديد" : "Create Account")
                  : t("enterOTP") || (isRTL ? "تأكيد الرمز" : "Verify Code")}
              </h2>

              <p className="text-silver-400 text-xs mt-1.5 font-light">
                {step === "email"
                  ? isLogin
                    ? t("signInToContinue") || (isRTL ? "سجل الدخول للوصول إلى طلباتك ومفضلتك" : "Sign in to access your orders & wishlist")
                    : t("joinEliteSilver") || (isRTL ? "انضم لنخبة مقتني الفضة الإسترلينية" : "Join our elite jewelry circle")
                  : t("otpSent") || (isRTL ? "أدخل الرمز المكون من 4 أرقام المرسل لبريدك" : "Enter the 4-digit code sent to your email")}
              </p>

              {/* أزرار التبديل بين تسجيل الدخول وإنشاء الحساب في خطوة الإيميل */}
              {step === "email" && (
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      resetForm();
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isLogin
                        ? "bg-white text-black shadow-md"
                        : "text-silver-400 hover:text-white"
                    }`}
                  >
                    {t("signIn") || (isRTL ? "تسجيل الدخول" : "Sign In")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      resetForm();
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      !isLogin
                        ? "bg-white text-black shadow-md"
                        : "text-silver-400 hover:text-white"
                    }`}
                  >
                    {t("signUp") || (isRTL ? "حساب جديد" : "Register")}
                  </button>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
              {step === "email" ? (
                <>
                  {!isLogin && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div>
                        <div className="relative">
                          <User
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              isRTL ? "right-3.5" : "left-3.5"
                            } text-silver-400 w-4 h-4`}
                          />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t("fullName") || (isRTL ? "الاسم بالكامل" : "Full Name")}
                            className={`w-full ${
                              isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                            } py-3.5 bg-black/50 border rounded-xl focus:border-silver-400 focus:outline-none text-white text-xs placeholder:text-gray-500 transition-colors ${
                              errors.name ? "border-red-500/80" : "border-white/15"
                            }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-400 text-[11px] mt-1 px-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Phone with Separated Prefix */}
                      <div>
                        <div className="relative flex items-center" dir="ltr">
                          <div className="flex items-center gap-1.5 bg-white/5 border border-r-0 border-white/15 px-3.5 py-3.5 rounded-l-xl text-silver-300 font-mono text-xs">
                            <Phone className="w-3.5 h-3.5 text-silver-400" />
                            <span>+962</span>
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="7XXXXXXXX"
                            className={`flex-1 px-4 py-3.5 bg-black/50 border rounded-r-xl focus:border-silver-400 focus:outline-none text-white font-mono text-xs placeholder:text-gray-500 transition-colors ${
                              errors.phone ? "border-red-500/80" : "border-white/15"
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-400 text-[11px] mt-1 px-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <div className="relative">
                          <MapPin
                            className={`absolute top-1/2 -translate-y-1/2 ${
                              isRTL ? "right-3.5" : "left-3.5"
                            } text-silver-400 w-4 h-4`}
                          />
                          <input
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleInputChange}
                            placeholder={t("address") || (isRTL ? "العنوان بالتفصيل (المدينة، الشارع...)" : "Detailed Address")}
                            className={`w-full ${
                              isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                            } py-3.5 bg-black/50 border rounded-xl focus:border-silver-400 focus:outline-none text-white text-xs placeholder:text-gray-500 transition-colors ${
                              errors.Address ? "border-red-500/80" : "border-white/15"
                            }`}
                          />
                        </div>
                        {errors.Address && (
                          <p className="text-red-400 text-[11px] mt-1 px-1">
                            {errors.Address}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Email */}
                  <div>
                    <div className="relative">
                      <Mail
                        className={`absolute top-1/2 -translate-y-1/2 ${
                          isRTL ? "right-3.5" : "left-3.5"
                        } text-silver-400 w-4 h-4`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("email") || (isRTL ? "البريد الإلكتروني" : "Email Address")}
                        className={`w-full ${
                          isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                        } py-3.5 bg-black/50 border rounded-xl focus:border-silver-400 focus:outline-none text-white text-xs placeholder:text-gray-500 transition-colors ${
                          errors.email ? "border-red-500/80" : "border-white/15"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-[11px] mt-1 px-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* OTP Verification Step */
                <div className="space-y-5 py-2">
                  <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-silver-300">
                      <KeyRound className="w-7 h-7" />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="• • • •"
                      maxLength="4"
                      className="w-full text-center text-3xl font-mono tracking-[1rem] py-4 bg-black/60 border border-white/20 rounded-2xl focus:border-silver-400 focus:outline-none text-white"
                      autoFocus
                    />
                    {errors.otp && (
                      <p className="text-red-400 text-xs text-center mt-2">
                        {errors.otp}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="text-silver-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isRTL ? "تغيير البريد" : "Change Email"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 silver-btn-luxury text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <span>
                  {loading
                    ? t("processing") || (isRTL ? "جاري المعالجة..." : "Processing...")
                    : step === "email"
                    ? t("continue") || (isRTL ? "متابعة" : "Continue")
                    : t("verify") || (isRTL ? "تأكيد الرمز" : "Verify & Sign In")}
                </span>
                {!loading &&
                  (isRTL ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  ))}
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-silver-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRTL ? "تسجيل دخول آمن ومشفّر" : "Encrypted 256-Bit Secure Auth"}</span>
                </span>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;