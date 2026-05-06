import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiUser, FiPhone, FiMapPin } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguage } from "../contexts/LanguageContext";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    phone: '', // سيخزن الـ 9 أرقام فقط
    Address: '',
    email: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // قيود خاصة بحقل الهاتف (أرقام فقط ولا يتجاوز 9 خانات)
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 9) {
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (step === 'email') {
      if (!formData.email) {
        newErrors.email = t('emailRequired');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('invalidEmail');
      }

      if (!isLogin) {
        if (!formData.name) newErrors.name = t('nameRequired');
        
        // التحقق من الرقم الأردني (يجب أن يبدأ بـ 77 أو 78 أو 79 وطوله 9 أرقام)
        const jordanRegex = /^(77|78|79)\d{7}$/;
        if (!formData.phone) {
          newErrors.phone = t('phoneRequired');
        } else if (!jordanRegex.test(formData.phone)) {
          newErrors.phone = t('invalidJordanPhone'); // "يجب أن يبدأ بـ 79، 78، أو 77"
        }

        if (!formData.Address) newErrors.Address = t('addressRequired');
      }
    } else if (step === 'otp') {
      if (!formData.otp) {
        newErrors.otp = t('otpRequired');
      } else if (!/^\d{4}$/.test(formData.otp)) {
        newErrors.otp = t('invalidOTP');
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
      if (step === 'email') {
        const endpoint = isLogin 
          ? `${import.meta.env.VITE_API_URL}/auth/login` 
          : `${import.meta.env.VITE_API_URL}/auth/register`;
        
        // دمج الكود الدولي مع الرقم عند الإرسال للسيرفر
        const fullPhone = isLogin ? "" : `+962${formData.phone}`;

        const payload = isLogin
          ? { email: formData.email }
          : { 
              name: formData.name, 
              email: formData.email, 
              phone: fullPhone, 
              address: formData.Address 
            };

        await axios.post(endpoint, payload);
        toast.success(t('otpSentSuccess'));
        setStep('otp');
      } else if (step === 'otp') {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-code`, {
          email: formData.email,
          code: formData.otp
        });
        
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData || formData));

        window.dispatchEvent(new CustomEvent('authUpdated', { detail: { user: userData, token } }));
        toast.success(t('otpVerificationSuccess'));
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('authError'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', Address: '', email: '', otp: '' });
    setErrors({});
    setStep('email');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-silver-500 to-silver-600 p-6 text-white text-center">
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <FiX className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold">{step === 'email' ? (isLogin ? t('welcomeBack') : t('createAccount')) : t('enterOTP')}</h2>
              <p className="text-silver-100 mt-2">{step === 'email' ? (isLogin ? t('signInToContinue') : t('joinEliteSilver')) : t('otpSent')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {step === 'email' ? (
                <>
                  {!isLogin && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4">
                      {/* Name */}
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
                        <input
                          type="text" name="name" value={formData.name} onChange={handleInputChange}
                          placeholder={t('fullName')}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-red-300' : 'border-silver-200'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      {/* Phone with Separated Prefix */}
                      <div className="relative">
                        <div className="flex items-center">
                          {/* Country Code Box */}
                          <div className="flex items-center gap-1 bg-silver-50 border border-r-0 border-silver-200 px-3 py-3 rounded-l-lg text-silver-600 font-semibold">
                            <FiPhone className="w-4 h-4" />
                            <span className="text-sm" dir="ltr">+962</span>
                          </div>
                          {/* Input Field */}
                          <input
                            type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            placeholder="7XXXXXXXX"
                            className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 outline-none font-sans ${errors.phone ? 'border-red-300' : 'border-silver-200'}`}
                            dir="ltr"
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Address */}
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
                        <input
                          type="text" name="Address" value={formData.Address} onChange={handleInputChange}
                          placeholder={t('address')}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 outline-none ${errors.Address ? 'border-red-300' : 'border-silver-200'}`}
                        />
                        {errors.Address && <p className="text-red-500 text-xs mt-1">{errors.Address}</p>}
                      </div>
                    </motion.div>
                  )}

                  {/* Email */}
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-400 w-5 h-5" />
                    <input
                      type="email" name="email" value={formData.email} onChange={handleInputChange}
                      placeholder={t('email')}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 outline-none ${errors.email ? 'border-red-300' : 'border-silver-200'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text" name="otp" value={formData.otp} onChange={handleInputChange}
                    placeholder="****" maxLength="4"
                    className="w-full text-center text-2xl tracking-[1rem] py-3 border rounded-lg focus:ring-2 outline-none border-silver-200 text-[#000]"
                  />
                  <div className="text-center">
                    <button type="button" onClick={() => {/* Resend logic */}} className="text-silver-600 text-sm hover:underline">
                      {t('resendOTP')}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-silver-500 to-silver-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? t('processing') : (step === 'email' ? t('continue') : t('verify'))}
              </button>

              {step === 'email' && (
                <p className="text-center text-sm text-silver-500">
                  {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                  <button type="button" onClick={() => { setIsLogin(!isLogin); resetForm(); }} className="text-silver-600 font-bold underline">
                    {isLogin ? t('signUp') : t('signIn')}
                  </button>
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;