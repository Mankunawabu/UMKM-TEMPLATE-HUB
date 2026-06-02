-- Menghapus tabel assets beserta semua relasi atau views yang bergantung padanya
DROP TABLE IF EXISTS public.assets CASCADE;

-- Memberitahu PostgREST (API Supabase) untuk memuat ulang skema agar tabel yang dihapus hilang dari API
NOTIFY pgrst, 'reload schema';
