import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  CalendarCheck, 
  Building2, 
  Clock, 
  UserCheck, 
  UserX, 
  RefreshCw, 
  Search, 
  User, 
  Calendar,
  Printer,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';

function AdminAttendance() {
  const token = localStorage.getItem('token');
  const [attendances, setAttendances] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalAttended: 0,
    totalAbsent: 0,
    totalHours: '0.00'
  });
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Filters
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formState, setFormState] = useState({
    employeeId: '',
    branchId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'حاضر',
    checkInTime: '09:00:00',
    checkOutTime: '18:00:00',
    totalHours: '9.00',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch branches and employees for filters
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
      console.error("Error loading options:", error);
    }
  };

  useEffect(() => {
    loadInitialOptions();
  }, []);

  // Fetch attendance records
  const loadAttendance = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBranch) params.append('branchId', selectedBranch);
      if (selectedEmployee) params.append('employeeId', selectedEmployee);
      if (selectedStatus) params.append('status', selectedStatus);

      if (selectedDate) {
        params.append('date', selectedDate);
      } else if (selectedMonth) {
        params.append('month', selectedMonth);
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/branches/admin/attendance?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setAttendances(res.data.data || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (error) {
      toast.error('فشل في جلب سجلات الحضور والغياب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
    setCurrentPage(1);
  }, [selectedBranch, selectedEmployee, selectedStatus, selectedMonth, selectedDate]);

  // Open modal for manual add
  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormState({
      employeeId: employees[0]?.id || '',
      branchId: employees[0]?.branchId || branches[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      status: 'حاضر',
      checkInTime: '09:00:00',
      checkOutTime: '18:00:00',
      totalHours: '9.00',
      notes: ''
    });
    setModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (rec) => {
    setEditingRecord(rec);
    setFormState({
      employeeId: rec.employeeId,
      branchId: rec.branchId,
      date: rec.date,
      status: rec.status || 'حاضر',
      checkInTime: rec.checkInTime || '',
      checkOutTime: rec.checkOutTime || '',
      totalHours: rec.totalHours ? String(rec.totalHours) : '0',
      notes: rec.notes || ''
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.employeeId || !formState.date) {
      toast.error('يرجى تحديد الموظف والتاريخ');
      return;
    }

    setSubmitting(true);
    try {
      if (editingRecord) {
        const res = await axios.put(`${import.meta.env.VITE_API_URL}/branches/admin/attendance/${editingRecord.id}`, formState, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          toast.success('تم تحديث سجل الحضور بنجاح');
          setModalOpen(false);
          loadAttendance();
        }
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/branches/admin/attendance`, formState, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          toast.success('تم تسجيل الحضور/الغياب بنجاح');
          setModalOpen(false);
          loadAttendance();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حفظ السجل');
    } finally {
      setSubmitting(false);
    }
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Filtered attendances by search
  const filteredAttendances = attendances.filter(att => {
    if (!searchQuery) return true;
    const name = att.employee?.name || '';
    const phone = att.employee?.phone || '';
    const branchName = att.branch?.name || '';
    return name.includes(searchQuery) || phone.includes(searchQuery) || branchName.includes(searchQuery);
  });

  // Pagination calculation
  const totalItems = filteredAttendances.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAttendances = filteredAttendances.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="space-y-6">
      
      {/* الترويسة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-teal-600" />
            <h1 className="text-2xl font-black text-slate-900">سجل الحضور والغياب لموظفي الفروع</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            يتم تسجيل حضور الموظف تلقائياً بمجرد تسجيل دخوله للبوابة، وانصرافه عند تسجيل الخروج مع احتساب ساعات العمل اللحظية.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الكشف</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حضور/غياب يدوي</span>
          </button>

          <button
            onClick={loadAttendance}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">أيام الحضور المسجلة</span>
            <span className="text-xl font-black font-mono text-teal-600">{summary.totalAttended} يوم</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">إجمالي ساعات العمل</span>
            <span className="text-xl font-black font-mono text-indigo-600">{summary.totalHours} ساعة</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">حالات الغياب المسجلة</span>
            <span className="text-xl font-black font-mono text-rose-600">{summary.totalAbsent}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 block">إجمالي السجلات</span>
            <span className="text-xl font-black font-mono text-slate-800">{summary.totalRecords}</span>
          </div>
        </div>
      </div>

      {/* شريط الفلاتر والبحث */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 print:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* فرع */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">الفرع:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">جميع الفروع ({branches.length})</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* موظف */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">الموظف:</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">جميع الموظفين ({employees.length})</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* شهر الحساب */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">شهر المحاسبة:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDate('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
            />
          </div>

          {/* تاريخ محدد */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">أو تاريخ محدد:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
            />
          </div>

          {/* الحالة */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">الحالة:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="">جميع الحالات</option>
              <option value="حاضر">حاضر ✅</option>
              <option value="غياب">غياب ❌</option>
              <option value="متأخر">متأخر ⏳</option>
              <option value="مغادر مبكراً">مغادر مبكراً 🚪</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث باسم الموظف أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBranch('');
              setSelectedEmployee('');
              setSelectedStatus('');
              setSelectedMonth(currentMonthStr);
              setSelectedDate('');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      </div>

      {/* جدول سجل الحضور والغياب */}
      <div id="attendance-print-area" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono text-sm">
            جاري تحميل سجلات الحضور والغياب...
          </div>
        ) : filteredAttendances.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <CalendarCheck className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
            <p className="font-bold text-slate-700">لا توجد سجلات حضور مسجلة وفق الفلتر المحدد</p>
            <p className="text-xs">يتم تسجيل الحضور تلقائياً عند تسجيل دخول الموظف إلى بوابته</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                  <th className="p-4">اسم الموظف</th>
                  <th className="p-4">الفرع</th>
                  <th className="p-4">التاريخ واليوم</th>
                  <th className="p-4 text-center">وقت الحضور (الدخول)</th>
                  <th className="p-4 text-center">وقت الانصراف (الخروج)</th>
                  <th className="p-4 text-center">ساعات العمل</th>
                  <th className="p-4 text-center">الحالة</th>
                  <th className="p-4">ملاحظات</th>
                  <th className="p-4 text-center print:hidden">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedAttendances.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-900 text-sm">
                      {rec.employee?.name || `موظف #${rec.employeeId}`}
                      {rec.employee?.phone && (
                        <span className="block text-[11px] font-mono text-slate-400 font-normal">
                          {rec.employee.phone}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-600">
                      {rec.branch?.name || `فرع #${rec.branchId}`}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{rec.dayName || '—'}</div>
                      <div className="font-mono text-[11px] text-slate-400">{rec.date}</div>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-teal-700 text-sm">
                      {rec.checkInTime ? rec.checkInTime : <span className="text-slate-400 font-normal text-xs">—</span>}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-700 text-sm">
                      {rec.checkOutTime ? rec.checkOutTime : <span className="text-amber-500 font-normal text-xs">قيد العمل</span>}
                    </td>
                    <td className="p-4 text-center font-mono font-black text-slate-900 text-sm">
                      {parseFloat(rec.totalHours) > 0 ? `${parseFloat(rec.totalHours).toFixed(2)} س` : '—'}
                    </td>
                    <td className="p-4 text-center">
                      {rec.status === 'حاضر' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                          <CheckCircle2 className="w-3 h-3" />
                          حاضر
                        </span>
                      )}
                      {rec.status === 'غياب' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          غياب
                        </span>
                      )}
                      {rec.status === 'متأخر' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          متأخر
                        </span>
                      )}
                      {rec.status === 'مغادر مبكراً' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          مغادر مبكراً
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate" title={rec.notes}>
                      {rec.notes || '—'}
                    </td>
                    <td className="p-4 text-center print:hidden">
                      <button
                        onClick={() => handleOpenEdit(rec)}
                        className="p-1.5 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-all"
                        title="تعديل السجل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ترقيم الصفحات */}
        {!loading && filteredAttendances.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none print:hidden">
            <div className="flex items-center gap-3 text-slate-500">
              <span>
                عرض <strong>{startIdx + 1}</strong> إلى <strong>{Math.min(startIdx + itemsPerPage, totalItems)}</strong> من إجمالي <strong>{totalItems}</strong> سجل
              </span>
              <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                <span>لكل صفحة:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono font-bold"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="font-mono px-3 font-bold text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* نافذة تسجيل أو تعديل الحضور يدوياً */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-900">
                {editingRecord ? 'تعديل سجل الحضور والدوام' : 'تسجيل حضور / غياب يدوي لموظف'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الموظف:</label>
                  <select
                    disabled={!!editingRecord}
                    value={formState.employeeId}
                    onChange={(e) => {
                      const empId = e.target.value;
                      const emp = employees.find(x => String(x.id) === String(empId));
                      setFormState(prev => ({
                        ...prev,
                        employeeId: empId,
                        branchId: emp ? emp.branchId : prev.branchId
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none"
                    required
                  >
                    <option value="">-- اختر الموظف --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">التاريخ:</label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">حالة الحضور:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['حاضر', 'غياب', 'متأخر', 'مغادر مبكراً'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, status: st }))}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        formState.status === st
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">وقت الحضور:</label>
                  <input
                    type="text"
                    placeholder="09:00:00"
                    value={formState.checkInTime}
                    onChange={(e) => setFormState(prev => ({ ...prev, checkInTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800 focus:outline-none text-center"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">وقت الانصراف:</label>
                  <input
                    type="text"
                    placeholder="18:00:00"
                    value={formState.checkOutTime}
                    onChange={(e) => setFormState(prev => ({ ...prev, checkOutTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800 focus:outline-none text-center"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">ساعات العمل:</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="8.50"
                    value={formState.totalHours}
                    onChange={(e) => setFormState(prev => ({ ...prev, totalHours: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-slate-800 focus:outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">ملاحظات الإدارة:</label>
                <textarea
                  rows="2"
                  value={formState.notes}
                  onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="ملاحظات حول الإجازة، سبب التأخير، أو استئذان..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow"
                >
                  {submitting ? 'جاري الحفظ...' : 'حفظ السجل'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* تنسيقات الطباعة */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #attendance-print-area, #attendance-print-area * {
            visibility: visible;
          }
          #attendance-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
}

export default AdminAttendance;
