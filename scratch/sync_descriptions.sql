-- Hapus kolom description dari tabel categories
ALTER TABLE public.categories DROP COLUMN IF EXISTS description;

-- Tambahkan kolom description ke tabel templates jika belum ada
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS description TEXT;

-- Memuat ulang skema agar API (PostgREST) mendeteksi perubahan
NOTIFY pgrst, 'reload schema';
