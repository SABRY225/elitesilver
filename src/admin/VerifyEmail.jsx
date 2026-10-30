import React, { useState, useEffect } from 'react';
import { FiMail, FiArrowRight, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function VerifyEmail() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("temp_email");

  // حماية الصفحة: إذا لم يوجد إيميل، نرجعه لصفحة الدخول
  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);

    // تحريك التركيز تلقائياً للمربع التالي
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length < 4) {
      return toast.error("يرجى إدخال الرمز كاملاً");
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-code`, {
        email: email,
        code: fullOtp
      });

      // مسح الإيميل المؤقت والتوجه للرئيسية
      setTimeout(() => navigate('/admin'), 1500);
      if (response.status === 200) {
        toast.success("تم التحقق بنجاح! مرحباً بك ✨");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.removeItem('temp_email');
        navigate("/admin");
      }

    } catch (error) {
      toast.error(error.response?.data?.error || "الرمز غير صحيح، حاول مرة أخرى");
      setOtp(new Array(4).fill("")); // تصفير المربعات في حال الخطأ
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    toast.loading("جاري إعادة إرسال الرمز...", { id: 'resend' });
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/login-request`, { email });
      toast.success("تم إرسال رمز جديد لبريدك", { id: 'resend' });
    } catch (err) {
      toast.error("فشل إعادة الإرسال", { id: 'resend' });
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 font-cairo relative overflow-hidden selection:bg-slate-200 selection:text-slate-900"
      dir="rtl"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 shadow-xl shadow-slate-300/40 text-center">
        {/* Animated Security Icon */}
        <div className="w-20 h-20 bg-slate-50 border border-slate-200 text-slate-700 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-sm">
          <FiMail className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">
          تأكيد رمز الدخول الآمن
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-8 leading-relaxed font-semibold">
          تم إرسال رمز الأمان المكون من 4 أرقام إلى: <br />
          <span className="text-slate-900 font-mono font-bold text-sm sm:text-base border-b border-slate-300 pb-0.5 inline-block mt-1">
            {email}
          </span>
        </p>

        {/* مربعات إدخال الرمز */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-8" dir="ltr">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              disabled={loading}
              className="w-13 h-16 sm:w-16 sm:h-18 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-2xl sm:text-3xl font-mono font-black text-slate-900 focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all disabled:opacity-50"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 4}
          className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-wider uppercase transition-all shadow-md active:scale-[0.98] mb-6 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <FiLoader className="animate-spin text-xl text-white" />
          ) : (
            <>
              <span>تأكيد وتسجيل الدخول</span>
              <FiArrowRight className="rotate-180 text-lg" />
            </>
          )}
        </button>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>لم يصلك الرمز؟</span>
          <button
            onClick={handleResend}
            className="text-slate-800 hover:text-black font-bold transition-colors cursor-pointer"
          >
            إعادة إرسال رمز جديد
          </button>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="mt-6 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mx-auto text-xs font-bold cursor-pointer"
        >
          <span>العودة لصفحة الدخول</span>
          <FiArrowRight className="text-sm" />
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;