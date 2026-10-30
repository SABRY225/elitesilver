import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import imgLogo from '../images/logo.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPromise = axios.post(`${import.meta.env.VITE_API_URL}/auth/login-request`, { email });

    toast.promise(
      loginPromise,
      {
        loading: 'جاري إرسال رمز التحقق الآمن...',
        success: (res) => {
          localStorage.setItem('temp_email', email);
          setTimeout(() => navigate('/verify-email'), 1200);
          return 'تم إرسال رمز الدخول بنجاح! يرجى مراجعة بريدك الإلكتروني ✨';
        },
        error: (err) => {
          setLoading(false);
          return err.response?.data?.error || 'عذراً، فشل إرسال رمز التحقق. تحقق من البريد وحاول ثانية ❌';
        },
      },
      {
        style: {
          borderRadius: '16px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          color: '#0f172a',
          fontFamily: 'Cairo, sans-serif',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        },
        success: {
          iconTheme: { primary: '#10b981', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
        },
      }
    );

    try {
      await loginPromise;
    } catch (error) {
      // Handled in toast.promise
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 font-cairo relative overflow-hidden selection:bg-slate-200 selection:text-slate-900"
      dir="rtl"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 shadow-xl shadow-slate-300/40 text-center">
        {/* Elite Logo Badge */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-200 p-3 shadow-sm flex items-center justify-center">
            <img src={imgLogo} alt="Elite Silver 925" className="w-full h-full object-contain" />
          </div>
          <span className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        {/* Header Title */}
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-slate-100 border border-slate-200 text-slate-700 inline-block mb-3">
            Elite Silver Atelier • لوحة التحكم
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            تسجيل دخول الإدارة
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed font-semibold">
            أدخل بريدك الإلكتروني المعتمد لاستلام رمز الدخول الآمن بخطوتين (OTP)
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group text-right">
            <label className="text-[11px] font-bold text-slate-600 block mb-1.5 mr-1 uppercase tracking-wider">
              البريد الإلكتروني المهني
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
              <input
                required
                type="email"
                placeholder="admin@elitesilver925.com"
                className="w-full pr-11 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-slate-400 focus:bg-white transition-all text-left font-mono font-bold"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-wider uppercase transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <span>إرسال رمز التحقق</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Assurance Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>بوابة دخول مشفرة ومؤمنة بنظام 256-bit SSL • إيليت سيلفر 925</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;