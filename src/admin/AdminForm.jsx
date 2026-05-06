import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiUser, FiMail, FiLock, FiShield, 
  FiCheckCircle, FiArrowRight, FiSave, 
  FiPhone
} from 'react-icons/fi';

function AdminForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '', email: '',phone:'',  permissions: []
  });

  const PERMISSIONS = [
    "الاحصائيات العامة", "ادارة الطلبات", "ادارة الطلبات المخصصة",
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
          localStorage.setItem("adminActiveTab", "admins");
          navigate('/admin');
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
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (isEditMode) {
        await axios.put(`${base}/admin/admins/${id}`, formData, config);
        toast.success('تم تحديث البيانات بنجاح');
      } else {
        await axios.post(`${base}/admin/admins`, { ...formData, role: 'admin' }, config);
        toast.success('تم إضافة المسؤول بنجاح');
      }
      localStorage.setItem("adminActiveTab", "admins");
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  const inputClass = "w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 shadow-sm";

  return (
    <div className="p-6 md:p-10 font-['Tajawal'] bg-[#F8FAFC] min-h-screen" dir="rtl">
        <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-4xl mx-auto">
        <button onClick={() => {navigate('/admin'); localStorage.setItem("adminActiveTab", "admins");}} className="flex items-center gap-2 text-slate-500 hover:text-rose-600 mb-8 font-bold transition-colors">
          <FiArrowRight /> العودة لقائمة المسؤولين
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <FiShield className="text-rose-500" />
              {isEditMode ? 'تعديل صلاحيات المسؤول' : 'إنشاء حساب مسؤول جديد'}
            </h2>
            <p className="text-slate-400 text-sm mt-2">قم بتعبئة البيانات وتحديد الصلاحيات المطلوبة بدقة</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">الاسم الكامل</label>
                <div className="relative">
                  <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="أدخل اسم المسؤول" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">البريد الإلكتروني</label>
                <div className="relative">
                  <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="email@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">رقم الهاتف</label>
                <div className="relative">
                  <FiPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="962755845578"  maxLength={11}/>
                </div>
              </div>

            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-slate-800 flex items-center gap-2">
                <FiShield className="text-rose-500" /> تحديد صلاحيات الوصول
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PERMISSIONS.map((perm) => {
                  const isSelected = formData.permissions.includes(perm);
                  return (
                    <div 
                      key={perm}
                      onClick={() => handlePermissionChange(perm)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected 
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-md shadow-rose-100' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black">{perm}</span>
                      {isSelected && <FiCheckCircle className="text-rose-500" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-[2] bg-rose-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2">
                <FiSave size={20} /> {isEditMode ? 'حفظ التعديلات' : 'إنشاء المسؤول'}
              </button>
              <button type="button" onClick={() => {navigate('/admin'); localStorage.setItem("adminActiveTab", "admins");}} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminForm;