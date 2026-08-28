-- =============================================================================
-- ViP Yemen - Complete Database Schema for Supabase
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USERS TABLE (المستخدمون)
-- =============================================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(320) UNIQUE,
  phone VARCHAR(32) UNIQUE,
  full_name VARCHAR(200),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_role ON public.users(role);

-- =============================================================================
-- 2. SUBMISSIONS TABLE (الطلبات) - For all departments
-- =============================================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Category & Status
  category VARCHAR(50) NOT NULL CHECK (category IN (
    'employment',           -- التوظيف
    'realEstateOffer',      -- عرض عقار
    'realEstateRequest',    -- طلب عقار
    'productOffer',         -- عرض منتج
    'productRequest',       -- طلب منتج
    'software',             -- برمجيات
    'serviceOffer',         -- عرض خدمة
    'serviceRequest'        -- طلب خدمة
  )),
  status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN (
    'pending',              -- قيد الانتظار
    'inReview',             -- قيد المراجعة
    'approved',             -- تمت الموافقة
    'rejected',             -- مرفوض
    'archived',             -- مؤرشف
    'sold',                 -- تم البيع
    'expired'               -- منتهي الصلاحية
  )),
  
  -- Content
  title VARCHAR(250) NOT NULL,
  description TEXT NOT NULL,
  
  -- Contact Info
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(320),
  address VARCHAR(400),
  
  -- Organization (for employment)
  organization_name VARCHAR(250),
  organization_logo_url TEXT,
  profession VARCHAR(200),
  
  -- Property (for real estate)
  property_type VARCHAR(100),
  property_size VARCHAR(100),
  property_rooms VARCHAR(50),
  property_age VARCHAR(50),
  property_condition VARCHAR(100),
  
  -- Product (for e-marketing)
  product_type VARCHAR(150),
  brand VARCHAR(100),
  model VARCHAR(100),
  condition VARCHAR(50),
  
  -- Pricing
  price VARCHAR(100),
  original_price VARCHAR(100),
  
  -- Requirements (for employment)
  requirements TEXT,
  salary_range VARCHAR(100),
  work_type VARCHAR(50),  -- full-time, part-time, contract, remote
  
  -- Publishing
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  -- Review
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id),
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_submissions_category ON public.submissions(category);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX idx_submissions_published_at ON public.submissions(published_at DESC);
CREATE INDEX idx_submissions_featured ON public.submissions(is_featured) WHERE is_featured = true;

-- =============================================================================
-- 3. SUBMISSION ATTACHMENTS TABLE (مرفقات الطلبات)
-- =============================================================================
CREATE TABLE public.submission_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  file_size BIGINT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_submission_attachments_submission ON public.submission_attachments(submission_id);

-- =============================================================================
-- 4. ADVERTISEMENTS TABLE (الإعلانات الترويجية)
-- =============================================================================
CREATE TABLE public.advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(250) NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' NOT NULL CHECK (status IN (
    'draft', 'scheduled', 'published', 'paused', 'expired'
  )),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT chk_dates CHECK (ends_at > starts_at)
);

CREATE INDEX idx_advertisements_status ON public.advertisements(status);
CREATE INDEX idx_advertisements_active_window ON public.advertisements(status, starts_at, ends_at);
CREATE INDEX idx_advertisements_priority ON public.advertisements(priority DESC);

-- =============================================================================
-- 5. OFFERS TABLE (العروض الترويجية)
-- =============================================================================
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(250) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  category VARCHAR(150),
  original_price VARCHAR(100),
  offer_price VARCHAR(100),
  discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
  status VARCHAR(20) DEFAULT 'draft' NOT NULL CHECK (status IN (
    'draft', 'scheduled', 'published', 'paused', 'expired'
  )),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  priority INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  contact_phone VARCHAR(32),
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_offers_status ON public.offers(status);
CREATE INDEX idx_offers_featured ON public.offers(is_featured) WHERE is_featured = true;
CREATE INDEX idx_offers_priority ON public.offers(priority DESC);
CREATE INDEX idx_offers_category ON public.offers(category);

-- =============================================================================
-- 6. OFFER ATTACHMENTS TABLE (مرفقات العروض)
-- =============================================================================
CREATE TABLE public.offer_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  storage_path VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(150) NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_offer_attachments_offer ON public.offer_attachments(offer_id);

-- =============================================================================
-- 7. SITE ASSETS TABLE (الأصول البصرية)
-- =============================================================================
CREATE TABLE public.site_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kind VARCHAR(20) NOT NULL CHECK (kind IN ('image', 'banner', 'icon', 'logo')),
  name VARCHAR(200) NOT NULL,
  url TEXT NOT NULL,
  alt_text VARCHAR(300) NOT NULL,
  file_size BIGINT,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_site_assets_kind ON public.site_assets(kind);
CREATE INDEX idx_site_assets_published ON public.site_assets(is_published);

-- =============================================================================
-- 8. SITE THEMES TABLE (الثيمات)
-- =============================================================================
CREATE TABLE public.site_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- 9. SITE SECTIONS TABLE (أقسام الموقع)
-- =============================================================================
CREATE TABLE public.site_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content JSONB,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_site_sections_slug ON public.site_sections(slug);
CREATE INDEX idx_site_sections_sort ON public.site_sections(sort_order);

-- =============================================================================
-- 10. SITE CONTENT REVISIONS TABLE (سجل النسخ)
-- =============================================================================
CREATE TABLE public.site_content_revisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('asset', 'theme', 'section', 'offer', 'advertisement')),
  entity_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL CHECK (action IN ('create', 'update', 'publish', 'archive')),
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_revisions_entity ON public.site_content_revisions(entity_type, entity_id);
CREATE INDEX idx_revisions_created ON public.site_content_revisions(created_at DESC);

-- =============================================================================
-- 11. CONTACTS TABLE (جهات الاتصال)
-- =============================================================================
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(320),
  phone VARCHAR(32),
  subject VARCHAR(300),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' NOT NULL CHECK (status IN (
    'new', 'read', 'replied', 'archived'
  )),
  replied_at TIMESTAMPTZ,
  replied_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_contacts_status ON public.contacts(status);
CREATE INDEX idx_contacts_created ON public.contacts(created_at DESC);

-- =============================================================================
-- 12. NOTIFICATIONS TABLE (الإشعارات)
-- =============================================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- =============================================================================
-- 13. ACTIVITY LOG TABLE (سجل النشاطات)
-- =============================================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON public.activity_log(created_at DESC);

-- =============================================================================
-- 14. SETTINGS TABLE (الإعدادات)
-- =============================================================================
CREATE TABLE public.settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Users: Public read, authenticated write
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Submissions: Public read for approved, owner read, admin full access
CREATE POLICY "Anyone can view approved submissions" ON public.submissions
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all submissions" ON public.submissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Offers: Public read for published, admin full access
CREATE POLICY "Anyone can view published offers" ON public.offers
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all offers" ON public.offers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Advertisements: Public read for active, admin full access
CREATE POLICY "Anyone can view active advertisements" ON public.advertisements
  FOR SELECT USING (
    status = 'published' AND starts_at <= NOW() AND ends_at >= NOW()
  );

CREATE POLICY "Admins can manage all advertisements" ON public.advertisements
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Site Assets: Public read for published, admin full access
CREATE POLICY "Anyone can view published assets" ON public.site_assets
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all assets" ON public.site_assets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Site Themes: Public read, admin full access
CREATE POLICY "Anyone can view active theme" ON public.site_themes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all themes" ON public.site_themes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Site Sections: Public read for published, admin full access
CREATE POLICY "Anyone can view published sections" ON public.site_sections
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all sections" ON public.site_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Contacts: Owner read, admin full access
CREATE POLICY "Admins can manage contacts" ON public.contacts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can create contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Notifications: Owner read only
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Activity Log: Admin read only
CREATE POLICY "Admins can view activity log" ON public.activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "System can insert activity log" ON public.activity_log
  FOR INSERT WITH CHECK (true);

-- Settings: Public read, admin write
CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON public.advertisements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_assets_updated_at BEFORE UPDATE ON public.site_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_themes_updated_at BEFORE UPDATE ON public.site_themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_sections_updated_at BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_action VARCHAR(100),
  p_entity_type VARCHAR(50),
  p_entity_id UUID,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, details)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details);
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_title VARCHAR(200),
  p_message TEXT,
  p_type VARCHAR(50) DEFAULT 'info',
  p_link_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type, link_url)
  VALUES (p_user_id, p_title, p_message, p_type, p_link_url)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert default settings
INSERT INTO public.settings (key, value, description) VALUES
  ('platform_name', '"ViP Yemen"', 'اسم المنصة'),
  ('platform_description', '"منصة يمنية شاملة للتوظيف والتسويق العقاري والإلكتروني والبرمجيات والخدمات العامة"', 'وصف المنصة'),
  ('whatsapp_number', '"967711780999"', 'رقم واتساب المنصة'),
  ('business_phone', '"773597404"', 'رقم الهاتف التجاري'),
  ('bank_account_name', '"بنك الكريمي"', 'اسم الحساب البنكي'),
  ('wallet_jawal', '"محفظة الجوالي"', 'محفظة الجوالي'),
  ('wallet_jaib', '"محفظة جيب"', 'محفظة جيب'),
  ('admin_email', '"vipservicesyemen@gmail.com"', 'بريد الإدارة الرئيسي'),
  ('platform_version', '"1.1.0"', 'إصدار المنصة');
