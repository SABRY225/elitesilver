import React, { useState, useEffect } from 'react';
import { FiMail, FiArrowRight, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
    <div className="min-h-screen bg-[#fdfaf9] flex items-center justify-center p-6 font-['Tajawal']" dir="rtl">
      <Toaster position="top-center" />

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-10 text-center">

        <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full mx-auto flex items-center justify-center mb-6">
          <FiMail className="text-4xl animate-pulse" />
        </div>

        <h2 className="text-2xl font-black text-slate-800 mb-2">تحقق من بريدك</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          أرسلنا رمز التحقق إلى <br />
          <span className="text-slate-800 font-bold border-b-2 border-rose-200">{email}</span>
        </p>

        {/* مربعات إدخال الرمز */}
        <div className="flex justify-center gap-3 mb-8" dir="ltr">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              disabled={loading}
              className="w-14 h-16 border-2 border-slate-100 rounded-2xl text-center text-2xl font-black text-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all disabled:opacity-50"
              value={data}
              onChange={e => handleChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] mb-6 flex items-center justify-center gap-2"
        >
          {loading ? <FiLoader className="animate-spin text-2xl" /> : "تأكيد الرمز"}
        </button>

        <p className="text-slate-400 text-sm">
          لم يصلك الرمز؟
          <button
            onClick={handleResend}
            className="text-rose-500 font-bold hover:underline mr-1 disabled:opacity-50"
          >
            إعادة إرسال
          </button>
        </p>

        <button
          onClick={() => navigate('/login')}
          className="mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-rose-500 transition-colors mx-auto text-sm"
        >
          العودة لتسجيل الدخول <FiArrowRight className="rotate-180" />
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;