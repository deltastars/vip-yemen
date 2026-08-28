// =============================================================================
// ViP Yemen - Supabase Client Configuration
// =============================================================================

import { createClient } from '@supabase/supabase-js';

// Environment variables (set these in your .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// =============================================================================
// Auth Helpers
// =============================================================================

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// =============================================================================
// Database Helpers - Submissions
// =============================================================================

export const getSubmissions = async (category?: string) => {
  let query = supabase
    .from('submissions')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  return query;
};

export const getAdminSubmissions = async () => {
  return supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });
};

export const createSubmission = async (submission: Record<string, unknown>) => {
  return supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single();
};

export const updateSubmissionStatus = async (
  id: string, 
  status: string, 
  internalNotes?: string
) => {
  return supabase
    .from('submissions')
    .update({ 
      status, 
      internal_notes: internalNotes,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id);
};

// =============================================================================
// Database Helpers - Offers
// =============================================================================

export const getPublishedOffers = async () => {
  return supabase
    .from('offers')
    .select('*')
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });
};

export const getAdminOffers = async () => {
  return supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });
};

export const createOffer = async (offer: Record<string, unknown>) => {
  return supabase
    .from('offers')
    .insert(offer)
    .select()
    .single();
};

export const updateOffer = async (id: string, updates: Record<string, unknown>) => {
  return supabase
    .from('offers')
    .update(updates)
    .eq('id', id);
};

export const deleteOffer = async (id: string) => {
  return supabase
    .from('offers')
    .delete()
    .eq('id', id);
};

// =============================================================================
// Database Helpers - Advertisements
// =============================================================================

export const getActiveAdvertisements = async () => {
  const now = new Date().toISOString();
  return supabase
    .from('advertisements')
    .select('*')
    .eq('status', 'published')
    .lte('starts_at', now)
    .gte('ends_at', now)
    .order('priority', { ascending: false });
};

export const getAdminAdvertisements = async () => {
  return supabase
    .from('advertisements')
    .select('*')
    .order('created_at', { ascending: false });
};

export const createAdvertisement = async (ad: Record<string, unknown>) => {
  return supabase
    .from('advertisements')
    .insert(ad)
    .select()
    .single();
};

export const updateAdvertisement = async (id: string, updates: Record<string, unknown>) => {
  return supabase
    .from('advertisements')
    .update(updates)
    .eq('id', id);
};

export const deleteAdvertisement = async (id: string) => {
  return supabase
    .from('advertisements')
    .delete()
    .eq('id', id);
};

// =============================================================================
// Database Helpers - Site Assets
// =============================================================================

export const getPublishedAssets = async (kind?: string) => {
  let query = supabase
    .from('site_assets')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');
  
  if (kind) {
    query = query.eq('kind', kind);
  }
  
  return query;
};

export const getAdminAssets = async () => {
  return supabase
    .from('site_assets')
    .select('*')
    .order('sort_order');
};

export const createAsset = async (asset: Record<string, unknown>) => {
  return supabase
    .from('site_assets')
    .insert(asset)
    .select()
    .single();
};

export const updateAsset = async (id: string, updates: Record<string, unknown>) => {
  return supabase
    .from('site_assets')
    .update(updates)
    .eq('id', id);
};

// =============================================================================
// Database Helpers - Site Sections
// =============================================================================

export const getPublishedSections = async () => {
  return supabase
    .from('site_sections')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');
};

export const getAdminSections = async () => {
  return supabase
    .from('site_sections')
    .select('*')
    .order('sort_order');
};

export const createSection = async (section: Record<string, unknown>) => {
  return supabase
    .from('site_sections')
    .insert(section)
    .select()
    .single();
};

export const updateSection = async (id: string, updates: Record<string, unknown>) => {
  return supabase
    .from('site_sections')
    .update(updates)
    .eq('id', id);
};

// =============================================================================
// Database Helpers - Contacts
// =============================================================================

export const createContact = async (contact: Record<string, unknown>) => {
  return supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single();
};

export const getAdminContacts = async () => {
  return supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
};

export const updateContactStatus = async (id: string, status: string) => {
  return supabase
    .from('contacts')
    .update({ status })
    .eq('id', id);
};

// =============================================================================
// Database Helpers - Settings
// =============================================================================

export const getSetting = async (key: string) => {
  return supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
};

export const updateSetting = async (key: string, value: unknown) => {
  return supabase
    .from('settings')
    .upsert({ key, value })
    .eq('key', key);
};

// =============================================================================
// Storage Helpers
// =============================================================================

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: { cacheControl?: string; contentType?: string }
) => {
  return supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
    });
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
};

export const deleteFile = async (bucket: string, paths: string[]) => {
  return supabase.storage
    .from(bucket)
    .remove(paths);
};

// =============================================================================
// Realtime Subscriptions
// =============================================================================

export const subscribeToSubmissions = (callback: (payload: unknown) => void) => {
  return supabase
    .channel('submissions')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, callback)
    .subscribe();
};

export const subscribeToOffers = (callback: (payload: unknown) => void) => {
  return supabase
    .channel('offers')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, callback)
    .subscribe();
};

export const subscribeToAdvertisements = (callback: (payload: unknown) => void) => {
  return supabase
    .channel('advertisements')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'advertisements' }, callback)
    .subscribe();
};

// =============================================================================
// Helpers
// =============================================================================

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('ar-YE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('ar-YE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseInt(amount.replace(/[^0-9]/g, '')) : amount;
  return new Intl.NumberFormat('ar-YE', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(num) + ' ريال يمني';
};
