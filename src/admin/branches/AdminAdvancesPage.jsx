import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Coins, 
  Building2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search, 
  DollarSign, 
  User, 
  Calendar,
  MessageSquare,
  Printer,
  FileText,
  Users,
  Eye,
  X,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Mail
} from 'lucide-react';
import imgLogo from '../../images/logo.png';

function AdminAdvancesPage() {
  const token = localStorage.getItem('token');
  const [advances, setAdvances] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({
    totalApproved: '0.000',
    totalPending: '0.000',
    totalRejected: '0.000',
    totalCount: 0
  });
  const [employeeBreakdown, setEmployeeBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  // تبويب العرض الحالي: 'requests' (جدول الطلبات) أو 'salary-summary' (كشف رواتب وسلف الموظفين)
  const [viewTab, setViewTab] = useState('requests');

  // حالات الترقيم (Pagination)
  const [currentPageRequests, setCurrentPageRequests] = useState(1);
  const [itemsPerPageRequests, setItemsPerPageRequests] = useState(10);

  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const [itemsPerPageEmployees, setItemsPerPageEmployees] = useState(10);

  // الفلاتر
  const currentYearMonth = new Date().toISOString().slice(0, 7); // e.g. '2026-10'
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [useMonthFilter, setUseMonthFilter] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // إعادة الترقيم إلى الصفحة الأولى عند تغيير أي فلتر
  useEffect(() => {
    setCurrentPageRequests(1);
    setCurrentPageEmployees(1);
  }, [selectedBranch, selectedEmployee, selectedStatus, selectedMonth, fromDate, toDate, searchQuery, useMonthFilter, viewTab]);

  // نافذة اتخاذ القرار (موافقة / رفض)
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState(null);
  const [actionType, setActionType] = useState('مقبول'); // 'مقبول' | 'مرفوض'
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // نافذة تفاصيل طلب السلفة لمراجعة الملاحظات وقرار الإدارة
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingAdvance, setViewingAdvance] = useState(null);

  // نافذة طباعة كشف سلف الموظف لاحتساب الراتب
  const [salarySlipEmployee, setSalarySlipEmployee] = useState(null);

  // جلب الفروع وقائمة الموظفين
  const loadInitialOptions = async () => {
    try {
      const [resBranches, resEmployees] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/branches`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/employees`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (resBranches.data.success) {
        setBranches(resBranches.data.data || []);
      }
      if (resEmployees.data.success) {
        setEmployees(resEmployees.data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadInitialOptions();
  }, []);

  // جلب بيانات السلف مع الفلاتر
  const loadAdvancesData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBranch) params.append('branchId', selectedBranch);
      if (selectedEmployee) params.append('employeeId', selectedEmployee);
      if (selectedStatus) params.append('status', selectedStatus);

      if (useMonthFilter && selectedMonth) {
        params.append('month', selectedMonth);
      } else {
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
      }

      if (searchQuery) params.append('search', searchQuery);

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/advances?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setAdvances(res.data.data || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
        if (res.data.employeeBreakdown) {
          setEmployeeBreakdown(res.data.employeeBreakdown);
        }
      }
    } catch (error) {
      toast.error('فشل في جلب طلبات السلف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvancesData();
  }, [selectedBranch, selectedEmployee, selectedStatus, selectedMonth, fromDate, toDate, useMonthFilter]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdvance) return;

    setSubmitting(true);
    const toastId = toast.loading('جاري حفظ القرار...');
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/branches/admin/advances/${selectedAdvance.id}/status`, {
        status: actionType,
        adminResponseNotes: adminNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success(actionType === 'مقبول' ? 'تمت الموافقة على السلفة بنجاح' : 'تم رفض طلب السلفة', { id: toastId });
        setActionModalOpen(false);
        setSelectedAdvance(null);
        setAdminNotes('');
        loadAdvancesData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في تحديث حالة السلفة', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // الموظفين المتاحين في القائمة المنسدلة بناءً على الفرع المختار
  const filteredEmployeesList = selectedBranch
    ? employees.filter(e => String(e.branchId) === String(selectedBranch))
    : employees;

  // طباعة كشف سلف الموظف
  const handlePrintSlip = () => {
    window.print();
  };

  // اسم الشهر بالعربي
  const getArabicMonthName = (yearMonthStr) => {
    if (!yearMonthStr) return '';
    const [year, month] = yearMonthStr.split('-');
    const months = [
      'يناير (1)', 'فبراير (2)', 'مارس (3)', 'أبريل (4)', 'مايو (5)', 'يونيو (6)',
      'يوليو (7)', 'أغسطس (8)', 'سبتمبر (9)', 'أكتوبر (10)', 'نوفمبر (11)', 'ديسمبر (12)'
    ];
    const idx = parseInt(month, 10) - 1;
    return `${months[idx] || month} لسنة ${year}`;
  };

  // ترقيم جدول الطلبات التفصيلي
  const totalRequestsPages = Math.ceil(advances.length / itemsPerPageRequests) || 1;
  const startRequestsIdx = (currentPageRequests - 1) * itemsPerPageRequests;
  const paginatedAdvances = advances.slice(startRequestsIdx, startRequestsIdx + itemsPerPageRequests);

  // ترقيم كشف سلف الموظفين
  const totalEmployeesPages = Math.ceil(employeeBreakdown.length / itemsPerPageEmployees) || 1;
  const startEmployeesIdx = (currentPageEmployees - 1) * itemsPerPageEmployees;
  const paginatedEmployees = employeeBreakdown.slice(startEmployeesIdx, startEmployeesIdx + itemsPerPageEmployees);

  // مكون ترقيم موحد وجذاب
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              سلف موظفي الفروع واحتساب الرواتب
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              متابعة واعتماد سلف كل موظف حسب الشهر وتحديد المبالغ الواجب خصمها عند تسليم الراتب
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdvancesData}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* كروت الإحصائيات للفترة والشهر المحدد */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 print:hidden">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الخصم من الرواتب (مقبول)</span>
            <span className="text-2xl font-black text-emerald-600 font-mono">{summary.totalApproved} د.أ</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">طلبات معلقة تنتظر قرارك</span>
            <span className="text-2xl font-black text-amber-600 font-mono">{summary.totalPending} د.أ</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">طلبات مرفوضة</span>
            <span className="text-2xl font-black text-rose-600 font-mono">{summary.totalRejected} د.أ</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block mb-1">إجمالي الطلبات المطابقة</span>
            <span className="text-2xl font-black text-slate-900 font-mono">{advances.length} طلب</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* شريط الفلاتر الشامل (الموظف - الشهر - الفرع - الحالة) */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-slate-500" />
            <span>تصفية سلف الموظفين لاحتساب الراتب</span>
          </span>

          {/* تبديل وضع الفلترة بالتاريخ */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUseMonthFilter(true)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                useMonthFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              تصفية بشهر الراتب
            </button>
            <button
              type="button"
              onClick={() => setUseMonthFilter(false)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                !useMonthFilter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              نطاق تواريخ مخصص
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* اختيار الفرع */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">الفرع</label>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSelectedEmployee(''); // تصفير الموظف عند تغيير الفرع
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">جميع الفروع ({branches.length})</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* اختيار الموظف المخصص */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">الموظف المحدد</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">جميع الموظفين ({filteredEmployeesList.length})</option>
              {filteredEmployeesList.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.branch?.name || 'فرع'})
                </option>
              ))}
            </select>
          </div>

          {/* فلتر الشهر أو التاريخ */}
          {useMonthFilter ? (
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">شهر الراتب (سنة / شهر)</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">من تاريخ</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">إلى تاريخ</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* حالة السلفة */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">حالة السلفة</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">جميع الحالات</option>
              <option value="مقبول">مقبول (واجبة الخصم من الراتب)</option>
              <option value="معلق">معلق (قيد الانتظار)</option>
              <option value="مرفوض">مرفوض</option>
            </select>
          </div>
        </div>

        {/* أزرار سريعة */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            {useMonthFilter && selectedMonth && (
              <span>كشف سلف شهر: <strong className="text-slate-900">{getArabicMonthName(selectedMonth)}</strong></span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBranch('');
              setSelectedEmployee('');
              setSelectedStatus('');
              setSelectedMonth(currentYearMonth);
              setFromDate('');
              setToDate('');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      </div>

      {/* تبويبات العرض (كشف ملخص الموظفين للراتب / أو جدول الطلبات التفصيلي) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        <button
          onClick={() => setViewTab('salary-summary')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            viewTab === 'salary-summary'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>كشف سلف كل موظف للراتب ({employeeBreakdown.length} موظفين)</span>
        </button>

        <button
          onClick={() => setViewTab('requests')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            viewTab === 'requests'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-400" />
          <span>جدول الطلبات التفصيلي ({advances.length})</span>
        </button>
      </div>

      {/* 1. تبويب كشف سلف كل موظف لاحتساب الراتب */}
      {viewTab === 'salary-summary' && (
        <div className="space-y-4 print:hidden">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                هذا الجدول يوضح <strong>المبلغ الإجمالي المعتمد للخصم من راتب كل موظف</strong> خلال الفترة المحددة ({useMonthFilter ? getArabicMonthName(selectedMonth) : 'الفترة المحددة'}).
              </span>
            </div>
            <span className="font-bold shrink-0">
              إجمالي الخصومات: {summary.totalApproved} د.أ
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-mono text-sm">
                جاري إعداد كشف سلف الموظفين...
              </div>
            ) : employeeBreakdown.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
                <p className="font-bold text-slate-700">لا توجد سلف مسجلة لأي موظف في هذا الشهر / التاريخ</p>
                <p className="text-xs">الموظفون لم يقدموا طلبات سلف خلال هذه الفترة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                      <th className="p-4">اسم الموظف</th>
                      <th className="p-4">الفرع</th>
                      <th className="p-4">رقم الهاتف / البريد</th>
                      <th className="p-4 text-center">الراتب الشهري</th>
                      <th className="p-4 text-center text-emerald-700">السلف المقبولة (تُخصم)</th>
                      <th className="p-4 text-center text-indigo-700">صافي المتبقي للراتب</th>
                      <th className="p-4 text-center text-amber-700">سلف معلقة</th>
                      <th className="p-4 text-center text-rose-700">سلف مرفوضة</th>
                      <th className="p-4 text-center">إجراءات واحتساب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedEmployees.map((emp) => {
                      const salaryNum = parseFloat(emp.salary) || 0;
                      const netRemaining = Math.max(0, salaryNum - emp.approvedTotal);
                      return (
                        <tr key={emp.employeeId} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-black text-slate-900 text-sm">
                            {emp.employeeName}
                          </td>
                          <td className="p-4 font-bold text-slate-600">
                            {emp.branchName}
                          </td>
                          <td className="p-4 font-mono text-slate-500">
                            <div>{emp.phone || '—'}</div>
                            {emp.email && (
                              <div className="text-[11px] text-indigo-600 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" />
                                <span>{emp.email}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-slate-800">
                            {salaryNum > 0 ? `${salaryNum.toFixed(3)} د.أ` : <span className="text-slate-400 font-sans text-[11px]">غير مسجل</span>}
                          </td>
                          <td className="p-4 text-center font-mono font-black text-emerald-600 text-base">
                            {emp.approvedTotal.toFixed(3)} د.أ
                          </td>
                          <td className="p-4 text-center font-mono font-black text-indigo-600 text-base">
                            {salaryNum > 0 ? `${netRemaining.toFixed(3)} د.أ` : '—'}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-amber-600">
                            {emp.pendingTotal > 0 ? `${emp.pendingTotal.toFixed(3)} د.أ` : '—'}
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-rose-500">
                            {emp.rejectedTotal > 0 ? `${emp.rejectedTotal.toFixed(3)} د.أ` : '—'}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSalarySlipEmployee(emp)}
                              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 mx-auto shadow transition-all"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>كشف حساب الراتب</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* شريط ترقيم كشف الموظفين */}
            {!loading && employeeBreakdown.length > 0 && renderPagination(
              currentPageEmployees,
              totalEmployeesPages,
              employeeBreakdown.length,
              itemsPerPageEmployees,
              setItemsPerPageEmployees,
              setCurrentPageEmployees,
              "موظف"
            )}
          </div>
        </div>
      )}

      {/* 2. تبويب جدول الطلبات التفصيلي */}
      {viewTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-mono text-sm">
              جاري تحميل طلبات السلف...
            </div>
          ) : advances.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Coins className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
              <p className="font-bold text-slate-700">لا توجد طلبات سلف مسجلة وفق الفلتر المحدد</p>
              <p className="text-xs">يقوم موظف الفرع بتقديم طلب السلفة من خلال بوابته في الفرع</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                    <th className="p-4">اسم الموظف</th>
                    <th className="p-4">الفرع</th>
                    <th className="p-4">تاريخ الطلب</th>
                    <th className="p-4">المبلغ المطلوب</th>
                    <th className="p-4">حالة الطلب</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAdvances.map((adv) => (
                    <tr key={adv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-black text-slate-900 text-sm">
                        {adv.employeeName}
                        {adv.employee?.phone && (
                          <span className="block text-[11px] font-mono text-slate-400 font-normal">
                            {adv.employee.phone}
                          </span>
                        )}
                        {adv.employee?.email && (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-indigo-600 font-normal mt-0.5">
                            <Mail className="w-3 h-3" />
                            {adv.employee.email}
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-600">
                        {adv.branch?.name || `فرع #${adv.branchId}`}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">
                        {adv.requestDate}
                      </td>
                      <td className="p-4 font-mono font-black text-base text-slate-900">
                        {parseFloat(adv.amount).toFixed(3)} د.أ
                      </td>
                      <td className="p-4">
                        {adv.status === 'مقبول' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            مقبول
                          </span>
                        )}
                        {adv.status === 'معلق' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            معلق
                          </span>
                        )}
                        {adv.status === 'مرفوض' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            مرفوض
                          </span>
                        )}
                      </td>
                     
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setViewingAdvance(adv);
                              setDetailsModalOpen(true);
                            }}
                            title="عرض تفاصيل الطلب والملاحظات وقرار الإدارة"
                            className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 transition-all border border-indigo-200 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-600" />
                            <span>التفاصيل</span>
                          </button>

                          {adv.status === 'معلق' ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAdvance(adv);
                                  setActionType('مقبول');
                                  setAdminNotes('');
                                  setActionModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all"
                              >
                                موافقة
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAdvance(adv);
                                  setActionType('مرفوض');
                                  setAdminNotes('');
                                  setActionModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs transition-all"
                              >
                                رفض
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAdvance(adv);
                                setActionType(adv.status);
                                setAdminNotes(adv.adminResponseNotes || '');
                                setActionModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                            >
                              تعديل القرار
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* شريط ترقيم جدول الطلبات */}
          {!loading && advances.length > 0 && renderPagination(
            currentPageRequests,
            totalRequestsPages,
            advances.length,
            itemsPerPageRequests,
            setItemsPerPageRequests,
            setCurrentPageRequests,
            "طلب سلفة"
          )}
        </div>
      )}

      {/* نافذة تفاصيل طلب السلفة الشاملة لمراجعة الملاحظات والقرار */}
      {detailsModalOpen && viewingAdvance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-right space-y-5 my-6 animate-in fade-in zoom-in-95 duration-200">
            {/* الترويسة */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">
                    تفاصيل طلب السلفة #{viewingAdvance.id}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    تاريخ تقديم الطلب: {viewingAdvance.requestDate}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                title="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* حالة الطلب والمبلغ */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bold block mb-1">المبلغ المطلوب:</span>
                <span className="font-mono font-black text-2xl text-slate-900">
                  {parseFloat(viewingAdvance.amount).toFixed(3)} <span className="text-sm font-sans">د.أ</span>
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs text-slate-500 font-bold block mb-1">حالة الطلب:</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${
                  viewingAdvance.status === 'مقبول'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : viewingAdvance.status === 'معلق'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {viewingAdvance.status === 'مقبول' && <CheckCircle2 className="w-4 h-4" />}
                  {viewingAdvance.status === 'معلق' && <Clock className="w-4 h-4" />}
                  {viewingAdvance.status === 'مرفوض' && <XCircle className="w-4 h-4" />}
                  <span>{viewingAdvance.status === 'مقبول' ? 'تمت الموافقة (مقبول)' : viewingAdvance.status === 'معلق' ? 'قيد الانتظار (معلق)' : 'مرفوض'}</span>
                </span>
              </div>
            </div>

            {/* بيانات الموظف والفرع */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div>
                <span className="text-slate-400 font-bold block mb-0.5">اسم الموظف:</span>
                <span className="font-black text-slate-900 text-sm block">{viewingAdvance.employeeName}</span>
                {viewingAdvance.employee?.phone && (
                  <span className="block font-mono text-slate-500 mt-0.5">{viewingAdvance.employee.phone}</span>
                )}
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-0.5">الفرع:</span>
                <span className="font-bold text-slate-800 text-sm block">{viewingAdvance.branch?.name || `فرع #${viewingAdvance.branchId}`}</span>
                {viewingAdvance.branch?.city && (
                  <span className="block text-slate-500 mt-0.5">{viewingAdvance.branch.city}</span>
                )}
              </div>
              {viewingAdvance.employee?.email && (
                <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-indigo-700">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono text-[11px] font-medium">{viewingAdvance.employee.email}</span>
                </div>
              )}
            </div>

            {/* سبب وملاحظات الموظف عند الطلب */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                سبب السلفة / ملاحظات الموظف:
              </label>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed font-medium min-h-[50px]">
                {viewingAdvance.reason ? (
                  viewingAdvance.reason
                ) : (
                  <span className="text-slate-400 italic">لا توجد ملاحظات أو أسباب مدونة من قبل الموظف</span>
                )}
              </div>
            </div>

            {/* قرار الإدارة وملاحظاتها */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  قرار وملاحظات الإدارة:
                </label>
                {viewingAdvance.approvedByAdminName && (
                  <span className="text-[11px] text-slate-500 font-medium">
                    مسؤول الاعتماد: <strong className="text-slate-800">{viewingAdvance.approvedByAdminName}</strong>
                  </span>
                )}
              </div>
              <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                viewingAdvance.status === 'مقبول'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                  : viewingAdvance.status === 'مرفوض'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950 font-medium'
              }`}>
                {viewingAdvance.adminResponseNotes ? (
                  viewingAdvance.adminResponseNotes
                ) : viewingAdvance.status === 'معلق' ? (
                  <span className="text-amber-800 font-medium">⏳ الطلب قيد الانتظار والمراجعة، لم يتم تدوين قرار أو ملاحظات بعد.</span>
                ) : (
                  <span className="text-slate-500">تم اعتماد القرار دون ملاحظات إضافية.</span>
                )}

                {viewingAdvance.actionDate && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>تاريخ اتخاذ القرار: {viewingAdvance.actionDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* أزرار الإجراءات السفلية */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                إغلاق
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAdvance(viewingAdvance);
                  setActionType(viewingAdvance.status === 'معلق' ? 'مقبول' : viewingAdvance.status);
                  setAdminNotes(viewingAdvance.adminResponseNotes || '');
                  setDetailsModalOpen(false);
                  setActionModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow transition-all flex items-center gap-1.5"
              >
                <span>{viewingAdvance.status === 'معلق' ? 'اتخاذ القرار الآن' : 'تعديل قرار الإدارة'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة اتخاذ القرار (موافقة أو رفض سلفة) */}
      {actionModalOpen && selectedAdvance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              {actionType === 'مقبول' ? 'اعتماد وصرف السلفة' : 'رفض طلب السلفة'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              للموظف: <strong className="text-slate-800">{selectedAdvance.employeeName}</strong> بمبلغ <strong className="text-slate-800 font-mono">{parseFloat(selectedAdvance.amount).toFixed(3)} د.أ</strong>
            </p>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('مقبول')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                    actionType === 'مقبول'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  موافقة على السلفة
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('مرفوض')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                    actionType === 'مرفوض'
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  رفض الطلب
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ملاحظات الإدارة (ستظهر لموظف الفرع):
                </label>
                <textarea
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={actionType === 'مقبول' ? 'مثال: تمت الموافقة، يرجى الاستلام نقداً من صندوق الفرع...' : 'مثال: نعتذر، تجاوز الحد المسموح به لهذا الشهر...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                ></textarea>
              </div>

              {selectedAdvance.employee?.email ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[11px]">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>سيتم إرسال إشعار تلقائي بالقرار إلى بريد الموظف (<strong>{selectedAdvance.employee.email}</strong>) فور الحفظ.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px]">
                  <Mail className="w-3.5 h-3.5 shrink-0 opacity-40" />
                  <span>تنبيه: لا يوجد بريد إلكتروني مسجل لهذا الموظف لإرسال إشعار مباشر.</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 text-white rounded-xl text-xs font-black transition-all shadow ${
                    actionType === 'مقبول' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submitting ? 'جاري الحفظ...' : 'تأكيد القرار'}
                </button>
                <button
                  type="button"
                  onClick={() => setActionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة معاينة وطباعة كشف حساب سلف الموظف لاحتساب الراتب الرسمي */}
      {salarySlipEmployee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className="bg-white rounded-3xl w-full max-w-[850px] p-6 sm:p-8 shadow-2xl relative my-6">
            
            {/* شريط الإجراءات العلوي */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-lg text-slate-900">
                  كشف حساب سلف الموظف لاحتساب الراتب
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الكشف</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSalarySlipEmployee(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ورقة الكشف القابلة للطباعة الرسمية */}
            <div id="salary-slip-paper" className="p-6 border-2 border-slate-900 rounded-2xl bg-white text-slate-900 font-cairo">
              
              {/* الترويسة الرسمية */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black tracking-wider text-slate-900 mb-1">
                    ELITE SILVER 925
                  </h1>
                  <h2 className="text-sm font-bold text-slate-700">
                    مصوغات إيليت سيلفر 925 - الإدارة المالية
                  </h2>
                  <p className="text-xs text-slate-500">
                    كشف سلف الموظف لاحتساب وتصفية الراتب الشهري
                  </p>
                </div>
                <div className="text-left font-mono text-xs space-y-1">
                  <div><strong>التاريخ:</strong> {new Date().toISOString().split('T')[0]}</div>
                  <div><strong>شهر المحاسبة:</strong> {useMonthFilter ? getArabicMonthName(selectedMonth) : 'فترة مخصصة'}</div>
                </div>
              </div>

              {/* بيانات الموظف والفرع */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6 text-xs">
                <div>
                  <span className="text-slate-500 block">اسم الموظف:</span>
                  <span className="font-black text-sm text-slate-900">{salarySlipEmployee.employeeName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">الفرع:</span>
                  <span className="font-bold text-slate-800">{salarySlipEmployee.branchName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">رقم الهاتف:</span>
                  <span className="font-mono font-bold text-slate-800">{salarySlipEmployee.phone || '—'}</span>
                </div>
              </div>

              {/* جدول السلف التفصيلي للموظف */}
              <h4 className="font-black text-xs text-slate-800 mb-2">
                بيان تفاصيل السلف المقدمة خلال الفترة:
              </h4>

              <table className="w-full text-right text-xs border border-slate-900 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-900 font-black">
                    <th className="p-2 border-r border-slate-900 w-12 text-center">#</th>
                    <th className="p-2 border-r border-slate-900 w-28">تاريخ السلفة</th>
                    <th className="p-2 border-r border-slate-900">البيان / سبب السلفة</th>
                    <th className="p-2 border-r border-slate-900 w-24 text-center">الحالة</th>
                    <th className="p-2 border-r border-slate-900">ملاحظات الإدارة</th>
                    <th className="p-2 w-28 text-left">المبلغ (د.أ)</th>
                  </tr>
                </thead>
                <tbody>
                  {salarySlipEmployee.advances.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-300">
                      <td className="p-2 border-r border-slate-900 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-900 font-mono">{item.requestDate}</td>
                      <td className="p-2 border-r border-slate-900">{item.reason || 'سلفة شخصية'}</td>
                      <td className="p-2 border-r border-slate-900 text-center font-bold">
                        {item.status === 'مقبول' ? '✅ مقبول' : item.status === 'معلق' ? '⏳ معلق' : '❌ مرفوض'}
                      </td>
                      <td className="p-2 border-r border-slate-900 text-[11px] text-slate-600">
                        {item.adminResponseNotes || '—'}
                      </td>
                      <td className="p-2 text-left font-mono font-bold">
                        {parseFloat(item.amount).toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* بطاقة إجمالي المبلغ واحتساب صافي الراتب المستحق */}
              <div className="bg-slate-900 text-white p-4 rounded-xl mb-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-800 text-center">
                  <div className="p-2">
                    <span className="text-[11px] text-slate-400 block mb-1">الراتب الأساسي المسجل:</span>
                    <span className="text-xl font-black font-mono text-slate-100">
                      {parseFloat(salarySlipEmployee.salary || 0) > 0 
                        ? `${parseFloat(salarySlipEmployee.salary).toFixed(3)} د.أ` 
                        : 'غير مسجل'}
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="text-[11px] text-amber-400 block mb-1">إجمالي السلف المعتمدة المقتطعة:</span>
                    <span className="text-xl font-black font-mono text-rose-400">
                      - {salarySlipEmployee.approvedTotal.toFixed(3)} د.أ
                    </span>
                  </div>
                  <div className="p-2">
                    <span className="text-[11px] text-emerald-400 block mb-1">صافي الراتب المستحق للصرف:</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {parseFloat(salarySlipEmployee.salary || 0) > 0 
                        ? `${Math.max(0, parseFloat(salarySlipEmployee.salary) - salarySlipEmployee.approvedTotal).toFixed(3)} د.أ` 
                        : `${salarySlipEmployee.approvedTotal.toFixed(3)} د.أ (خصم)`}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-800">
                  تم احتساب هذا البيان لتسوية مستحقات شهر {useMonthFilter ? getArabicMonthName(selectedMonth) : ''} بعد حسم كافة السلف المصروفة.
                </div>
              </div>

              {/* التواقيع الرسمية */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-900 text-xs">
                <div className="space-y-12">
                  <span className="font-bold block">توقيع واعتماد الإدارة / المحاسب:</span>
                  <div className="border-b border-dashed border-slate-400 w-48"></div>
                </div>
                <div className="space-y-12 text-left" dir="ltr">
                  <span className="font-bold block text-right">توقيع الموظف بالاستلام والموافقة على الخصم:</span>
                  <div className="border-b border-dashed border-slate-400 w-48 mr-auto"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* تنسيقات الطباعة */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #salary-slip-paper, #salary-slip-paper * {
            visibility: visible;
          }
          #salary-slip-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>

    </div>
  );
}

export default AdminAdvancesPage;
