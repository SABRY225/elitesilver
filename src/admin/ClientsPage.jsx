import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  User
} from 'lucide-react';

function ClientsPage() {
  let outletContext = {};
  try {
    outletContext = useOutletContext() || {};
  } catch (e) {
    outletContext = {};
  }

  const isDarkMode = outletContext.isDarkMode !== undefined ? outletContext.isDarkMode : false;

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  const fetchClients = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiBase}/admin/users`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setClients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('فشل في تحميل بيانات العملاء');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => 
    (client.name || client.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] gap-3 font-cairo">
        <div className="w-10 h-10 border-2 border-silver-300 border-t-transparent rounded-full animate-spin" />
        <span className="text-silver-400 text-sm font-mono tracking-widest uppercase">جاري جلب قاعدة عملاء النخبة...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      
      {/* Header & Search */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
            isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-300' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <Users className="w-6 h-6 text-silver-200" />
          </div>
          <div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              قاعدة بيانات العملاء والمشترين
            </h2>
            <p className={`text-sm mt-0.5 font-medium ${isDarkMode ? 'text-silver-400' : 'text-slate-500'}`}>
              إجمالي الحسابات المسجلة: <span className="font-mono font-bold text-base">{clients.length}</span> عميل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو البريد..." 
              className={`w-full pr-10 pl-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all ${
                isDarkMode 
                  ? 'bg-black/50 border border-white/15 text-white placeholder-silver-500 focus:border-silver-400' 
                  : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 shadow-sm'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={fetchClients}
            className={`p-3 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
              isDarkMode 
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-silver-300 hover:text-white' 
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
            }`}
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl transition-colors ${
        isDarkMode ? 'bg-[#0c0d12]/90 border-white/10' : 'bg-white border-slate-200'
      }`}>
        {clients.length === 0 ? (
          <div className="p-16 text-center text-silver-400 text-base font-bold">
            لا يوجد عملاء مسجلين حالياً في المنصة
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className={`border-b text-sm font-black uppercase tracking-wider ${
                  isDarkMode ? 'border-white/10 bg-white/[0.02] text-silver-400' : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}>
                  <th className="p-4 sm:p-5">العميل</th>
                  <th className="p-4 sm:p-5">البريد الإلكتروني</th>
                  <th className="p-4 sm:p-5">تاريخ الانضمام</th>
                  <th className="p-4 sm:p-5 text-center">حالة الحساب</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
                {filteredClients.map((client, index) => (
                  <tr key={client.id || client._id || index} className={`transition-colors ${
                    isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/80'
                  }`}>
                    
                    {/* Customer Name */}
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black text-sm ${
                          isDarkMode ? 'bg-silver-400/10 border-silver-400/20 text-silver-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}>
                          {(client.name || client.fullName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`font-bold text-base leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {client.name || client.fullName || client.username || 'عميل نخبة'}
                          </p>
                          <p className="text-xs text-silver-400 font-mono mt-0.5">
                            UID: #{client.id || client._id || '00'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4 sm:p-5">
                      <div className={`flex items-center gap-2 text-sm font-mono ${isDarkMode ? 'text-silver-300' : 'text-slate-700'}`} dir="ltr">
                        <Mail className="w-4 h-4 text-silver-400" />
                        <span>{client.email || '—'}</span>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="p-4 sm:p-5">
                      <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-silver-400' : 'text-slate-600'}`}>
                        <Calendar className="w-4 h-4 text-silver-400" />
                        <span>
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 sm:p-5 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 px-3 py-1.5 rounded-full text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>نشط ومفعل</span>
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default ClientsPage;