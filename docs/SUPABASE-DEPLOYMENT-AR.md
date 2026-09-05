# دليل نشر الباك اند وقاعدة البيانات على Supabase — منصة ViP Yemen

> هذا الملف يوثق كيفية نقل وإدارة **جميع ملفات الباك اند وقاعدة البيانات** الخاصة بالمنصة إلى **Supabase** (PostgreSQL + Storage + Auth).

---

## 1) محتويات مجلد `supabase/`

| الملف | الوظيفة |
|---|---|
| `migrations/001_initial_schema.sql` | المخطط الكامل: 14 جدولًا + أنواع Enum |
| `migrations/002_storage_buckets.sql` | إنشاء دلائل التخزين: `submissions`, `offers`, `site-assets` |
| `seed/001_initial_data.sql` | البيانات الأولية (الإعدادات، الإعلانات الافتراضية) |
| `types.ts` | أنواع TypeScript المطابقة للمخطط |
| `config.toml` | إعدادات مشروع Supabase المحلي |
| `package.json` | أوامر `db:push`, `db:reset`, `db:seed`, `types:generate` |
| `README.md` | دليل البدء السريع |

**الجداول:** users · submissions · submission_attachments · advertisements · offers · offer_attachments · site_assets · site_themes · site_sections · site_content_revisions · contacts · notifications · activity_log · settings

---

## 2) النشر خطوة بخطوة

### المتطلبات
- حساب على [supabase.com](https://supabase.com)
- `supabase` CLI: `npm install -g supabase`

### الخطوات
```bash
# 1) ربط المشروع (مرة واحدة)
cd supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# 2) تطبيق المخطط والتخزين
supabase db push

# 3) البيانات الأولية
supabase db seed

# 4) توليد الأنواع المحدثة
supabase gen types typescript > types.ts
```

### الربط مع التطبيق (متغيرات البيئة)
أضف في Keys/إعدادات البيئة للمشروع:

| المتغير | القيمة |
|---|---|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | مفتاح anon العام من إعدادات المشروع |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح service_role (لعمليات الإدارة فقط — لا يُستخدم في الواجهة أبدًا) |

---

## 3) سياسات الأمان (RLS)

- جدول `submissions`: **الإنشاء عام** (أي مستخدم يقدّم طلبًا) — **القراءة/التعديل للإدارة فقط** حتى حالة `approved`.
- جدول `advertisements`/`offers`: القراءة العامة للأصناف `published` فقط؛ الكتابة للإدارة.
- جدول `contacts`: الإنشاء عام، القراءة للإدارة.
- جداول `site_*` و `notifications` و `activity_log`: الإدارة فقط.
- ملفات Storage: القراءة العامة للمرفقات المنشورة؛ الرفع عبر دالة Edge أو service role.

## 4) ملاحظات الانتقال

- التطبيق الحالي يعمل بلا خادم دائم (Serverless): عند تفعيل Supabase يُستبدل مسار `/api/trpc` بواجهة Supabase مباشرة.
- النسخ الاحتياطي والأرشفة: تلقائي من Supabase (Daily backups) + سجل `site_content_revisions` و `activity_log` محليًا.
- وضع الأوفلاين: Service Worker يستمر في تخزين الواجهة والبيانات العامة مؤقتًا حتى عند انقطاع الشبكة.