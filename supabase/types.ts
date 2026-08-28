// =============================================================================
// ViP Yemen - Supabase TypeScript Types
// Auto-generated from database schema
// =============================================================================

export type UserRole = 'user' | 'admin' | 'moderator';

export type SubmissionCategory = 
  | 'employment'        // التوظيف
  | 'realEstateOffer'   // عرض عقار
  | 'realEstateRequest' // طلب عقار
  | 'productOffer'      // عرض منتج
  | 'productRequest'    // طلب منتج
  | 'software'          // برمجيات
  | 'serviceOffer'      // عرض خدمة
  | 'serviceRequest';   // طلب خدمة

export type SubmissionStatus = 
  | 'pending'     // قيد الانتظار
  | 'inReview'    // قيد المراجعة
  | 'approved'    // تمت الموافقة
  | 'rejected'    // مرفوض
  | 'archived'    // مؤرشف
  | 'sold'        // تم البيع
  | 'expired';    // منتهي الصلاحية

export type AdStatus = 
  | 'draft'      // مسودة
  | 'scheduled'  // مجدول
  | 'published'  // منشور
  | 'paused'     // متوقف
  | 'expired';   // منتهي

export type AssetKind = 'image' | 'banner' | 'icon' | 'logo';

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type RevisionAction = 'create' | 'update' | 'publish' | 'archive';

// =============================================================================
// Database Tables
// =============================================================================

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  user_id: string | null;
  category: SubmissionCategory;
  status: SubmissionStatus;
  title: string;
  description: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  organization_name: string | null;
  organization_logo_url: string | null;
  profession: string | null;
  property_type: string | null;
  property_size: string | null;
  property_rooms: string | null;
  property_age: string | null;
  property_condition: string | null;
  product_type: string | null;
  brand: string | null;
  model: string | null;
  condition: string | null;
  price: string | null;
  original_price: string | null;
  requirements: string | null;
  salary_range: string | null;
  work_type: string | null;
  published_at: string | null;
  expires_at: string | null;
  view_count: number;
  is_featured: boolean;
  reviewed_at: string | null;
  reviewed_by: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubmissionAttachment {
  id: string;
  submission_id: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Advertisement {
  id: string;
  title: string;
  message: string;
  link_url: string | null;
  image_url: string | null;
  status: AdStatus;
  starts_at: string;
  ends_at: string;
  priority: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  category: string | null;
  original_price: string | null;
  offer_price: string | null;
  discount_percent: number | null;
  status: AdStatus;
  starts_at: string | null;
  ends_at: string | null;
  priority: number;
  is_featured: boolean;
  contact_phone: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OfferAttachment {
  id: string;
  offer_id: string;
  storage_path: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  created_at: string;
}

export interface SiteAsset {
  id: string;
  kind: AssetKind;
  name: string;
  url: string;
  alt_text: string;
  file_size: number | null;
  is_published: boolean;
  sort_order: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SiteTheme {
  id: string;
  name: string;
  config: Record<string, unknown>;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: Record<string, unknown> | null;
  sort_order: number;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SiteContentRevision {
  id: string;
  entity_type: string;
  entity_id: string;
  action: RevisionAction;
  snapshot: Record<string, unknown>;
  created_by: string;
  created_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactStatus;
  replied_at: string | null;
  replied_by: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link_url: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Setting {
  key: string;
  value: unknown;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

// =============================================================================
// Database Schema Type (for Supabase client)
// =============================================================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'created_at' | 'updated_at' | 'view_count'>;
        Update: Partial<Omit<Submission, 'id' | 'created_at' | 'updated_at'>>;
      };
      submission_attachments: {
        Row: SubmissionAttachment;
        Insert: Omit<SubmissionAttachment, 'id' | 'created_at'>;
        Update: Partial<Omit<SubmissionAttachment, 'id' | 'created_at'>>;
      };
      advertisements: {
        Row: Advertisement;
        Insert: Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>>;
      };
      offers: {
        Row: Offer;
        Insert: Omit<Offer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Offer, 'id' | 'created_at' | 'updated_at'>>;
      };
      offer_attachments: {
        Row: OfferAttachment;
        Insert: Omit<OfferAttachment, 'id' | 'created_at'>;
        Update: Partial<Omit<OfferAttachment, 'id' | 'created_at'>>;
      };
      site_assets: {
        Row: SiteAsset;
        Insert: Omit<SiteAsset, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteAsset, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_themes: {
        Row: SiteTheme;
        Insert: Omit<SiteTheme, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteTheme, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_sections: {
        Row: SiteSection;
        Insert: Omit<SiteSection, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SiteSection, 'id' | 'created_at' | 'updated_at'>>;
      };
      site_content_revisions: {
        Row: SiteContentRevision;
        Insert: Omit<SiteContentRevision, 'id' | 'created_at'>;
        Update: Partial<Omit<SiteContentRevision, 'id' | 'created_at'>>;
      };
      contacts: {
        Row: Contact;
        Insert: Omit<Contact, 'id' | 'created_at'>;
        Update: Partial<Omit<Contact, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      activity_log: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'>;
        Update: Partial<Omit<ActivityLog, 'id' | 'created_at'>>;
      };
      settings: {
        Row: Setting;
        Insert: Omit<Setting, 'updated_at'>;
        Update: Partial<Omit<Setting, 'updated_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      submission_category: SubmissionCategory;
      submission_status: SubmissionStatus;
      ad_status: AdStatus;
      asset_kind: AssetKind;
      contact_status: ContactStatus;
      notification_type: NotificationType;
      revision_action: RevisionAction;
    };
  };
}
