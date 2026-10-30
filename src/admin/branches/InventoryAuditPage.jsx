import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ClipboardCheck, 
  Building2, 
  Plus, 
  Trash2, 
  Eye, 
  Printer, 
  Calendar, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

function InventoryAuditPage() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [audits, setAudits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('');

  // ترقيم الصفحات Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // نافذة جرد جديد
  const [newAuditModalOpen, setNewAuditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // السجل المختار للعرض والطباعة
  const [viewingAudit, setViewingAudit] = useState(null);

  // نموذج الجرد الجديد
  const defaultAuditItems = [
    { id: 1, category: 'خواتم فضة رجالي 925', description: 'تشكيلة خواتم متنوعة بحجر وبدون', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' },
    { id: 2, category: 'خواتم فضة نسائي 925', description: 'خواتم وسوليتيرات ناعمة', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' },
    { id: 3, category: 'سلاسل وأطواق 925', description: 'سلاسل عيار 925 إيطالي ومحلي', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' },
    { id: 4, category: 'أساور وحلقان 925', description: 'أساور جلد وفضة وحلق', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' },
    { id: 5, category: 'سبائك فضة نقية 999', description: 'سبائك استثمارية أونصات وكيلوات', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' },
    { id: 6, category: 'فضة كسر ومستعملة', description: 'كسر فضة مستلمة من العملاء', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' },
  ];

  const [auditForm, setAuditForm] = useState({
    branchId: '',
    auditTitle: '',
    auditDate: new Date().toISOString().split('T')[0],
    items: defaultAuditItems,
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resBranches, resAudits] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/branches`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/inventory-audits?branchId=${selectedBranch}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resBranches.data.success) {
        setBranches(resBranches.data.data || []);
      }
      if (resAudits.data.success) {
        setAudits(resAudits.data.data || []);
      }
    } catch (error) {
      toast.error('فشل في جلب سجلات الجرد');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [selectedBranch]);

  // حسابات الترقيم
  const totalItems = audits.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAudits = audits.slice(startIndex, startIndex + itemsPerPage);

  // دالة عرض شريط الترقيم
  const renderPagination = (currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, unitLabel = "سجل جرد") => {
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

  // تحديث سطر في جدول الجرد
  const handleItemChange = (index, field, value) => {
    const updated = [...auditForm.items];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setAuditForm({ ...auditForm, items: updated });
  };

  const addAuditRow = () => {
    setAuditForm({
      ...auditForm,
      items: [
        ...auditForm.items,
        { id: Date.now(), category: '', description: '', systemWeight: '', actualWeight: '', systemCount: '', actualCount: '', notes: '' }
      ]
    });
  };

  // احتساب المجاميع وفروقات الأوزان
  const calculateTotals = (items) => {
    let totSysWeight = 0;
    let totActWeight = 0;
    let totSysCount = 0;
    let totActCount = 0;

    items.forEach(it => {
      totSysWeight += parseFloat(it.systemWeight) || 0;
      totActWeight += parseFloat(it.actualWeight) || 0;
      totSysCount += parseInt(it.systemCount) || 0;
      totActCount += parseInt(it.actualCount) || 0;
    });

    const weightDiff = (totActWeight - totSysWeight).toFixed(3);
    const countDiff = totActCount - totSysCount;

    let status = 'مطابق';
    if (parseFloat(weightDiff) < -0.05) {
      status = 'يوجد عجز';
    } else if (parseFloat(weightDiff) > 0.05) {
      status = 'يوجد فائض';
    }

    return {
      totSysWeight: totSysWeight.toFixed(3),
      totActWeight: totActWeight.toFixed(3),
      weightDiff,
      totSysCount,
      totActCount,
      countDiff,
      status
    };
  };

  const totals = calculateTotals(auditForm.items);

  // حفظ الجرد
  const handleSaveAudit = async (e) => {
    e.preventDefault();
    if (!auditForm.branchId) {
      return toast.error('يرجى اختيار الفرع المراد جرده');
    }
    if (!auditForm.auditTitle.trim()) {
      return toast.error('يرجى كتابة عنوان أو فترة الجرد');
    }

    setSaving(true);
    const toastId = toast.loading('جاري حفظ واعتماد سجل الجرد...');
    try {
      const payload = {
        branchId: auditForm.branchId,
        auditTitle: auditForm.auditTitle,
        auditDate: auditForm.auditDate,
        items: auditForm.items,
        totalSystemWeight: totals.totSysWeight,
        totalActualWeight: totals.totActWeight,
        totalWeightDiff: totals.weightDiff,
        totalSystemCount: totals.totSysCount,
        totalActualCount: totals.totActCount,
        overallStatus: totals.status,
        notes: auditForm.notes
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/admin/inventory-audits`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success('تم تسجيل عملية الجرد واعتمادها بنجاح!', { id: toastId });
        setNewAuditModalOpen(false);
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حفظ سجل الجرد', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAudit = async (id, title) => {
    if (!window.confirm(`هل أنت متأكد من حذف سجل الجرد "${title}"؟`)) return;
    const toastId = toast.loading('جاري الحذف...');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/branches/admin/inventory-audits/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم حذف السجل بنجاح', { id: toastId });
      loadData();
    } catch (error) {
      toast.error('فشل في حذف السجل', { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border border-slate-200 bg-white shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                سجل الجرد الدوري للفروع
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                خاص بالإدارة فقط
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              إجراء عمليات الجرد الفعلي للمصوغات، ومقارنة أوزان وقطع النظام بالمخزون الفعلي
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (branches.length === 0) {
              return toast.error('يرجى إنشاء فرع واحد على الأقل أولاً');
            }
            setAuditForm({
              branchId: branches[0]?.id || '',
              auditTitle: `جرد دوري - شهر ${new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}`,
              auditDate: new Date().toISOString().split('T')[0],
              items: defaultAuditItems,
              notes: ''
            });
            setNewAuditModalOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>بدء عملية جرد جديدة</span>
        </button>
      </div>

      {/* شريط الفلترة */}
      <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <label className="text-xs font-bold text-slate-600">تصفية السجلات حسب الفرع:</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none"
        >
          <option value="">جميع الفروع ({branches.length})</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
          ))}
        </select>
      </div>

      {/* جدول عمليات الجرد السابقة */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono text-sm">
            جاري تحميل سجلات الجرد...
          </div>
        ) : audits.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <ClipboardCheck className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
            <p className="font-bold text-slate-700">لا توجد عمليات جرد مسجلة بعد</p>
            <p className="text-xs">اضغط على زر "بدء عملية جرد جديدة" لإجراء أول جرد لمخزون الفرع</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                    <th className="p-4">عنوان الجرد</th>
                    <th className="p-4">الفرع المجرود</th>
                    <th className="p-4">تاريخ الجرد</th>
                    <th className="p-4">المشرف المسؤول</th>
                    <th className="p-4">وزن النظام</th>
                    <th className="p-4">الوزن الفعلي</th>
                    <th className="p-4">فارق الوزن</th>
                    <th className="p-4">النتيجة</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-black text-slate-900">{a.auditTitle}</td>
                      <td className="p-4 font-bold text-slate-700">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">
                          {a.branch?.name || `فرع #${a.branchId}`}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-600">{a.auditDate}</td>
                      <td className="p-4 font-medium text-slate-700">{a.adminName || 'المدير العام'}</td>
                      <td className="p-4 font-mono font-bold text-slate-700">{a.totalSystemWeight} غرام</td>
                      <td className="p-4 font-mono font-bold text-slate-900">{a.totalActualWeight} غرام</td>
                      <td className="p-4 font-mono font-black">
                        <span className={parseFloat(a.totalWeightDiff) < 0 ? 'text-rose-600' : parseFloat(a.totalWeightDiff) > 0 ? 'text-emerald-600' : 'text-slate-800'}>
                          {parseFloat(a.totalWeightDiff) > 0 ? `+${a.totalWeightDiff}` : a.totalWeightDiff} غرام
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          a.overallStatus === 'مطابق'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.overallStatus === 'يوجد عجز'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {a.overallStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setViewingAudit(a)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1 shadow"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>عرض التقرير</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAudit(a.id, a.auditTitle)}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination(currentPage, totalPages, totalItems, itemsPerPage, setItemsPerPage, setCurrentPage, "سجل جرد")}
          </>
        )}
      </div>

      {/* نافذة إجراء جرد جديد */}
      {newAuditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl relative my-6 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">بدء جرد مخزون الفرع</h3>
                <p className="text-xs text-slate-500">قم بإدخال الأوزان المقاسة فعلياً لمقارنتها بأوزان النظام</p>
              </div>

              <button
                type="button"
                onClick={() => setNewAuditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAudit} className="space-y-6">
              
              {/* البيانات الأساسية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الفرع المراد جرده *</label>
                  <select
                    required
                    value={auditForm.branchId}
                    onChange={(e) => setAuditForm({ ...auditForm, branchId: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="">-- اختر الفرع --</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">عنوان الجرد / الفترة *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: جرد شهر أكتوبر 2026"
                    value={auditForm.auditTitle}
                    onChange={(e) => setAuditForm({ ...auditForm, auditTitle: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">تاريخ الجرد</label>
                  <input
                    type="date"
                    value={auditForm.auditDate}
                    onChange={(e) => setAuditForm({ ...auditForm, auditDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* جدول الجرد التفصيلي للأصناف */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">جدول مطابقة الأصناف والأوزان:</span>
                  <button
                    type="button"
                    onClick={addAuditRow}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + إضافة صنف إضافي
                  </button>
                </div>

                <div className="overflow-x-auto border-2 border-slate-900 rounded-2xl">
                  <table className="w-full text-center text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-900 font-black">
                        <th className="p-2.5 text-right border-l border-slate-300">الصنف / التصنيف</th>
                        <th className="p-2.5 border-l border-slate-300 w-24">وزن النظام</th>
                        <th className="p-2.5 border-l border-slate-300 w-24 bg-amber-50">الوزن الفعلي</th>
                        <th className="p-2.5 border-l border-slate-300 w-24">فارق الوزن</th>
                        <th className="p-2.5 border-l border-slate-300 w-20">عدد النظام</th>
                        <th className="p-2.5 border-l border-slate-300 w-20 bg-amber-50">العدد الفعلي</th>
                        <th className="p-2.5 w-36 text-right">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {auditForm.items.map((row, idx) => {
                        const diffW = ((parseFloat(row.actualWeight) || 0) - (parseFloat(row.systemWeight) || 0)).toFixed(3);
                        return (
                          <tr key={row.id || idx} className="hover:bg-slate-50">
                            {/* الصنف */}
                            <td className="p-2 text-right border-l border-slate-300">
                              <input
                                type="text"
                                value={row.category}
                                placeholder="اسم الصنف..."
                                onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                                className="w-full bg-transparent focus:outline-none font-bold text-slate-900 text-xs"
                              />
                            </td>

                            {/* وزن النظام */}
                            <td className="p-2 border-l border-slate-300">
                              <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={row.systemWeight}
                                onChange={(e) => handleItemChange(idx, 'systemWeight', e.target.value)}
                                className="w-full text-center bg-transparent focus:outline-none font-mono font-bold text-xs"
                              />
                            </td>

                            {/* الوزن الفعلي المقاس */}
                            <td className="p-2 border-l border-slate-300 bg-amber-50/40">
                              <input
                                type="number"
                                step="any"
                                placeholder="0.00"
                                value={row.actualWeight}
                                onChange={(e) => handleItemChange(idx, 'actualWeight', e.target.value)}
                                className="w-full text-center bg-transparent focus:outline-none font-mono font-black text-slate-950 text-xs"
                              />
                            </td>

                            {/* فرق الوزن */}
                            <td className="p-2 border-l border-slate-300 font-mono font-black">
                              <span className={parseFloat(diffW) < 0 ? 'text-rose-600' : parseFloat(diffW) > 0 ? 'text-emerald-600' : 'text-slate-500'}>
                                {row.systemWeight && row.actualWeight ? (parseFloat(diffW) > 0 ? `+${diffW}` : diffW) : '—'}
                              </span>
                            </td>

                            {/* عدد النظام */}
                            <td className="p-2 border-l border-slate-300">
                              <input
                                type="number"
                                placeholder="0"
                                value={row.systemCount}
                                onChange={(e) => handleItemChange(idx, 'systemCount', e.target.value)}
                                className="w-full text-center bg-transparent focus:outline-none font-mono text-xs"
                              />
                            </td>

                            {/* العدد الفعلي */}
                            <td className="p-2 border-l border-slate-300 bg-amber-50/40">
                              <input
                                type="number"
                                placeholder="0"
                                value={row.actualCount}
                                onChange={(e) => handleItemChange(idx, 'actualCount', e.target.value)}
                                className="w-full text-center bg-transparent focus:outline-none font-mono font-bold text-xs"
                              />
                            </td>

                            {/* ملاحظات */}
                            <td className="p-2 text-right">
                              <input
                                type="text"
                                placeholder="أي ملاحظات..."
                                value={row.notes}
                                onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                                className="w-full bg-transparent focus:outline-none text-xs text-slate-600"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* بطاقة ملخص الحسابات النهائية للجرد */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900 text-white p-5 rounded-2xl">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">إجمالي وزن النظام:</span>
                  <span className="text-lg font-mono font-bold">{totals.totSysWeight} غرام</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">إجمالي الوزن الفعلي:</span>
                  <span className="text-lg font-mono font-black text-amber-400">{totals.totActWeight} غرام</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">صافي فارق الوزن:</span>
                  <span className={`text-lg font-mono font-black ${
                    parseFloat(totals.weightDiff) < 0 ? 'text-rose-400' : parseFloat(totals.weightDiff) > 0 ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {parseFloat(totals.weightDiff) > 0 ? `+${totals.weightDiff}` : totals.weightDiff} غرام
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-0.5">حالة المطابقة العامة:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    totals.status === 'مطابق' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                  }`}>
                    {totals.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setNewAuditModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-black bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow disabled:opacity-50"
                >
                  {saving ? 'جاري الاعتماد...' : 'اعتماد وحفظ سجل الجرد'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* نافذة معاينة وطباعة تقرير الجرد */}
      {viewingAudit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl relative my-6 text-right font-cairo">
            
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6 print:hidden">
              <span className="text-xl font-black text-slate-900">تقرير جرد المخزون الرسمي</span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة تقرير الجرد</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingAudit(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ورقة تقرير الجرد القابلة للطباعة */}
            <div id="audit-report-paper" className="p-4 border-2 border-slate-900 rounded-2xl space-y-6">
              
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-950 font-serif">ELITE SILVER 925</h1>
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-600 block">
                    INVENTORY AUDIT REPORT • سجل الجرد الرسمي
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-500 block">الفرع المجرود:</span>
                  <span className="text-base font-black text-slate-900">{viewingAudit.branch?.name}</span>
                  <span className="text-xs font-mono block text-slate-600">{viewingAudit.auditDate}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">عنوان الجرد:</span>
                <p className="text-base font-black text-slate-900">{viewingAudit.auditTitle}</p>
                <p className="text-xs text-slate-600 mt-1">المشرف المسؤول: {viewingAudit.adminName || 'المدير العام'}</p>
              </div>

              {/* الجدول */}
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse border-2 border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-900 font-black">
                      <th className="p-2 text-right border-l border-slate-900">الصنف</th>
                      <th className="p-2 border-l border-slate-900">وزن النظام</th>
                      <th className="p-2 border-l border-slate-900">الوزن الفعلي</th>
                      <th className="p-2 border-l border-slate-900">فارق الوزن</th>
                      <th className="p-2 border-l border-slate-900">عدد النظام</th>
                      <th className="p-2 border-l border-slate-900">العدد الفعلي</th>
                      <th className="p-2 text-right">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(viewingAudit.items) && viewingAudit.items.map((it, idx) => (
                      <tr key={idx} className="border-b border-slate-400">
                        <td className="p-2 text-right border-l border-slate-900 font-bold">{it.category}</td>
                        <td className="p-2 border-l border-slate-900 font-mono">{it.systemWeight || '—'}</td>
                        <td className="p-2 border-l border-slate-900 font-mono font-bold">{it.actualWeight || '—'}</td>
                        <td className="p-2 border-l border-slate-900 font-mono font-black">
                          {((parseFloat(it.actualWeight) || 0) - (parseFloat(it.systemWeight) || 0)).toFixed(3)}
                        </td>
                        <td className="p-2 border-l border-slate-900 font-mono">{it.systemCount || '—'}</td>
                        <td className="p-2 border-l border-slate-900 font-mono">{it.actualCount || '—'}</td>
                        <td className="p-2 text-right">{it.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* الملخص */}
              <div className="grid grid-cols-4 gap-3 border-2 border-slate-900 p-4 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-slate-600 block">إجمالي وزن النظام:</span>
                  <span className="font-mono font-bold text-sm">{viewingAudit.totalSystemWeight} غرام</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">إجمالي الوزن الفعلي:</span>
                  <span className="font-mono font-black text-sm">{viewingAudit.totalActualWeight} غرام</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">صافي فارق الوزن:</span>
                  <span className="font-mono font-black text-sm">{viewingAudit.totalWeightDiff} غرام</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">النتيجة الرسمية:</span>
                  <span className="font-black text-sm">{viewingAudit.overallStatus}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-300 text-xs">
                <div>
                  <span className="font-bold text-slate-600 block">توقيع مسؤول الجرد (الإدارة):</span>
                  <span className="inline-block mt-4 border-b border-slate-900 w-48" />
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">ختم الفرع المعتمد:</span>
                  <span className="inline-block mt-4 border border-dashed border-slate-400 w-32 h-16 rounded-xl" />
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #audit-report-paper, #audit-report-paper * {
            visibility: visible;
          }
          #audit-report-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default InventoryAuditPage;
