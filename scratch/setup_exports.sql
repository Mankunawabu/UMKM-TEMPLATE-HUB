-- 1. Tambahkan kolom baru ke tabel export_logs
ALTER TABLE public.export_logs
ADD COLUMN IF NOT EXISTS exported_image_url TEXT,
ADD COLUMN IF NOT EXISTS customization_data JSONB;

-- 2. Buat storage bucket baru bernama 'exports'
INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Tambahkan Policy agar file di bucket 'exports' bisa dibaca oleh publik
CREATE POLICY "Public Access for exports"
ON storage.objects FOR SELECT
USING ( bucket_id = 'exports' );

-- 4. Tambahkan Policy agar authenticated users bisa upload/insert file ke bucket 'exports'
CREATE POLICY "Auth Users can upload to exports"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'exports' );

-- 5. Tambahkan Policy agar pengguna bisa mengupdate filenya sendiri (opsional)
CREATE POLICY "Users can update their own exports"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'exports' AND auth.uid() = owner );

-- 6. Tambahkan Policy agar pengguna bisa menghapus filenya sendiri (opsional)
CREATE POLICY "Users can delete their own exports"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'exports' AND auth.uid() = owner );
