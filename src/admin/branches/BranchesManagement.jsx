import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Building2, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  MapPin, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Store,
  ChevronRight,
  ChevronLeft,
  Search
} from 'lucide-react';

function BranchesManagement() {
  const token = localStorage.getItem('token');
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('branches'); // 'branches' | 'employees'

  // حالات الترقيم والبحث السريع
  const [currentPageBranches, setCurrentPageBranches] = useState(1);
  const [itemsPerPageBranches, setItemsPerPageBranches] = useState(6);
  const [searchBranches, setSearchBranches] = useState('');

  const [currentPageEmployees, setCurrentPageEmployees] = useState(1);
  const [itemsPerPageEmployees, setItemsPerPageEmployees] = useState(10);
  const [searchEmployees, setSearchEmployees] = useState('');

  // إعادة الترقيم للصفحة الأولى عند تغيير البحث أو التبويب
  useEffect(() => {
    setCurrentPageBranches(1);
  }, [searchBranches, activeTab]);

  useEffect(() => {
    setCurrentPageEmployees(1);
  }, [searchEmployees, activeTab]);

  // نافذة الفرع
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchForm, setBranchForm] = useState({
    name: '',
    code: '',
    city: 'عمان',
    address: '',
    phone: '',
    phone2: '',
    managerName: '',
    notes: '',
    isActive: true
  });

  // نافذة الموظف
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    branchId: '',
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    salary: '',
    nationalId: '',
    isActive: true
  });

  const loadData = async () => {
    setLoading(true);
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
      toast.error('فشل في جلب بيانات الفروع والموظفين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // حفظ الفرع
  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.name.trim()) {
      return toast.error('يرجى كتابة اسم الفرع');
    }

    const toastId = toast.loading('جاري حفظ بيانات الفرع...');
    try {
      if (editingBranch) {
        await axios.put(`${import.meta.env.VITE_API_URL}/branches/admin/branches/${editingBranch.id}`, branchForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تم تحديث الفرع بنجاح', { id: toastId });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/branches/admin/branches`, branchForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تمت إضافة الفرع بنجاح', { id: toastId });
      }
      setBranchModalOpen(false);
      setEditingBranch(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حفظ الفرع', { id: toastId });
    }
  };

  // حذف الفرع
  const handleDeleteBranch = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف فرع "${name}"؟ سيتم حذف جميع الموظفين المرتبطين به.`)) return;
    const toastId = toast.loading('جاري حذف الفرع...');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/branches/admin/branches/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم حذف الفرع بنجاح', { id: toastId });
      loadData();
    } catch (error) {
      toast.error('فشل في حذف الفرع', { id: toastId });
    }
  };

  // حفظ الموظف
  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!employeeForm.branchId || !employeeForm.name.trim() || !employeeForm.username.trim()) {
      return toast.error('يرجى تعبئة الفرع واسم الموظف واسم المستخدم');
    }
    if (!editingEmployee && !employeeForm.password.trim()) {
      return toast.error('يرجى تحديد كلمة مرور للموظف الجديد');
    }

    const toastId = toast.loading('جاري حفظ بيانات الموظف...');
    try {
      if (editingEmployee) {
        await axios.put(`${import.meta.env.VITE_API_URL}/branches/admin/employees/${editingEmployee.id}`, employeeForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تم تحديث بيانات الموظف بنجاح', { id: toastId });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/branches/admin/employees`, employeeForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تمت إضافة موظف الفرع بنجاح', { id: toastId });
      }
      setEmployeeModalOpen(false);
      setEditingEmployee(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل في حفظ الموظف', { id: toastId });
    }
  };

  // حذف الموظف
  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`هل أنت متأكد من حذف حساب الموظف "${name}"؟`)) return;
    const toastId = toast.loading('جاري حذف الموظف...');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/branches/admin/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم حذف الموظف بنجاح', { id: toastId });
      loadData();
    } catch (error) {
      toast.error('فشل في حذف الموظف', { id: toastId });
    }
  };

  // ترقيم الفروع والبحث
  const filteredBranches = branches.filter(b => 
    !searchBranches || 
    b.name?.toLowerCase().includes(searchBranches.toLowerCase()) ||
    b.city?.toLowerCase().includes(searchBranches.toLowerCase()) ||
    b.code?.toLowerCase().includes(searchBranches.toLowerCase()) ||
    b.managerName?.toLowerCase().includes(searchBranches.toLowerCase())
  );
  const totalBranchesPages = Math.ceil(filteredBranches.length / itemsPerPageBranches) || 1;
  const startBranchesIdx = (currentPageBranches - 1) * itemsPerPageBranches;
  const paginatedBranches = filteredBranches.slice(startBranchesIdx, startBranchesIdx + itemsPerPageBranches);

  // ترقيم الموظفين والبحث
  const filteredEmployees = employees.filter(emp =>
    !searchEmployees ||
    emp.name?.toLowerCase().includes(searchEmployees.toLowerCase()) ||
    emp.username?.toLowerCase().includes(searchEmployees.toLowerCase()) ||
    emp.branch?.name?.toLowerCase().includes(searchEmployees.toLowerCase()) ||
    emp.phone?.includes(searchEmployees)
  );
  const totalEmployeesPages = Math.ceil(filteredEmployees.length / itemsPerPageEmployees) || 1;
  const startEmployeesIdx = (currentPageEmployees - 1) * itemsPerPageEmployees;
  const paginatedEmployees = filteredEmployees.slice(startEmployeesIdx, startEmployeesIdx + itemsPerPageEmployees);

  // مكون ترقيم موحد
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
              <option value={6}>6</option>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              إدارة الفروع وموظفي المتاجر
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              إنشاء فروع البوتيك وتعيين موظفي كل فرع مع بيانات الدخول المباشرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditingBranch(null);
              setBranchForm({
                name: '',
                code: `BR-0${branches.length + 1}`,
                city: 'عمان',
                address: '',
                phone: '',
                phone2: '',
                managerName: '',
                notes: '',
                isActive: true
              });
              setBranchModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة فرع جديد</span>
          </button>

          <button
            onClick={() => {
              if (branches.length === 0) {
                return toast.error('يرجى إنشاء فرع واحد على الأقل أولاً');
              }
              setEditingEmployee(null);
              setEmployeeForm({
                branchId: branches[0]?.id || '',
                name: '',
                username: '',
                password: '',
                phone: '',
                email: '',
                salary: '',
                nationalId: '',
                isActive: true
              });
              setEmployeeModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موظف لفرع</span>
          </button>
        </div>
      </div>

      {/* أزرار التبديل بين الفروع والموظفين مع شريط بحث سريع */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'branches'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>الفروع المسجلة ({branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
              activeTab === 'employees'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>موظفو الفروع ({employees.length})</span>
          </button>
        </div>

        {/* حقل البحث السريع */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={activeTab === 'branches' ? searchBranches : searchEmployees}
            onChange={(e) => {
              if (activeTab === 'branches') {
                setSearchBranches(e.target.value);
              } else {
                setSearchEmployees(e.target.value);
              }
            }}
            placeholder={activeTab === 'branches' ? 'بحث بالاسم، المدينة، الكود...' : 'بحث بالموظف، الفرع، الهاتف...'}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none pl-8"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-sm">
          جاري تحميل بيانات الفروع والموظفين...
        </div>
      ) : activeTab === 'branches' ? (
        /* قائمة الفروع */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBranches.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                <Store className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
                <p className="font-bold text-slate-700">لم يتم العثور على فروع مطابقة للبحث</p>
                <p className="text-xs">جرب تغيير كلمة البحث أو أضف فرعاً جديداً للشركة</p>
              </div>
            ) : (
              paginatedBranches.map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {b.code || `BR-${b.id}`}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-1">{b.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.city} {b.address ? `• ${b.address}` : ''}</span>
                        </p>
                      </div>

                      <span className={`w-3 h-3 rounded-full ${b.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                      {b.phone && (
                        <p className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.phone}</span>
                        </p>
                      )}
                      {b.managerName && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>المدير: {b.managerName}</span>
                        </p>
                      )}
                      <p className="text-[11px] font-bold text-indigo-600 pt-1">
                        عدد الموظفين المعينين: {b.employees?.length || 0} موظف
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 mt-4">
                    <button
                      onClick={() => {
                        setEditingBranch(b);
                        setBranchForm({
                          name: b.name || '',
                          code: b.code || '',
                          city: b.city || 'عمان',
                          address: b.address || '',
                          phone: b.phone || '',
                          phone2: b.phone2 || '',
                          managerName: b.managerName || '',
                          notes: b.notes || '',
                          isActive: b.isActive
                        });
                        setBranchModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                      title="تعديل الفرع"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteBranch(b.id, b.name)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                      title="حذف الفرع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* شريط ترقيم الفروع */}
          {!loading && filteredBranches.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {renderPagination(
                currentPageBranches,
                totalBranchesPages,
                filteredBranches.length,
                itemsPerPageBranches,
                setItemsPerPageBranches,
                setCurrentPageBranches,
                "فرع"
              )}
            </div>
          )}
        </div>
      ) : (
        /* قائمة الموظفين */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto opacity-30 text-slate-500 mb-2" />
              <p className="font-bold text-slate-700">لم يتم العثور على موظفين مطابقين للبحث</p>
              <p className="text-xs">جرب البحث بكلمة أخرى أو أضف موظفاً جديداً لفرع</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-black">
                    <th className="p-4">اسم الموظف</th>
                    <th className="p-4">اسم المستخدم</th>
                    <th className="p-4">الفرع المعين فيه</th>
                    <th className="p-4">الراتب الشهري</th>
                    <th className="p-4">البريد الإلكتروني</th>
                    <th className="p-4">رقم الهاتف</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-black text-slate-900">{emp.name}</td>
                      <td className="p-4 font-mono font-bold text-indigo-600">@{emp.username}</td>
                      <td className="p-4 font-bold text-slate-700">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200">
                          {emp.branch?.name || `فرع #${emp.branchId}`}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-700">
                        {emp.salary ? `${parseFloat(emp.salary).toFixed(3)} د.أ` : 'غير محدد'}
                      </td>
                      <td className="p-4 font-mono text-slate-600 text-[11px]">
                        {emp.email || <span className="text-slate-400 italic">لا يوجد</span>}
                      </td>
                      <td className="p-4 font-mono">{emp.phone || '—'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          emp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {emp.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setEmployeeForm({
                                branchId: emp.branchId || '',
                                name: emp.name || '',
                                username: emp.username || '',
                                password: '', // تبقى فارغة إذا لم يرد التغيير
                                phone: emp.phone || '',
                                email: emp.email || '',
                                salary: emp.salary !== undefined && emp.salary !== null ? emp.salary : '',
                                nationalId: emp.nationalId || '',
                                isActive: emp.isActive
                              });
                              setEmployeeModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
                            title="تعديل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200"
                            title="حذف"
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
          )}

          {/* شريط ترقيم الموظفين */}
          {!loading && filteredEmployees.length > 0 && renderPagination(
            currentPageEmployees,
            totalEmployeesPages,
            filteredEmployees.length,
            itemsPerPageEmployees,
            setItemsPerPageEmployees,
            setCurrentPageEmployees,
            "موظف"
          )}
        </div>
      )}

      {/* نافذة إضافة / تعديل فرع */}
      {branchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-right">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              {editingBranch ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد'}
            </h3>

            <form onSubmit={handleSaveBranch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الفرع *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرع عمان - أبو نصير"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">كود الفرع</label>
                  <input
                    type="text"
                    placeholder="BR-01"
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المدينة</label>
                  <input
                    type="text"
                    value={branchForm.city}
                    onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">العنوان التفصيلي</label>
                <input
                  type="text"
                  placeholder="مثال: الشارع الرئيسي - بجانب محمص الشعب"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">هاتف الفرع</label>
                  <input
                    type="text"
                    placeholder="0795109323"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم مدير الفرع</label>
                  <input
                    type="text"
                    placeholder="اسم المسؤول"
                    value={branchForm.managerName}
                    onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="branchActive"
                  checked={branchForm.isActive}
                  onChange={(e) => setBranchForm({ ...branchForm, isActive: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <label htmlFor="branchActive" className="text-xs font-bold text-slate-800">
                  فرع نشط ومتاح للعمل
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBranchModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow"
                >
                  حفظ الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة إضافة / تعديل موظف فرع */}
      {employeeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-right">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              {editingEmployee ? 'تعديل بيانات موظف الفرع' : 'إضافة موظف فرع جديد'}
            </h3>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الفرع المخصص *</label>
                <select
                  required
                  value={employeeForm.branchId}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, branchId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-800"
                >
                  <option value="">-- اختر الفرع --</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الموظف ثلاثي *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد علي..."
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المستخدم للدخول *</label>
                  <input
                    type="text"
                    required
                    placeholder="username"
                    value={employeeForm.username}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {editingEmployee ? 'كلمة المرور (اتركها فارغة للتخطي)' : 'كلمة المرور *'}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الراتب الشهري (د.أ)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="مثال: 450.000"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-slate-800 text-emerald-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">يرتبط به الحد الأقصى المسموح للسلف</span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني للإشعارات</label>
                  <input
                    type="email"
                    placeholder="employee@example.com"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">يستقبل إشعار الرد على طلبات السلف</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    placeholder="07XXXXXXXX"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الرقم الوطني / الهوية</label>
                  <input
                    type="text"
                    placeholder="99XXXXXXXX"
                    value={employeeForm.nationalId}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, nationalId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="empActive"
                  checked={employeeForm.isActive}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, isActive: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <label htmlFor="empActive" className="text-xs font-bold text-slate-800">
                  تفعيل حساب الموظف (يمكنه تسجيل الدخول فوراً)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEmployeeModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow"
                >
                  حفظ بيانات الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default BranchesManagement;
