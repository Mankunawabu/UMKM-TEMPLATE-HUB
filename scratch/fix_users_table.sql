-- 1. Pastikan kolom is_active dan last_login ada di tabel profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- 2. Buat fungsi untuk sinkronisasi last_sign_in_at dari auth.users ke profiles.last_login
CREATE OR REPLACE FUNCTION public.sync_last_login()
RETURNS TRIGGER AS $$
BEGIN
  -- Jika last_sign_in_at berubah (user baru saja login)
  IF NEW.last_sign_in_at IS DISTINCT FROM OLD.last_sign_in_at THEN
    UPDATE public.profiles
    SET last_login = NEW.last_sign_in_at
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Hapus trigger lama jika ada, lalu pasang yang baru di tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_last_login();

-- 4. (Opsional) Update manual data last_login untuk user yang sudah pernah login sebelumnya
UPDATE public.profiles p
SET last_login = u.last_sign_in_at
FROM auth.users u
WHERE p.id = u.id AND u.last_sign_in_at IS NOT NULL AND p.last_login IS NULL;

-- 5. Beri tahu PostgREST untuk reload schema
NOTIFY pgrst, 'reload schema';
