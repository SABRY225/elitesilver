import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Mail, 
  Phone,
  RefreshCw,
  KeyRound
} from 'lucide-react';

function AdminsPage() {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('فشل في تحميل مسؤولي النظام');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadAdmins(); 
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من سحب صلاحيات وحذف المسؤول "${name || ''}"؟`)) return;
    const toastId = toast.loading('جاري حذف المسؤول...');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم حذف المسؤول بنجاح', { id: toastId });
      loadAdmins();
    } catch (error) {
      toast.error('فشل في عملية الحذف', { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3 font-cairo">
        <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-silver-400 text-sm font-mono tracking-widest uppercase">جاري تحميل سجل مسؤولي النظام...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
            isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <KeyRound className="w-6 h-6 text-silver-200" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              إدارة فريق العمل والصلاحيات الإدارية
            </h2>
            <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
              تعيين موظفي البوتيك والمشرفين وتحديد صلاحيات كل قسم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadAdmins}
            className={`p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
              isDarkMode 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-300 hover:text-white' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
            }`}
            title="تحديث القائمة"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/admin/employees/add')}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isDarkMode 
                ? 'bg-gradient-to-r from-silver-300 via-silver-200 to-silver-400 hover:brightness-110 text-black' 
                : 'bg-slate-900 hover:bg-black text-white'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة مسؤول جديد</span>
          </button>
        </div>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {admins.map((admin) => (
          <div 
            key={admin.id || admin._id} 
            className={`rounded-3xl border p-5 sm:p-6 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 ${
              isDarkMode 
                ? 'bg-[#0c0d12]/90 border-white/10 hover:border-white/20' 
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-slate-200/50'
            }`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-lg ${
                  isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}>
                  {admin.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h4 className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {admin.name || 'مسؤول'}
                  </h4>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مسؤول نظام مصرح</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => navigate(`/admin/employees/edit/${admin.id || admin._id}`)} 
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDarkMode 
                      ? 'text-silver-300 hover:text-white hover:bg-white/10 border-white/10' 
                      : 'text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                  title="تعديل الصلاحيات"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(admin.id || admin._id, admin.name)} 
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDarkMode 
                      ? 'text-silver-400 hover:text-rose-400 hover:bg-rose-500/10 border-white/10' 
                      : 'text-rose-600 hover:bg-rose-50 border-slate-200'
                  }`}
                  title="حذف المسؤول"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`space-y-2 p-3.5 rounded-2xl border text-sm font-medium ${
              isDarkMode ? 'bg-black/40 border-white/5 text-silver-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2.5 truncate font-mono">
                <Mail className="w-4 h-4 text-silver-400 flex-shrink-0" />
                <span className="truncate">{admin.email}</span>
              </div>
              {admin.phone && (
                <div className="flex items-center gap-2.5 text-xs font-mono" dir="ltr">
                  <Phone className="w-4 h-4 text-silver-400 flex-shrink-0" />
                  <span>{admin.phone}</span>
                </div>
              )}
            </div>

            {/* Permissions count */}
            <div className={`text-xs flex items-center justify-between pt-2 border-t ${
              isDarkMode ? 'border-white/5 text-silver-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span className="font-bold">الصلاحيات الممنوحة:</span>
              <span className="font-mono font-bold text-sm">
                {Array.isArray(admin.permissions) ? `${admin.permissions.length} قسم` : 'كامل الصلاحيات'}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminsPage;