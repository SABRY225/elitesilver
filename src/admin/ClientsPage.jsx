import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiRefreshCw, FiUsers, FiSearch, FiMail, FiCalendar, FiUserCheck } from 'react-icons/fi'

function ClientsPage() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const token = localStorage.getItem('token')

    const fetchClients = async () => {
        setLoading(true)
        try {
            const apiBase = import.meta.env.VITE_API_URL
            const response = await axios.get(`${apiBase}/admin/users`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' }
            })
            setClients(response.data)
        } catch (error) {
            toast.error('فشل في تحميل بيانات العملاء')
            setClients([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    // تصفية العملاء بناءً على البحث
    const filteredClients = clients.filter(client => 
        (client.name || client.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.email || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <FiRefreshCw className="animate-spin text-4xl text-rose-500" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">جاري جلب قاعدة البيانات...</p>
            </div>
        )
    }

    
    return (
        <div className="p-4 md:p-8 font-['Tajawal'] text-right space-y-8" dir="rtl">
            
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-500 rounded-lg text-white">
                            <FiUsers size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">قاعدة العملاء</h3>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">إدارة بيانات المشترين المسجلين في المتجر</p>
                </div>

                <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-80 group">
                        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="ابحث بالاسم أو البريد..." 
                            className="w-full pr-11 pl-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-rose-500/5 transition-all text-sm font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {clients.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">لا يوجد عملاء مسجلين حالياً</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-center">العميل</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">معلومات الاتصال</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">تاريخ الانضمام</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClients.map((client, index) => (
                                    <tr key={client.id || client._id || index} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm group-hover:from-rose-500 group-hover:to-rose-600 group-hover:text-white transition-all duration-300">
                                                    {(client.name || client.fullName || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-base leading-none">
                                                        {client.name || client.fullName || client.username || 'غير معروف'}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">ID: #{ (client.id || client._id || '00')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                <FiMail className="text-slate-300" />
                                                <span className="text-sm">{client.email || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                                <FiCalendar className="text-slate-300" />
                                                {client.createdAt ? new Date(client.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                نشط
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ClientsPage