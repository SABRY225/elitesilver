import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Building2, 
  Calendar, 
  Printer, 
  Search, 
  Eye, 
  X, 
  RefreshCw,
  Coins,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import InvoiceDocument from '../../branch/InvoiceDocument';

function AdminBranchInvoices() {
  const token = localStorage.getItem('token');
  const [invoices, setInvoices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // فلاتر البحث
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ترقيم الصفحات Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // الفاتورة المختارة للعرض والطباعة
  const [activeInvoice, setActiveInvoice] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resBranches, resInvoices] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/branches`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/invoices?branchId=${selectedBranch}&date=${selectedDate}&search=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resBranches.data.success) {
        setBranches(resBranches.data.data || []);
      }
      if (resInvoices.data.success) {
        setInvoices(resInvoices.data.data || []);
      }
    } catch (error) {
      toast.error('فشل في جلب فواتير الفروع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [selectedBranch, selectedDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadData();
  };

  // حسابات الترقيم
  const totalItems = invoices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = invoices.slice(startIndex, startIndex + itemsPerPage);

  // دالة عرض شريط الترقيم
  const renderPagination = (currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, unitLabel = "فاتورة") => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border border-slate-200 bg-white shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              فواتير الفروع ونقاط البيع
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              استعراض والبحث في فواتير جميع الفروع مع إمكانية عرض وطباعة الفاتورة الأصلية
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث الفواتير</span>
        </button>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
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
          <label className="text-xs font-bold text-slate-600 block mb-1">تصفية بالتاريخ</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">بحث برقم الفاتورة / العميل / الهاتف</label>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              placeholder="0506 أو اسم العميل..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none pl-8"
            />
            <button type="submit" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedBranch('');
              setSelectedDate('');
              setSearchQuery('');
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      </div>

      {/* جدول الفواتير */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono text-sm">
            جاري تحميل فواتير الفروع...
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
            <p className="font-bold text-slate-700">لا توجد فواتير مطابقة لبحثك</p>
            <p className="text-xs">يتم تسجيل الفواتير آلياً عبر بوابات موظفي الفروع</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                    <th className="p-3.5">الرقم التسلسلي</th>
                    <th className="p-3.5">الفرع الصادر منه</th>
                    <th className="p-3.5">التاريخ</th>
                    <th className="p-3.5">نوع الدفع</th>
                    <th className="p-3.5">اسم المشتري</th>
                    <th className="p-3.5">رقم الهاتف</th>
                    <th className="p-3.5">الموظف</th>
                    <th className="p-3.5">المجموع</th>
                    <th className="p-3.5">الخصم</th>
                    <th className="p-3.5">الإجمالي الصافي</th>
                    <th className="p-3.5 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-black text-rose-600 text-sm">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {inv.branch?.name || `فرع #${inv.branchId}`}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{inv.date}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.paymentType === 'نقدي' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inv.paymentType}
                        </span>
                      </td>
                      <td className="p-3.5 font-black text-slate-900">{inv.customerName || 'عميل نقدي'}</td>
                      <td className="p-3.5 font-mono">{inv.customerPhone || '—'}</td>
                      <td className="p-3.5 font-medium text-slate-600">{inv.employeeName || inv.employee?.name || '—'}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-700">{inv.subtotal} د.أ</td>
                      <td className="p-3.5 font-mono text-slate-500">{inv.discount} د.أ</td>
                      <td className="p-3.5 font-mono font-black text-slate-950 text-sm">{inv.total} د.أ</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setActiveInvoice(inv)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 mx-auto shadow"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة وطباعة</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, "فاتورة")}
          </>
        )}
      </div>

      {/* نافذة عرض وطباعة الفاتورة الورقية المطابقة للأصل */}
      {activeInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className="bg-white rounded-3xl w-full max-w-[950px] p-6 shadow-2xl relative my-6">
            
            {/* شريط الإغلاق والطباعة العلوي */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-slate-900">
                  معاينة الفاتورة رقم #{activeInvoice.invoiceNumber}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {activeInvoice.branch?.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الفاتورة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ورقة الفاتورة الرسمية مطابقة 100% للتصميم الورقي */}
            <InvoiceDocument
              invoiceData={activeInvoice}
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
          #invoice-paper, #invoice-paper * {
            visibility: visible;
          }
          #invoice-paper {
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

export default AdminBranchInvoices;
