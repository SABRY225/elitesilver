import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiEdit2, FiTrash2, FiPlus, FiX, FiActivity,
  FiMail, FiUser, FiShield, FiCheckCircle, FiLock
} from 'react-icons/fi';

function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', permissions: [] });

  const token = localStorage.getItem('token');
  const PERMISSIONS = [
    "الاحصائيات العامة", "ادارة الطلبات", "ادارة الطلبات المخصصة",
    "طلبات السبائك", "ادارة المنتجات", "التصنيفات",
    "تقييمات العملاء", "الشحن والتوصيل", "حاسبة الاسعار",
    "قاعدة العملاء", "نظام الكاشير", "فريق العمل"
  ];

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${base}/admin/admins`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const arr = Array.isArray(response.data) ? response.data : [];
      setAdmins(arr);
    } catch (error) {
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const openModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name || admin.fullName || '',
        email: admin.email || '',
        password: '', // نترك كلمة السر فارغة عند التعديل إلا لو أراد تغييرها
        permissions: admin.permissions || []
      });
    } else {
      setEditingAdmin(null);
      setFormData({ name: '', email: '', password: '', permissions: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handlePermissionChange = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const base = import.meta.env.VITE_API_URL;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingAdmin) {
        await axios.put(`${base}/admin/admins/${editingAdmin.id || editingAdmin._id}`, formData, config);
        toast.success('تم تحديث البيانات');
      } else {
        await axios.post(`${base}/admin/admins`, { ...formData, role: 'admin' }, config);
        toast.success('تم إضافة المسؤول بنجاح');
      }
      closeModal();
      loadAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ ما');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المسؤول؟')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم الحذف بنجاح');
      loadAdmins();
    } catch (error) {
      toast.error('فشل في عملية الحذف');
    }
  };

  // Styles
  const inputClass = "w-full pr-12 pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-800 placeholder:text-slate-400";

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <FiActivity className="animate-spin text-4xl text-rose-500" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">جاري التحميل...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 font-['Tajawal']" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <FiShield className="text-rose-600" /> إدارة الصلاحيات
          </h3>
          <p className="text-slate-500 mt-2">تحكم في وصول الموظفين والمسؤولين للنظام</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-slate-950 text-white px-6 py-4 rounded-2xl hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg active:scale-95 text-sm font-bold"
        >
          <FiPlus size={20} /> إضافة مسؤول جديد
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div key={admin.id || admin._id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 text-xl font-black group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  {admin.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 className="font-black text-slate-800">{admin.name || 'مستخدم'}</h4>
                  <span className="text-xs text-rose-500 font-bold">مسؤول نظام</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(admin)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={18} /></button>
                <button onClick={() => handleDelete(admin.id || admin._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><FiTrash2 size={18} /></button>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl text-sm">
              <FiMail /> <span className="truncate">{admin.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500"><FiShield size={24} /></div>
                <h3 className="text-xl font-black text-slate-900">{editingAdmin ? 'تعديل بيانات المسؤول' : 'إضافة مسؤول جديد'}</h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-rose-500"><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
                
                {/* Inputs */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <FiUser className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required placeholder="الاسم الكامل" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
                  </div>
                  <div className="relative">
                    <FiMail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="email" placeholder="البريد الإلكتروني" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                  </div>
                </div>

                {/* Permissions Selection */}
                <div className="mt-6">
                  <label className="text-sm font-black text-slate-700 mb-3 block">تحديد الصلاحيات الوصول:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map((perm) => {
                      const isSelected = formData.permissions.includes(perm);
                      return (
                        <div 
                          key={perm}
                          onClick={() => handlePermissionChange(perm)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                            ? 'bg-rose-50 border-rose-200 text-rose-700' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold">{perm}</span>
                          {isSelected && <FiCheckCircle className="text-rose-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button type="submit" className="flex-[2] bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95">
                  {editingAdmin ? 'حفظ التعديلات' : 'إنشاء الحساب الآن'}
                </button>
                <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminsPage;