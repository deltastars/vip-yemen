# ViP Yemen - Supabase Backend Configuration

## 📋 نظرة عامة

هذا المجلد يحتوي على جميع ملفات قاعدة البيانات والإعدادات اللازمة للانتقال إلى منصة Supabase.

## 🗂️ هيكل المجلد

```
supabase/
├── config.toml                    # إعدادات Supabase المحلية
├── package.json                   # حزم Supabase
├── types.ts                       # أنواع TypeScript لقاعدة البيانات
├── README.md                      # هذه الملفة
├── migrations/
│   ├── 001_initial_schema.sql     # المخطط الرئيسي لقاعدة البيانات
│   └── 002_storage_buckets.sql    # أحجام التخزين
├── seed/
│   └── 001_initial_data.sql       # البيانات الأولية
└── functions/
    └── (Functions will be added here)
```

## 🚀 البدء السريع

### 1. تثبيت Supabase CLI

```bash
npm install -g supabase
```

### 2. تشغيل Supabase محلياً

```bash
cd supabase
supabase start
```

### 3. تطبيق المخطط على قاعدة البيانات

```bash
supabase db push
```

### 4. إدخال البيانات الأولية

```bash
supabase db seed
```

### 5. فتح Supabase Studio

```bash
supabase studio
```

سيتم فتح Supabase Studio على `http://localhost:54323`

## 📊 جداول قاعدة البيانات

### 1. users (المستخدمون)
- معلومات الحساب الأساسية
- الأدوار (admin, user, moderator)
- حالة الحساب

### 2. submissions (الطلبات)
- جميع أنواع الطلبات (توظيف، عقارات، منتجات، برمجيات)
- حالات المراجعة والنشر
- المرفقات والمعلومات التفصيلية

### 3. advertisements (الإعلانات الترويجية)
- إعلانات الشريط العلوي
- الجدولة والrenchiz
- الأولويات

### 4. offers (العروض)
- العروض الترويجية
- الأسعار والخصومات
- الصور والفيديوهات

### 5. site_assets (الأصول البصرية)
- الشعارات والأيقونات
- الصور والبانرات
- حالة النشر

### 6. site_themes (الثيمات)
- إعدادات الألوان
- تكوين الثيم
- الثيم النشط

### 7. site_sections (أقسام الموقع)
- محتوى الأقسام
- الترتيب والنشر
- المحتوى الديناميكي

### 8. contacts (جهات الاتصال)
- رسائل التواصل
- حالة الرد

### 9. notifications (الإشعارات)
- إشعارات المستخدمين
- الحالات والأولويات

### 10. activity_log (سجل النشاطات)
- تتبع جميع العمليات
- تفاصيل المستخدم والنشاط

### 11. settings (الإعدادات)
- إعدادات المنصة العامة
- معلومات الاتصال
- روابط التواصل الاجتماعي

## 🔐 أمان قاعدة البيانات

### Row Level Security (RLS)
تم تفعيل الأمان على مستوى الصفوف لجميع الجداول:

- **المستخدمون**: يمكنهم قراءة وتحديث بياناتهم فقط
- **الطلبات**: عامة للموافقة، خاصة للمالكين، كاملة للإدارة
- **العروض**: عامة للمنشورة، خاصة للإدارة
- **الإعلانات**: عامة للنشطة، خاصة للإدارة
- **الأصول البصرية**: عامة للمنشورة، خاصة للإدارة
- **جهات الاتصال**: خاصة للإدارة

### التخزين (Storage Buckets)
- **avatars**: صور المستخدمين (عامة للقراءة)
- **submissions**: مرفقات الطلبات (خاصة)
- **offers**: صور وفيديوهات العروض (عامة)
- **site-assets**: أصول الموقع (عامة)
- **organizations**: شعارات المؤسسات (عامة)

## 🔄 المزامنة مع المشروع الحالي

### 1. تحديث متغيرات البيئة

أضف في ملف `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. تحديث الاتصال بقاعدة البيانات

ستحتاج إلى:
1. إنشاء مشروع جديد على Supabase
2. تشغيل المخطط على قاعدة البيانات
3. تحديث متغيرات البيئة

### 3. المزامنة التدريجية

يمكنك المزامنة التدريجية:
1. أولاً: إنشاء قاعدة البيانات الجديدة
2. ثانياً: نقل البيانات من MySQL إلى PostgreSQL
3. ثالثاً: تحديث الكود للعمل مع Supabase
4. رابعاً: اختبار شامل قبل الإطلاق

## 📝 ملاحظات تقنية

### الفروقات بين MySQL و PostgreSQL

1. **الأنواع**: PostgreSQL يدعم JSON/JSONB بشكل أفضل
2. **الفهرسة**: PostgreSQL يدعم الفهارس المخصصة
3. **القيود**: PostgreSQL يدعم CHECK constraints بشكل كامل
4. **الأمان**: RLS في PostgreSQL أقوى من MySQL

### تحديث الكود

سيتعين تحديث:
1. `website/server/db.ts` - استبدال MySQL بـ Supabase Client
2. `website/server/routers.ts` - تحديث استعلامات tRPC
3. `website/client/src/lib/trpc.ts` - تحديث اتصال tRPC

## 🔗 روابط مفيدة

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)

## 📞 الدعم

لأي استفسارات تقنية:
- البريد: ViPservicesYemen@gmail.com
- واتساب: 00967711780999
