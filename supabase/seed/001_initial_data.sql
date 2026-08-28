-- =============================================================================
-- ViP Yemen - Seed Data
-- =============================================================================

-- Note: Run this after 001_initial_schema.sql and 002_storage_buckets.sql

-- =============================================================================
-- DEFAULT ADMIN USER
-- =============================================================================

-- Insert admin user (will be created via Supabase Auth)
-- The admin user should be created through the Supabase dashboard or auth signup
-- This is just a reference for the user profile data

-- =============================================================================
-- DEFAULT SETTINGS
-- =============================================================================

INSERT INTO public.settings (key, value, description) VALUES
  ('platform_name', '"ViP Yemen"', 'اسم المنصة الرئيسي'),
  ('platform_description', '"منصة يمنية شاملة للتوظيف والتسويق العقاري والإلكتروني والبرمجيات والخدمات العامة"', 'وصف المنصة'),
  ('platform_version', '"1.1.0"', 'إصدار المنصة الحالي'),
  ('whatsapp_number', '"967711780999"', 'رقم واتساب الأعمال الرئيسي'),
  ('business_phone', '"773597404"', 'رقم الهاتف التجاري'),
  ('admin_email', '"vipservicesyemen@gmail.com"', 'بريد الإدارة الرئيسي'),
  ('bank_account_name', '"بنك الكريمي"', 'اسم الحساب البنكي'),
  ('bank_account_number', '"773597404"', 'رقم الحساب البنكي'),
  ('wallet_jawal', '"محفظة الجوالي"', 'محفظة الجوالي المرتبطة بالهاتف'),
  ('wallet_jaib', '"محفظة جيب"', 'محفظة جيب للدفع السريع'),
  ('social_facebook', '"https://www.facebook.com/ViPservicesYemen/"', 'رابط فيسبوك'),
  ('social_twitter', '"https://twitter.com/ViPservicesYeme"', 'رابط تويتر'),
  ('social_instagram', '"https://www.instagram.com/vipservicesyemen"', 'رابط إنستغرام'),
  ('social_linkedin', '"https://www.linkedin.com/in/ali-aldahan-57b5a2231"', 'رابط لينكدإن'),
  ('social_youtube', '"https://youtube.com/channel/UCJGfi4S63-Nm2rSXpBqzHtw"', 'رابط يوتيوب'),
  ('social_linktree', '"https://linktr.ee/vipservicesyemen"', 'رابط Linktree'),
  ('address', '"اليمن · صنعاء · حي شميلة"', 'عنوان المنصة'),
  ('business_hours', '"السبت - الخميس: 8 ص - 8 م"', 'ساعات العمل'),
  ('privacy_policy_url', '"/privacy-policy.html"', 'رابط سياسة الخصوصية')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- =============================================================================
-- DEFAULT SITE ASSETS (LOGOS & ICONS)
-- =============================================================================

-- These will be uploaded via the admin dashboard
-- This is just a reference for the default assets

-- =============================================================================
-- DEFAULT SITE SECTIONS
-- =============================================================================

INSERT INTO public.site_sections (slug, title, description, sort_order, is_published, created_by) VALUES
  ('hero', 'القسم الرئيسي', 'القسم الرئيسي في الصفحة الأولى مع صورة المطور والخريطة الزجاجية', 0, true, '00000000-0000-0000-0000-000000000000'),
  ('services', 'الخدمات', 'عرض جميع خدمات المنصة الثلاثة: التسويق، العقار، التوظيف', 1, true, '00000000-0000-0000-0000-000000000000'),
  ('software', 'البرمجيات', 'قسم تطوير البرمجيات وتطبيقات الهواتف', 2, true, '00000000-0000-0000-0000-000000000000'),
  ('departments', 'الأقسام', 'أقسام المنصة: التوظيف، التسويق العقاري، التسويق الإلكتروني', 3, true, '00000000-0000-0000-0000-000000000000'),
  ('offers', 'العروض', 'العروض الترويجية والخصومات', 4, true, '00000000-0000-0000-0000-000000000000'),
  ('listings', 'الإعلانات', 'العروض والطلبات المنشورة', 5, true, '00000000-0000-0000-0000-000000000000'),
  ('why', 'لماذا ViP Yemen', 'مميزات المنصة ونقاط القوة', 6, true, '00000000-0000-0000-0000-000000000000'),
  ('contact', 'تواصل معنا', 'معلومات الاتصال ونموذج التواصل', 7, true, '00000000-0000-0000-0000-000000000000')
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- =============================================================================
-- DEFAULT SITE THEME
-- =============================================================================

INSERT INTO public.site_themes (name, config, is_active, created_by) VALUES
  ('ViP Luxury Gold', 
   '{"primary":"#102A43","accent":"#F3B71B","background":"#FFFDF8","foreground":"#102A43","card":"#FFFDF8","cardForeground":"#102A43","primaryForeground":"#ffffff","secondary":"#EAF0F3","secondaryForeground":"#102A43","mutedForeground":"#6B7B8C","border":"#D9E0E5","input":"#D9E0E5","ring":"#F3B71B","coral":"#E76F51","cream":"#F8F5EE","navy":"#102A43","yellow":"#F3B71B"}',
   true,
   '00000000-0000-0000-0000-000000000000'
  )
ON CONFLICT DO NOTHING;

-- =============================================================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================================================

-- Sample submissions (for testing the admin dashboard)
-- These will be created by users through the forms

-- Sample offers (for testing the offers section)
-- These will be created by admins through the dashboard

-- Sample advertisements (for testing the announcement bar)
-- These will be created by admins through the dashboard
