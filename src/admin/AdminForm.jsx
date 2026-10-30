import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Save, 
  Phone,
  CheckSquare,
  Square,
  KeyRound
} from 'lucide-react';

function AdminForm() {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', permissions: []
  });

  const PERMISSIONS = [
    "الاحصائيات العامة", "ادارة الفروع", "سلف الموظفين", "سجلات الفروع", "فواتير الفروع", "سجل الجرد",
    "ادارة الطلبات", "ادارة الطلبات المخصصة",
    "طلبات السبائك", "ادارة المنتجات", "التصنيفات",
    "تقييمات العملاء", "الشحن والتوصيل", "حاسبة الاسعار",
    "قاعدة العملاء", "نظام الكاشير", "فريق العمل"
  ];

  useEffect(() => {
    if (isEditMode) {
      const fetchAdmin = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/admins/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const admin = response.data.data;
          setFormData({
            name: admin.name || admin.fullName || '',
            email: admin.email || '',
            phone: admin.phone || '',
            permissions: admin.permissions || []
          });
        } catch (error) {
          navigate('/admin/admins');
        }
      };
      fetchAdmin();
    }
  }, [id, isEditMode, navigate, token]);

  const handlePermissionChange = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const base = import.meta.env.VITE_API_URL;
    const toastId = toast.loading(isEditMode ? "جاري تحديث بيانات المسؤول..." : "جاري إنشاء حساب المسؤول...");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (isEditMode) {
        await axios.put(`${base}/admin/admins/${id}`, formData, config);
        toast.success('تم تحديث البيانات بنجاح', { id: toastId });
      } else {
        await axios.post(`${base}/admin/admins`, { ...formData, role: 'admin' }, config);
        toast.success('تم إضافة المسؤول وتفعيل الصلاحيات بنجاح', { id: toastId });
      }
      navigate('/admin/admins');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحفظ', { id: toastId });
    }
  };

  const inputClass = `w-full pr-12 pl-4 py-3 rounded-2xl text-sm font-semibold outline-none transition-all ${
    isDarkMode 
      ? 'bg-black/50 border border-white/15 text-white placeholder-silver-500 focus:border-silver-400' 
      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
  }`;
  
  const labelClass = `text-xs font-bold mb-2 block uppercase tracking-wider ${
    isDarkMode ? 'text-silver-300' : 'text-slate-600'
  }`;

  return (
    <div className="space-y-6 font-cairo" dir="rtl">


      {/* Top Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/admin/admins')} 
            className={`p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
              isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-300 hover:text-white' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
            }`}
            title="العودة لقائمة المسؤولين"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {isEditMode ? 'تعديل بيانات وصلاحيات المسؤول' : 'إنشاء حساب إداري جديد'}
            </h2>
            <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
              تحديد أقسام لوحة التحكم المصرح للمستخدم بالوصول إليها
            </p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
            isDarkMode 
              ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
              : 'bg-slate-900 hover:bg-black text-white'
          }`}
        >
          <Save className="w-4 h-4 stroke-[3]" />
          <span>{isEditMode ? 'حفظ التعديلات' : 'اعتماد وإنشاء المسؤول'}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className={`rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-7 ${
          isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}>
          
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>الاسم الكامل للمسؤول</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
                <input 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  className={inputClass} 
                  placeholder="مثال: يوسف أحمد..." 
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>البريد الإلكتروني المهني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
                <input 
                  required 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className={inputClass} 
                  placeholder="admin@elitesilver925.com" 
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
                <input 
                  required 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  className={inputClass} 
                  placeholder="0790000000" 
                  maxLength={14}
                />
              </div>
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className={`space-y-4 pt-5 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <label className={`text-sm font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <KeyRound className="w-5 h-5 text-emerald-500" />
                <span>مصفوفة الصلاحيات وأقسام النظام المصرح بها</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const allSelected = formData.permissions.length === PERMISSIONS.length;
                  setFormData(prev => ({ ...prev, permissions: allSelected ? [] : [...PERMISSIONS] }));
                }}
                className={`text-xs font-bold underline cursor-pointer ${
                  isDarkMode ? 'text-silver-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {formData.permissions.length === PERMISSIONS.length ? 'إلغاء تحديد الكل' : 'تحديد كافة الصلاحيات'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {PERMISSIONS.map((perm) => {
                const isSelected = formData.permissions.includes(perm);
                return (
                  <div 
                    key={perm}
                    onClick={() => handlePermissionChange(perm)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected 
                        ? isDarkMode
                          ? 'bg-silver-400/15 border-silver-400/40 text-white shadow-sm font-bold'
                          : 'bg-slate-100 border-slate-900 text-slate-900 shadow-sm font-bold'
                        : isDarkMode
                          ? 'bg-black/40 border-white/5 text-silver-400 hover:border-white/15 hover:text-silver-200'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">{perm}</span>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4 text-silver-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-3 pt-5 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
            <button 
              type="submit" 
              className={`flex-1 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              <Save className="w-4 h-4 stroke-[3]" />
              <span>{isEditMode ? 'حفظ التعديلات' : 'تفعيل حساب المسؤول'}</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/admin/admins')} 
              className={`px-7 py-3.5 border rounded-2xl font-bold text-sm transition-all text-center cursor-pointer ${
                isDarkMode ? 'border-white/10 text-silver-300 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              إلغاء
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}

export default AdminForm;