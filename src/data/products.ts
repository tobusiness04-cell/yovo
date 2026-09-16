import { Product } from '../types';

/**
 * Centralized Products Data Store
 * 
 * You can freely add, remove, modify, or disable products here.
 * Prices, durations, descriptions, features, and plans will automatically
 * update across all cards, modals, and messaging templates without any layout code changes.
 */
export const initialProducts: Product[] = [
  {
    id: 'canva-pro',
    name: 'Canva Pro',
    category: 'تصميم',
    categorySlug: 'design',
    description: 'أدوات تصميم احترافية وقوالب ومميزات إضافية.',
    price: 450,
    currency: 'دج',
    duration: 'شهري',
    available: true,
    popular: true,
    activationTime: '15 - 30 دقيقة',
    guarantee: 'ضمان كامل طيلة مدة الاشتراك مع استبدال فوري أو حل أي مشكلة.',
    brandColor: 'sky',
    features: [
      'الوصول لأكثر من 100 مليون صورة وقالب وفيديو بريميوم',
      'إزالة خلفيات الصور والفيديو بضغطة زر واحدة',
      'تغيير مقاسات التصاميم تلقائياً (Magic Resize)',
      'مساحة تخزين سحابية 1TB لحفظ تصاميمك',
      'جدولة النشر المباشر على منصات التواصل الاجتماعي',
      'تنزيل التصاميم بأعلى دقة وخلفية شفافة'
    ],
    plans: [
      { id: 'canva-1m', duration: 'شهري', price: 450, available: true },
      { id: 'canva-3m', duration: '3 أشهر', price: 1200, available: true, popular: true, note: 'الأكثر طلباً' },
      { id: 'canva-6m', duration: '6 أشهر', price: 2100, available: true },
      { id: 'canva-1y', duration: 'عام', price: 3600, available: true, note: 'توفير أكبر' },
    ],
  },
  {
    id: 'capcut-pro',
    name: 'CapCut Pro',
    category: 'مونتاج',
    categorySlug: 'editing',
    description: 'مميزات وأدوات إضافية لتحرير الفيديو وصناعة المحتوى.',
    price: 700,
    currency: 'دج',
    duration: 'شهري',
    available: true,
    popular: true,
    activationTime: 'خلال 20 دقيقة',
    guarantee: 'ضمان تفعيل الحساب الرسمي ومتابعة مستمرة طيلة فترة الاشتراك.',
    brandColor: 'emerald',
    features: [
      'جميع فلاتر وتأثيرات Pro الحصرية بدون علامة مائية',
      'إزالة الخلفيات الذكية وتتبع الحركة التلقائي (Tracking)',
      'توليد التسميات التوضيحية والترجمة التلقائية (Auto Captions)',
      'تصدير الفيديو بجودة فائقة 4K و 60 إطار في الثانية',
      'مكتبة صوتيات ومؤثرات سينمائية غير محدودة',
      'مزامنة المشاريع وسرعة في المعالجة'
    ],
    plans: [
      { id: 'capcut-1m', duration: 'شهري', price: 700, available: true },
      { id: 'capcut-3m', duration: '3 أشهر', price: 1900, available: true, popular: true, note: 'خيار موصى به' },
      { id: 'capcut-6m', duration: '6 أشهر', price: 3400, available: true },
      { id: 'capcut-1y', duration: 'عام', price: 5800, available: true, note: 'الأكثر توفيراً' },
    ],
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    category: 'AI',
    categorySlug: 'ai',
    description: 'وصول غير محدود لأحدث نماذج الذكاء الاصطناعي مع سرعة واستجابة عالية.',
    price: 2800,
    currency: 'دج',
    duration: 'شهري',
    available: true,
    popular: false,
    activationTime: 'خلال 30 دقيقة',
    guarantee: 'ضمان الحساب الرسمي والوصول المتواصل طيلة المدة المحددة.',
    brandColor: 'teal',
    features: [
      'أولوية الوصول لنماذج GPT-4o ونماذج التفكير المتقدمة',
      'تحليل وتلخيص ملفات PDF والمستندات والجداول الضخمة',
      'توليد الصور المتقدمة بدقة فائقة عبر DALL·E',
      'إنشاء وتخصيص نماذج GPTs المخصصة لمهامك اليومية',
      'ميزة البحث الحي في الويب للحصول على أحدث المعلومات',
      'سرعة استجابة فائقة حتى في أوقات الذروة'
    ],
    plans: [
      { id: 'chatgpt-1m', duration: 'شهري', price: 2800, available: true, popular: true },
      { id: 'chatgpt-3m', duration: '3 أشهر', price: 7600, available: true, note: 'سعر خاص' },
    ],
  },
  {
    id: 'notion-plus',
    name: 'Notion Plus + AI',
    category: 'إنتاجية',
    categorySlug: 'productivity',
    description: 'مساحة عمل متكاملة لتنظيم مهامك، مشاريعك، وملاحظاتك مع الذكاء الاصطناعي.',
    price: 950,
    currency: 'دج',
    duration: 'شهري',
    available: true,
    popular: false,
    activationTime: 'خلال 30 دقيقة',
    guarantee: 'ضمان التفعيل وحل أي استفسار تقني في الإعداد.',
    brandColor: 'indigo',
    features: [
      'صفحات وبلوكات عمل غير محدودة بدون قيود',
      'مساعد الذكاء الاصطناعي للكتابة والتلخيص وتنظيم الأفكار',
      'مزامنة فورية بين الهاتف والحاسوب والمتصفح',
      'قواعد بيانات متقدمة مع طرق عرض متعددة (Kanban, Calendar, Table)',
      'مشاركة وتنسيق العمل مع الفريق'
    ],
    plans: [
      { id: 'notion-1m', duration: 'شهري', price: 950, available: true },
      { id: 'notion-3m', duration: '3 أشهر', price: 2500, available: true },
      { id: 'notion-1y', duration: 'عام', price: 6200, available: true, note: 'خصم العام' },
    ],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'AI',
    categorySlug: 'ai',
    description: 'أقوى أداة لتوليد الصور الإبداعية والواقعية عبر الذكاء الاصطناعي.',
    price: 2400,
    currency: 'دج',
    duration: 'شهري',
    available: true,
    popular: false,
    activationTime: 'خلال 45 دقيقة',
    guarantee: 'ضمان وصول للحساب وسيرفر العمل طيلة الشهر.',
    brandColor: 'purple',
    features: [
      'ساعات توليد سريع Fast GPU لتنفيذ الأفكار فوراً',
      'صور واقعية وفنية بدقة فائقة الجودة',
      'معرض خاص لحفظ وتصفح جميع أعمالك المولدة',
      'تعديل وتوسيع تفاصيل الصور بذكاء'
    ],
    plans: [
      { id: 'midjourney-1m', duration: 'شهري', price: 2400, available: true, popular: true },
      { id: 'midjourney-3m', duration: '3 أشهر', price: 6500, available: true },
    ],
  },
  {
    id: 'duolingo-super',
    name: 'Duolingo Super',
    category: 'إنتاجية',
    categorySlug: 'productivity',
    description: 'تعلم اللغات بقلوب غير محدودة وبدون إعلانات مع تمارين مخصصة.',
    price: 600,
    currency: 'دج',
    duration: 'شهري',
    available: false, // Showcasing unavailable state as requested
    popular: false,
    activationTime: 'خلال 24 ساعة',
    guarantee: 'ضمان الحساب الشخصي طيلة الفترة المحددة.',
    brandColor: 'amber',
    features: [
      'قلوب غير محدودة للتعلم والممارسة بدون توقف',
      'تجربة خالية تماماً من الإعلانات',
      'مراجعة شخصية للأخطاء ورفع مستوى التحدث',
      'تحديات واختبارات مستوى إضافية'
    ],
    plans: [
      { id: 'duo-1m', duration: 'شهري', price: 600, available: false },
      { id: 'duo-6m', duration: '6 أشهر', price: 1700, available: false },
      { id: 'duo-1y', duration: 'عام', price: 2900, available: false },
    ],
  },
];
