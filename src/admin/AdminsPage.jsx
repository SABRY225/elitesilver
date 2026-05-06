import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  FiEdit2, FiTrash2, FiPlus, FiActivity, 
  FiMail, FiShield 
} from 'react-icons/fi';

function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <FiActivity className="animate-spin text-4xl text-rose-500" />
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">جاري التحميل...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 font-['Tajawal']" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h3 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <FiShield className="text-rose-600" /> إدارة الصلاحيات
          </h3>
          <p className="text-slate-500 mt-2">تحكم في وصول الموظفين والمسؤولين للنظام</p>
        </div>
        <button
          onClick={() => navigate('./employees/add')}
          className="bg-slate-950 text-white px-6 py-4 rounded-2xl hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg active:scale-95 text-sm font-bold"
        >
          <FiPlus size={20} /> إضافة مسؤول جديد
        </button>
      </div>

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
                <button onClick={() => navigate(`./employees/edit/${admin.id || admin._id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={18} /></button>
                <button onClick={() => handleDelete(admin.id || admin._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><FiTrash2 size={18} /></button>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-xl text-sm">
              <FiMail /> <span className="truncate">{admin.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminsPage;