-- =============================================================================
-- ViP Yemen - Supabase Storage Buckets
-- =============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('submissions', 'submissions', false, 8388608, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('offers', 'offers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('site-assets', 'site-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('organizations', 'organizations', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Storage Policies
-- =============================================================================

-- Avatars: Public read, authenticated write
CREATE POLICY "Avatar public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatar upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Avatar update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatar delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Submissions: Owner read, admin read all
CREATE POLICY "Submission owner access" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'submissions' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    )
  );

CREATE POLICY "Submission upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'submissions' 
    AND auth.role() = 'authenticated'
  );

-- Offers: Public read for published, admin write
CREATE POLICY "Offer public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'offers');

CREATE POLICY "Offer admin access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'offers' 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Site Assets: Public read, admin write
CREATE POLICY "Site asset public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-assets');

CREATE POLICY "Site asset admin access" ON storage.objects
  FOR ALL USING (
    bucket_id = 'site-assets' 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Organizations: Public read, authenticated write
CREATE POLICY "Organization public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'organizations');

CREATE POLICY "Organization upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'organizations' 
    AND auth.role() = 'authenticated'
  );
