import React from 'react';
import { Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { EliteDiamondIcon } from '../components/EliteDiamondLogo';

/**
 * مكون الفاتورة الرسمية لمصوغات ELITE SILVER 925
 * تصميم مطابق بدقة للدفتر الورقي الأصلي (الصورة رقم 2)
 */
function InvoiceDocument({
  invoiceData = {},
  onChange,
  readOnly = false,
  onPrint,
  onSave,
  saving = false
}) {
  const safeData = invoiceData || {};

  // تحليل آمن لبيانات الأصناف سواء كانت Array أو JSON String أو فارغة
  const parseItems = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const parsedItems = parseItems(safeData.items);
  const defaultItems = [
    { id: 1, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    { id: 2, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    { id: 3, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    { id: 4, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    { id: 5, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    { id: 6, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
    { id: 7, type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' },
  ];

  const items = parsedItems.length > 0 ? parsedItems : (readOnly ? [] : defaultItems);

  // استخراج رقم الفاتورة مع ضمان عدم ظهوره كقيمة غير معروفة (undefined) والبدء من 0001
  const invoiceNumber = safeData.invoiceNumber || safeData.nextNumber || safeData.invoice_number || (safeData.id ? String(safeData.id).padStart(4, '0') : '0001');
  const date = safeData.date || new Date().toISOString().split('T')[0];
  const paymentType = safeData.paymentType || 'نقدي';
  const customerName = safeData.customerName || '';
  const customerPhone = safeData.customerPhone || '';
  const subtotal = safeData.subtotal !== undefined ? safeData.subtotal : '0.000';
  const discount = safeData.discount !== undefined ? safeData.discount : '0.000';
  const total = safeData.total !== undefined ? safeData.total : '0.000';
  const recipientName = safeData.recipientName || '';

  // قائمة الأكواد الدولية الشائعة (الأردن افتراضي)
  const countryCodes = [
    { code: '+962', label: 'الأردن (+962)', flag: '🇯🇴' },
    { code: '+970', label: 'فلسطين (+970)', flag: '🇵🇸' },
    { code: '+966', label: 'السعودية (+966)', flag: '🇸🇦' },
    { code: '+971', label: 'الإمارات (+971)', flag: '🇦🇪' },
    { code: '+965', label: 'الكويت (+965)', flag: '🇰🇼' },
    { code: '+974', label: 'قطر (+974)', flag: '🇶🇦' },
    { code: '+968', label: 'عُمان (+968)', flag: '🇴🇲' },
    { code: '+973', label: 'البحرين (+973)', flag: '🇧🇭' },
    { code: '+20', label: 'مصر (+20)', flag: '🇪🇬' },
  ];

  // استخراج الكود الدولي ورقم الهاتف المكون من 9 أرقام
  const phoneCountryCode = safeData.phoneCountryCode || '+962';
  let phoneDigits = safeData.phoneDigits || '';
  if (!safeData.phoneDigits && safeData.customerPhone) {
    let raw = String(safeData.customerPhone).replace(/\D/g, '');
    if (raw.startsWith('962')) raw = raw.slice(3);
    if (raw.startsWith('0')) raw = raw.slice(1);
    phoneDigits = raw.slice(0, 9);
  }

  const handlePhoneDigitsChange = (digits) => {
    let clean = String(digits).replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = clean.slice(1);
    }
    clean = clean.slice(0, 9);
    const fullPhone = clean ? `${phoneCountryCode}${clean}` : '';
    if (onChange) {
      onChange({
        ...safeData,
        invoiceNumber: safeData.invoiceNumber || invoiceNumber,
        phoneDigits: clean,
        phoneCountryCode: phoneCountryCode,
        customerPhone: fullPhone
      });
    }
  };

  const handleCountryCodeChange = (newCode) => {
    const fullPhone = phoneDigits ? `${newCode}${phoneDigits}` : '';
    if (onChange) {
      onChange({
        ...safeData,
        invoiceNumber: safeData.invoiceNumber || invoiceNumber,
        phoneCountryCode: newCode,
        phoneDigits: phoneDigits,
        customerPhone: fullPhone
      });
    }
  };

  const handleFieldChange = (field, value) => {
    if (readOnly || !onChange) return;
    onChange({
      ...safeData,
      invoiceNumber: safeData.invoiceNumber || invoiceNumber,
      [field]: value
    });
  };

  // دالة مساعدة لتقسيم الأجرة إلى دينار وفلس
  const splitFeeToDinarAndFils = (fee) => {
    if (fee === '' || fee === null || fee === undefined) {
      return { priceDinar: '', priceFils: '' };
    }
    const cleanFee = String(fee).replace(',', '.').trim();
    const num = parseFloat(cleanFee);
    if (isNaN(num)) {
      return { priceDinar: '', priceFils: '' };
    }
    const fixed = Math.max(0, num).toFixed(3);
    const [dinarPart, filsPart] = fixed.split('.');
    return {
      priceDinar: String(parseInt(dinarPart, 10)),
      priceFils: filsPart || '000'
    };
  };

  const handleItemChange = (index, field, value) => {
    if (readOnly || !onChange) return;
    const newItems = [...items];
    const currentItem = { ...newItems[index] };
    currentItem[field] = value;

    // 1. إذا تم تغيير العدد أو الوزن (لكل قطعة) أو سعر الغرام
    // تُحسب الأجرة تلقائياً = عدد * الوزن لكل قطعة * سعر الغرام
    if (field === 'count' || field === 'makerFeeGram' || field === 'gramPrice') {
      const countVal = field === 'count' ? value : (currentItem.count || '');
      const weightVal = field === 'makerFeeGram' ? value : (currentItem.makerFeeGram || '');
      const priceVal = field === 'gramPrice' ? value : (currentItem.gramPrice || '');

      const cleanCount = String(countVal).trim();
      const cleanWeight = String(weightVal).replace(',', '.').trim();
      const cleanPrice = String(priceVal).replace(',', '.').trim();

      if (cleanWeight !== '' && cleanPrice !== '') {
        const c = parseFloat(cleanCount) > 0 ? parseFloat(cleanCount) : 1;
        const w = parseFloat(cleanWeight);
        const p = parseFloat(cleanPrice);
        if (!isNaN(w) && !isNaN(p)) {
          const calcFee = c * w * p;
          const feeStr = Number.isInteger(calcFee) ? calcFee.toString() : calcFee.toFixed(3);
          currentItem.totalFee = feeStr;

          // فلس ودينار يعتمدان تلقائياً على الأجرة المحسوبة
          const { priceDinar, priceFils } = splitFeeToDinarAndFils(calcFee);
          currentItem.priceDinar = priceDinar;
          currentItem.priceFils = priceFils;
        }
      } else if (cleanWeight === '' || cleanPrice === '') {
        // عند تفريغ أحدهما يتم تفريغ الحسابات التلقائية التابعة
        currentItem.totalFee = '';
        currentItem.priceDinar = '';
        currentItem.priceFils = '';
      }
    }

    // 2. إذا تم إدخال أو تعديل الأجرة مباشرة
    if (field === 'totalFee') {
      const cleanFee = String(value).replace(',', '.').trim();
      if (cleanFee === '') {
        currentItem.priceDinar = '';
        currentItem.priceFils = '';
      } else {
        const feeNum = parseFloat(cleanFee);
        if (!isNaN(feeNum)) {
          const { priceDinar, priceFils } = splitFeeToDinarAndFils(feeNum);
          currentItem.priceDinar = priceDinar;
          currentItem.priceFils = priceFils;
        }
      }
    }

    // 3. إذا تم تعديل دينار أو فلس مباشرة
    if (field === 'priceDinar' || field === 'priceFils') {
      const d = field === 'priceDinar' ? value : (currentItem.priceDinar || '');
      const f = field === 'priceFils' ? value : (currentItem.priceFils || '');
      if (d !== '' || f !== '') {
        const dNum = parseFloat(d) || 0;
        const fNum = parseFloat(f) || 0;
        const combined = dNum + (fNum / 1000);
        currentItem.totalFee = Number.isInteger(combined) ? combined.toString() : combined.toFixed(3);
      } else {
        currentItem.totalFee = '';
      }
    }

    newItems[index] = currentItem;

    // حساب المجاميع تلقائياً بناءً على الدنانير والفلسات
    let sumDinar = 0;
    let sumFils = 0;
    newItems.forEach(it => {
      const d = parseFloat(it.priceDinar) || 0;
      const f = parseFloat(it.priceFils) || 0;
      sumDinar += d;
      sumFils += f;
    });

    const calculatedSubtotal = (sumDinar + (sumFils / 1000)).toFixed(3);
    const disc = parseFloat(safeData.discount) || 0;
    const calculatedTotal = Math.max(0, parseFloat(calculatedSubtotal) - disc).toFixed(3);

    onChange({
      ...safeData,
      invoiceNumber: safeData.invoiceNumber || invoiceNumber,
      items: newItems,
      subtotal: calculatedSubtotal,
      total: calculatedTotal
    });
  };

  const handleDiscountChange = (val) => {
    if (readOnly || !onChange) return;
    const disc = parseFloat(val) || 0;
    const subt = parseFloat(subtotal) || 0;
    const calculatedTotal = Math.max(0, subt - disc).toFixed(3);
    onChange({
      ...safeData,
      invoiceNumber: safeData.invoiceNumber || invoiceNumber,
      discount: val,
      total: calculatedTotal
    });
  };

  const addRow = () => {
    if (readOnly || !onChange) return;
    onChange({
      ...safeData,
      invoiceNumber: safeData.invoiceNumber || invoiceNumber,
      items: [
        ...items,
        { id: Date.now(), type: '', count: '', karat: '925', makerFeeGram: '', gramPrice: '', totalFee: '', priceDinar: '', priceFils: '' }
      ]
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* أزرار الإجراءات في العرض (تختفي عند الطباعة) */}
      {!readOnly && (
        <div className="w-full max-w-[950px] mb-4 flex items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">طريقة الدفع:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange('paymentType', 'نقدي')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${paymentType === 'نقدي'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                نقدي
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('paymentType', 'فيزا')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${paymentType === 'فيزا'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                فيزا
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addRow}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            >
              + إضافة سطر
            </button>
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 shadow"
              >
                🖨️ طباعة الفاتورة
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="px-5 py-1.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : '💾 حفظ الفاتورة'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ورقة الفاتورة الرسمية (A4 Format) */}
      <div
        id="invoice-paper"
        className="invoice-paper-sheet bg-white text-slate-900 w-full max-w-[950px] p-6 sm:p-10 border-2 border-slate-800 shadow-2xl relative font-cairo print:p-4 print:border-none print:shadow-none print:w-full print:max-w-none"
        dir="rtl"
        style={{ minHeight: '1050px' }}
      >
        {/* خلفية العلامة المائية الهندسية في المنتصف كما في الأصل */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <div className="w-[450px] h-[450px] border-[16px] border-slate-900 rotate-45 flex items-center justify-center">
            <div className="w-[300px] h-[300px] border-[12px] border-slate-900 flex items-center justify-center">
              <div className="w-[150px] h-[150px] border-[8px] border-slate-900" />
            </div>
          </div>
        </div>

        {/* 1. الترويسة الرئيسية للفاتورة (مطابقة للصورة رقم 2) */}
        <div className="border-b-2 border-slate-900 pb-5 mb-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

            {/* يمين: أرقام التواصل وعناوين الفروع */}
            <div className="text-right text-[11px] leading-relaxed text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold font-mono text-slate-900 text-xs dir-ltr justify-end">
                <span>0795109323</span>
                <span>•</span>
                <span>078504817</span>
                <span>•</span>
                <span>0782261996</span>
                <Phone className="w-3.5 h-3.5 text-slate-900" />
              </div>
              <div className="flex items-center gap-1.5 justify-end text-[10px] font-mono text-slate-800">
                <span>Elite.silver925</span>
                <Instagram className="w-3 h-3 text-slate-700" />
                <span className="mr-2">Elite Silver</span>
                <Facebook className="w-3 h-3 text-slate-700" />
              </div>
              <p className="flex items-start gap-1 justify-end text-[10px] font-bold text-slate-800">
                <span>عمان أبو نصير - الشارع الرئيسي - بجانب محمص الشعب</span>
                <MapPin className="w-3 h-3 text-slate-700 flex-shrink-0 mt-0.5" />
              </p>
              <p className="flex items-start gap-1 justify-end text-[10px] font-bold text-slate-800">
                <span>عمان - خلدا - شارع وصفي التل - مقابل مخابز فورنجي</span>
                <MapPin className="w-3 h-3 text-slate-700 flex-shrink-0 mt-0.5" />
              </p>
            </div>

            {/* منتصف: الشعار والاسم والنوع */}
            <div className="text-center flex flex-col items-center justify-center">
              {/* الشعار الهندسي الماسي الرسمي */}
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black tracking-widest text-slate-950 font-serif">
                  ELITƎ
                </h1>
              </div>
              <p> SILVER 925</p>
              <div className="mt-2.5 inline-flex items-center gap-2 border-2 border-slate-900 px-4 py-0.5 rounded-full">
                <span className="text-xs font-black">فاتورة</span>
                <span className="text-xs font-bold text-slate-700">
                  {paymentType === 'نقدي' ? 'نقدي' : 'فيزا'}
                </span>
              </div>
            </div>

            {/* يسار: رقم الفاتورة الأحمر، التاريخ، السيد، الهاتف */}
            <div className="text-left space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                <span className="text-xs font-bold text-slate-600">الرقم:</span>
                <span className="text-xl font-mono font-black text-rose-600 tracking-wider">
                  {invoiceNumber}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                <span className="text-xs font-bold text-slate-600">التاريخ:</span>
                {readOnly ? (
                  <span className="text-xs font-mono font-bold">{date}</span>
                ) : (
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className="text-xs font-mono font-bold text-left bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  />
                )}
              </div>

              <div className="flex flex-col border-b border-slate-300 pb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">السيد:</span>
                  {readOnly ? (
                    <span className="text-xs font-bold">{customerName || '—'}</span>
                  ) : (
                    <input
                      type="text"
                      value={customerName}
                      placeholder="اسم المشتري (الاسم ثنائي على الأقل)..."
                      onChange={(e) => handleFieldChange('customerName', e.target.value)}
                      className="w-full text-xs font-bold bg-transparent border-none focus:outline-none p-0 text-slate-900 placeholder:text-slate-300"
                    />
                  )}
                </div>
                {!readOnly && customerName && customerName.trim().split(/\s+/).filter(Boolean).length < 2 && (
                  <span className="text-[10px] text-amber-600 font-bold mt-0.5" dir="rtl">
                    ⚠️ يرجى كتابة الاسم ثنائي على الأقل (مثال: محمد أحمد)
                  </span>
                )}
              </div>

              <div className="flex flex-col border-b border-slate-300 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">هاتف:</span>
                  {readOnly ? (
                    <span className="text-xs font-mono font-bold" dir="ltr">{safeData.customerPhone || '—'}</span>
                  ) : (
                    <div className="flex items-center gap-1 w-full" dir="ltr">
                      {/* كود الدولة التلقائي */}
                      <select
                        value={phoneCountryCode}
                        onChange={(e) => handleCountryCodeChange(e.target.value)}
                        className="bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-mono font-bold rounded-lg px-1.5 py-0.5 focus:outline-none"
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>

                      {/* 9 أرقام للهاتف */}
                      <input
                        type="tel"
                        maxLength={9}
                        value={phoneDigits}
                        placeholder="7XXXXXXXX (9 أرقام)"
                        onChange={(e) => handlePhoneDigitsChange(e.target.value)}
                        className="w-full text-xs font-mono font-bold bg-transparent border-none focus:outline-none p-0 text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                  )}
                </div>
                {!readOnly && phoneDigits && phoneDigits.length !== 9 && (
                  <span className="text-[10px] text-amber-600 font-bold mt-0.5" dir="rtl">
                    ⚠️ رقم الهاتف يجب أن يتكون من 9 أرقام (أدخلت {phoneDigits.length} من 9)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. الجدول الرئيسي للأصناف (يبدأ بالعدد أولاً، الوزن لكل قطعة) */}
        <div className="overflow-x-auto relative z-10 mb-5">
          {/* علامة مائية لشعار النخبة في وسط الجدول (مطابقة للصورة 2) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] z-0 overflow-hidden">
            <EliteDiamondIcon className="w-72 h-72 text-slate-950" strokeWidth={1.5} />
          </div>
          <table className="w-full border-collapse border-2 border-slate-900 text-center text-xs relative z-10">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-black border-b-2 border-slate-900">
                <th className="border-r border-slate-900 p-2 w-12">عدد</th>
                <th className="border-r border-slate-900 p-2 text-right w-1/4">نوع</th>
                <th className="border-r border-slate-900 p-2 w-14">عيار</th>
                <th className="border-r border-slate-900 p-2 w-24">الوزن (لكل قطعة)</th>
                <th className="border-r border-slate-900 p-2 w-20">سعر الغرام</th>
                <th className="border-r border-slate-900 p-2 w-20">الأجرة</th>
                <th className="p-1 w-28" colSpan={2}>
                  <div className="border-b border-slate-900 pb-1 font-black">القيمة الإجمالية</div>
                  <div className="grid grid-cols-2 pt-1 font-bold">
                    <span className="border-l border-slate-900">فلس</span>
                    <span>دينار</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-slate-400 hover:bg-slate-50/50">
                  {/* عدد (يبدأ بالعدد أولاً) */}
                  <td className="border-r border-slate-900 p-1.5">
                    {readOnly ? (
                      <span className="font-mono">{row.count}</span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        value={row.count}
                        onChange={(e) => handleItemChange(idx, 'count', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono p-0"
                      />
                    )}
                  </td>

                  {/* نوع */}
                  <td className="border-r border-slate-900 p-1.5 text-right">
                    {readOnly ? (
                      <span className="font-bold">{row.type || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.type}
                        placeholder="خاتم، سلسال، سوار..."
                        onChange={(e) => handleItemChange(idx, 'type', e.target.value)}
                        className="w-full bg-transparent border-none focus:outline-none text-xs font-semibold p-0 text-slate-900"
                      />
                    )}
                  </td>

                  {/* عيار */}
                  <td className="border-r border-slate-900 p-1.5">
                    {readOnly ? (
                      <span className="font-mono font-bold">{row.karat}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.karat}
                        onChange={(e) => handleItemChange(idx, 'karat', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono font-bold p-0"
                      />
                    )}
                  </td>

                  {/* الوزن */}
                  <td className="border-r border-slate-900 p-1.5">
                    {readOnly ? (
                      <span className="font-mono">{row.makerFeeGram || row.weight || '—'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.makerFeeGram !== undefined ? row.makerFeeGram : (row.weight || '')}
                        placeholder="0.0"
                        onChange={(e) => handleItemChange(idx, 'makerFeeGram', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono p-0"
                      />
                    )}
                  </td>

                  {/* سعر الغرام */}
                  <td className="border-r border-slate-900 p-1.5">
                    {readOnly ? (
                      <span className="font-mono">{row.gramPrice}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.gramPrice}
                        placeholder="0.0"
                        onChange={(e) => handleItemChange(idx, 'gramPrice', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono p-0"
                      />
                    )}
                  </td>

                  {/* الأجرة */}
                  <td className="border-r border-slate-900 p-1.5 bg-slate-50/20">
                    {readOnly ? (
                      <span className="font-mono font-semibold">{row.totalFee}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.totalFee}
                        placeholder="0.000"
                        onChange={(e) => handleItemChange(idx, 'totalFee', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono font-semibold p-0"
                      />
                    )}
                  </td>

                  {/* فلس */}
                  <td className="border-r border-slate-900 p-1.5 w-14 bg-slate-50/30">
                    {readOnly ? (
                      <span className="font-mono">{row.priceFils !== '' && row.priceFils !== undefined ? row.priceFils : '000'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.priceFils}
                        placeholder="000"
                        onChange={(e) => handleItemChange(idx, 'priceFils', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono p-0"
                      />
                    )}
                  </td>

                  {/* دينار */}
                  <td className="border-r border-slate-900 p-1.5 w-14 bg-slate-50/30">
                    {readOnly ? (
                      <span className="font-mono font-black">{row.priceDinar !== '' && row.priceDinar !== undefined ? row.priceDinar : '0'}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.priceDinar}
                        placeholder="0"
                        onChange={(e) => handleItemChange(idx, 'priceDinar', e.target.value)}
                        className="w-full text-center bg-transparent border-none focus:outline-none text-xs font-mono font-black p-0"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. الجزء السفلي: المجموع، الخصم، الإجمالي، وتوقيع المستلم */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end relative z-10 pt-4 border-t border-slate-300">

          {/* يمين: اسم المستلم وتوقيعه */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 whitespace-nowrap">اسم المستلم وتوقيعه:</span>
              {readOnly ? (
                <span className="text-xs font-bold border-b border-slate-800 flex-1 pb-1">{recipientName || '—'}</span>
              ) : (
                <input
                  type="text"
                  value={recipientName}
                  placeholder="اسم المستلم وتوقيعه..."
                  onChange={(e) => handleFieldChange('recipientName', e.target.value)}
                  className="flex-1 text-xs font-bold bg-transparent border-b border-slate-800 focus:outline-none pb-1"
                />
              )}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              * البضاعة المباعة لا ترد ولا تستبدل إلا بموجب الفاتورة الرسمية وخلال المدة القانونية.
            </p>
          </div>

          {/* يسار: جدول الحسابات النهائي (المجموع، خصم، الإجمالي) */}
          <div className="flex justify-end">
            <div className="w-64 border-2 border-slate-900 rounded-lg overflow-hidden text-xs">
              <div className="flex items-center justify-between p-2 border-b border-slate-900 bg-slate-50">
                <span className="font-bold text-slate-800">المجموع:</span>
                <span className="font-mono font-bold text-slate-900">{subtotal} د.أ</span>
              </div>
              <div className="flex items-center justify-between p-2 border-b border-slate-900 bg-white">
                <span className="font-bold text-slate-800">خصم:</span>
                {readOnly ? (
                  <span className="font-mono font-bold text-slate-600">{discount} د.أ</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="any"
                      value={discount}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      className="w-20 text-left bg-slate-100 rounded px-1.5 py-0.5 font-mono text-xs font-bold focus:outline-none"
                    />
                    <span className="text-[10px] font-mono">د.أ</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-900 text-white font-black text-sm">
                <span>الإجمالي:</span>
                <span className="font-mono text-base">{total} د.أ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDocument;
