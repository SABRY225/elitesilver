import React, { useState } from 'react';
import { Store, User, Lock, ArrowLeft, Loader2, Sparkles, Building2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function BranchLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return toast.error('يرجى كتابة اسم المستخدم وكلمة المرور');
    }

    setLoading(true);
    const toastId = toast.loading('جاري التحقق من بيانات موظف الفرع...');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/branches/employee/login`, {
        username,
        password
      });

      if (response.data.success) {
        localStorage.setItem('branch_token', response.data.token);
        localStorage.setItem('branch_employee', JSON.stringify(response.data.employee));
        localStorage.setItem('branch_info', JSON.stringify(response.data.branch));
        if (response.data.attendance) {
          localStorage.setItem('branch_attendance', JSON.stringify(response.data.attendance));
        }

        const checkInMsg = response.data.attendance?.checkInTime 
          ? ` • تم تسجيل حضورك اليوم (${response.data.attendance.checkInTime})` 
          : '';
        toast.success(`مرحباً بك مجدداً ${response.data.employee.name} في ${response.data.branch.name}${checkInMsg}`, { id: toastId });
        navigate('/branch-portal');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل تسجيل الدخول، تحقق من اسم المستخدم وكلمة المرور', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 font-cairo relative overflow-hidden text-right selection:bg-slate-200 selection:text-slate-900"
      dir="rtl"
    >
      {/* خلفية ضوئية ناعمة */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/50 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-100/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-10 shadow-xl shadow-slate-300/40 text-center">
        {/* الترويسة */}
        <div className="mb-8">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] bg-slate-100 border border-slate-200 text-slate-700 inline-block mb-3">
            Elite Silver Atelier 925
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            بوابة موظفي الفروع
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed font-semibold">
            تسجيل الدخول لإصدار الفواتير الرسمية وإدارة السجل اليومي للفرع
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group text-right">
            <label className="text-[11px] font-bold text-slate-600 block mb-1.5 mr-1 uppercase tracking-wider">
              اسم المستخدم
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم الخاص بك..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-mono font-bold"
              />
              <User className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-slate-700 transition-colors" />
            </div>
          </div>

          <div className="relative group text-right">
            <label className="text-[11px] font-bold text-slate-600 block mb-1.5 mr-1 uppercase tracking-wider">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pr-11 pl-4 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-all font-mono font-bold"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-slate-700 transition-colors" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm transition-all duration-300 shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>جاري الدخول إلى الفرع...</span>
              </>
            ) : (
              <>
                <span>دخول إلى نظام الفرع</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            يتم إنشاء حسابات موظفي الفروع وصلاحياتها مركزياً بواسطة الإدارة العامة.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BranchLogin;
