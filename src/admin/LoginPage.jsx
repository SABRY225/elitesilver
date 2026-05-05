import React, { useState } from 'react';
import { FiMail, FiArrowLeft, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import imgLogo from '../images/logo.png'
function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // إنشاء "وعد" (Promise) لربط الإشعار بحالة الطلب
    const loginPromise = axios.post(`${import.meta.env.VITE_API_URL}/auth/login-request`, { email });

    toast.promise(loginPromise, {
      loading: 'جاري إرسال الرمز...',
      success: (res) => {
        localStorage.setItem('temp_email', email);
        setTimeout(() => navigate('/verify-email'), 1500); // تأخير بسيط ليرى المستخدم النجاح
        return 'تم إرسال الرمز بنجاح! افحص بريدك 🌸';
      },
      error: (err) => {
        setLoading(false);
        return err.response?.data?.error || 'عذراً، فشل إرسال الرمز ❌';
      },
    }, {
      style: {
        borderRadius: '15px',
        background: '#333',
        color: '#fff',
        fontFamily: 'Tajawal',
      },
      success: {
        duration: 3000,
        iconTheme: { primary: '#f43f5e', secondary: '#fff' },
      },
    });

    try {
      await loginPromise;
    } catch (error) {
      // الأخطاء يتم التعامل معها داخل toast.promise
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf9] flex items-center justify-center p-6 font-['Tajawal']" dir="rtl">
      {/* مكون الإشعارات يجب أن يوضع هنا مرة واحدة */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-rose-100/50 p-10 border border-rose-50/50">
        
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#333] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-border-dark rotate-12 transition-transform hover:rotate-0 duration-500">
              <img src={imgLogo} alt={imgLogo} width={350} height={350} />
          </div>
          <h1 className="mt-6 text-2xl font-black text-slate-800">تسجيل الدخول</h1>
          <p className="text-slate-500 mt-2 text-sm">أدخل بريدك الإلكتروني لنرسل لك رمز التحقق</p>
        </div>

        {/* نموذج البريد الإلكتروني */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
            <input 
              required
              type="email" 
              placeholder="example@gmail.com"
              className="w-full pr-12 pl-4 py-4 bg-slate-50 border border-border-dark rounded-2xl outline-none focus:border-border-dark focus:bg-white focus:ring-4 focus:ring-rose-50 transition-all text-left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-surface-card transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-rose-200"
          >
            {loading ? (
              <FiLoader className="animate-spin text-2xl" />
            ) : (
              <>
                إرسال الرمز
                <FiArrowLeft className="mt-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed px-4">
          بالاستمرار، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بمتجر لمسة خاصة.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;