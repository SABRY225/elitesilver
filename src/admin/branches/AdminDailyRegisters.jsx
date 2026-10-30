import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Building2, 
  Calendar, 
  Printer, 
  Search, 
  Eye, 
  X, 
  RefreshCw,
  Coins,
  DollarSign,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import DailySheetDocument from '../../branch/DailySheetDocument';

function AdminDailyRegisters() {
  const token = localStorage.getItem('token');
  const [registers, setRegisters] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // الفلاتر
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // ترقيم الصفحات Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // السجل المختار للعرض والطباعة
  const [activeRegister, setActiveRegister] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resBranches, resRegisters] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/branches`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/daily-registers?branchId=${selectedBranch}&date=${selectedDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resBranches.data.success) {
        setBranches(resBranches.data.data || []);
      }
      if (resRegisters.data.success) {
        setRegisters(resRegisters.data.data || []);
      }
    } catch (error) {
      toast.error('فشل في جلب السجلات اليومية للفروع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [selectedBranch, selectedDate]);

  const handlePrint = () => {
    window.print();
  };

  // حسابات الترقيم
  const totalItems = registers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegisters = registers.slice(startIndex, startIndex + itemsPerPage);

  // دالة عرض شريط الترقيم
  const renderPagination = (currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, unitLabel = "سجل") => {
    if (totalItems <= 0) return null;
    const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
        <div className="flex flex-wrap items-center gap-3 text-slate-500 font-medium">
          <span>
            عرض <strong className="text-slate-900 font-mono">{startItem}</strong> إلى <strong className="text-slate-900 font-mono">{endItem}</strong> من إجمالي <strong className="text-slate-900 font-mono">{totalItems}</strong> {unitLabel}
          </span>
          <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
            <span>لكل صفحة:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold text-slate-800 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((p, idx) => (
              p === '...' ? (
                <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 font-mono">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`min-w-[32px] h-8 rounded-xl font-mono text-xs font-bold transition-all ${
                    currentPage === p
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              )
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border border-slate-200 bg-white shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              سجلات الفروع اليومية
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              استعراض ومراجعة وطباعة الدفتر اليومي ومطابقة مبيعات ومصاريف كل فرع
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث السجلات</span>
        </button>
      </div>

      {/* شريط التصفية والبحث */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">تصفية حسب الفرع</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="">جميع الفروع ({branches.length})</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">تصفية حسب التاريخ</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedBranch('');
              setSelectedDate('');
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200"
          >
            إلغاء التصفية
          </button>
        </div>
      </div>

      {/* جدول السجلات */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono text-sm">
            جاري تحميل السجلات اليومية...
          </div>
        ) : registers.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
            <p className="font-bold text-slate-700">لا توجد سجلات يومية مسجلة وفق الفلتر المحدد</p>
            <p className="text-xs">يقوم موظفو الفروع بحفظ واعتماد سجلاتهم اليومية من خلال بواباتهم الخاصة</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                    <th className="p-3.5">الفرع</th>
                    <th className="p-3.5">التاريخ / اليوم</th>
                    <th className="p-3.5">الموظف المسؤول</th>
                    <th className="p-3.5">مجموع الجرامات</th>
                    <th className="p-3.5">إجمالي المبيعات</th>
                    <th className="p-3.5">إجمالي المصاريف</th>
                    <th className="p-3.5">مبيعات الفيزا</th>
                    <th className="p-3.5">صافي اليوم</th>
                    <th className="p-3.5 text-center">حالة السجل</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRegisters.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-black text-slate-900">
                        {reg.branch?.name || `فرع #${reg.branchId}`}
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{reg.dayName || '—'}</span>
                          <span className="font-mono text-[11px] text-slate-400">{reg.date}</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">
                        {reg.employeeName || reg.employee?.name || '—'}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">
                        {reg.totalGrams} غرام
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">
                        {reg.totalSales} د.أ
                      </td>
                      <td className="p-3.5 font-mono font-bold text-rose-700">
                        {reg.totalExpenses} د.أ
                      </td>
                      <td className="p-3.5 font-mono font-bold text-indigo-700">
                        {reg.totalVisaSales} د.أ
                      </td>
                      <td className="p-3.5 font-mono font-black text-slate-950 text-sm">
                        {reg.netTotal} د.أ
                      </td>
                      <td className="p-3.5 text-center">
                        {reg.status === 'مغلق' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            🔒 مغلق (مرسل للإدارة)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            ⏳ مفتوح / قيد العمل
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setActiveRegister(reg)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 mx-auto shadow"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>عرض وطباعة السجل</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, "سجل يومي")}
          </>
        )}
      </div>

      {/* نافذة عرض وطباعة السجل الورقي المطابق للأصل */}
      {activeRegister && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className="bg-white rounded-3xl w-full max-w-[950px] p-6 shadow-2xl relative my-6">
            
            {/* شريط الإغلاق والطباعة العلوي */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900">
                  معاينة السجل اليومي لـ {activeRegister.branch?.name}
                </span>
                <span className="font-mono text-xs text-slate-500">({activeRegister.date})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة فورية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRegister(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ورقة السجل اليومي مطابقة 100% للتصميم الورقي */}
            <DailySheetDocument
              registerData={activeRegister}
              readOnly={true}
              onPrint={handlePrint}
            />
          </div>
        </div>
      )}

      {/* تنسيق الطباعة */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #daily-sheet-paper, #daily-sheet-paper * {
            visibility: visible;
          }
          #daily-sheet-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDailyRegisters;
