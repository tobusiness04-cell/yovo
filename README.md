# Yovo — متجر الاشتراكات الرقمية (Algeria)

موقع ويب عصري وواجهة هبوط احترافية لعلامة **Yovo** لبيع الاشتراكات الرقمية في الجزائر (Canva Pro، CapCut Pro، أدوات الذكاء الاصطناعي، والإنتاجية).

المشروع مصمم كـ **Static Frontend** سريع وخفيف مبني بـ React و TypeScript و Tailwind CSS، ومتوافق تماماً مع **Cloudflare Pages** وجميع منصات الاستضافة الثابتة بدون أي تبعيات لخادم أو قاعدة بيانات.

---

## 📁 هيكلة المشروع (File Structure)

```text
├── index.html                  # ملف المدخل الأساسي، إعدادات الخطوط (Cairo & Plus Jakarta Sans)، وميتا تاغ SEO
├── src/
│   ├── config.ts               # الإعدادات العامة (روابط WhatsApp، Instagram، العملة، النصوص القانونية)
│   ├── types.ts                # تعريفات TypeScript للبيانات والخطط والمنتجات
│   ├── data/
│   │   ├── products.ts         # قاعدة بيانات المنتجات، الأسعار، الخطط، والضمان
│   │   ├── faq.ts              # الأسئلة المتكررة وإجاباتها
│   │   └── testimonials.ts     # نماذج آراء وتقييمات العملاء
│   ├── lib/
│   │   └── formatters.ts       # أدوات تهيئة الأسعار وتوليد روابط المراسلة التلقائية
│   ├── components/
│   │   ├── Navbar.tsx          # شريط التنقل المتجاوب وقائمة الهاتف
│   │   ├── Hero.tsx            # القسم الرئيسي وهوية Yovo المستقلة
│   │   ├── ProductCatalog.tsx  # كتالوج المنتجات مع فلاتر التصنيفات والبحث
│   │   ├── ProductCard.tsx     # بطاقة المنتج مع مبدل الخطط الديناميكي
│   │   ├── ProductModal.tsx    # نافذة تفاصيل المنتج وطلب الخدمة
│   │   ├── WhyYovo.tsx         # مميزات Yovo والضمان حسب المنتج
│   │   ├── HowItWorks.tsx      # خطوات الطلب الـ 4
│   │   ├── TrustSection.tsx    # قسم الشفافية والثقة
│   │   ├── Testimonials.tsx    # آراء العملاء القابلة للتخصيص
│   │   ├── FAQ.tsx             # الأكورديون التفاعلي للأسئلة
│   │   ├── FinalCTA.tsx        # الدعوة النهائية للطلب
│   │   ├── Footer.tsx          # التذييل وروابط التواصل وإخلاء المسؤولية
│   │   └── ContactModal.tsx    # نافذة التواصل المباشر السريعة
│   ├── App.tsx                 # المكون الرئيسي وربط الحالات
│   ├── main.tsx                # نقطة الانطلاق البرمجية
│   └── index.css               # استيراد وتخصيص Tailwind CSS
├── package.json
└── vite.config.ts
```

---

## 🛠️ كيف تعدّل على المتجر؟

### 1. تغيير الأسعار أو إضافة/حذف منتجات
كل المنتجات مخزنة في ملف واحد:
👉 **`src/data/products.ts`**

- **لتغيير سعر أي اشتراك:** عدّل قيمة `price` داخل المنتج أو داخل قائمة `plans`.
- **لتغيير مدة:** عدّل `duration` (مثلاً: `"شهري"`, `"3 أشهر"`, `"عام"`).
- **لإيقاف منتج مؤقتاً:** غيّر `available: true` إلى `available: false`، وسيقوم الموقع تلقائياً بإظهار شارة *"غير متوفر حالياً"* وتعطيل زر الشراء.
- **لإضافة منتج جديد:** انسخ أي كائن داخل المصفوفة وأضف خصائصه وتصنيفه (`category`)، وسيظهر التصنيف والفلتر في الموقع بشكل آلي.

### 2. تغيير روابط WhatsApp و Instagram
👉 **`src/config.ts`**
- غيّر `whatsappUrl` إلى رقمك بصيغة: `https://wa.me/213XXXXXXXXX`
- غيّر `instagramUrl` إلى رابط صفحتك على إنستغرام.

### 3. تعديل نصوص الضمان أو الأسئلة الشائعة
- **الضمان لكل منتج:** في `src/data/products.ts` في حقل `guarantee`.
- **الأسئلة الشائعة:** في `src/data/faq.ts`.

---

## 🚀 التشغيل المحلي (Local Development)

```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev
```

---

## 🌐 النشر على Cloudflare Pages (Deployment)

1. ارفع المشروع على حسابك في GitHub أو GitLab.
2. ادخل إلى لوحة تحكم [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
3. اختر **Create application** > **Pages** > **Connect to Git**.
4. اختر المستودع الخاص بك واضبط إعدادات البناء (Build settings):
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. اضغط **Save and Deploy**. سيكون موقعك جاهزاً ويعمل بسرعة فائقة عالمياً مع شهادة SSL مجانية.
