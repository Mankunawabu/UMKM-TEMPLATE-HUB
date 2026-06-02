-- Kosongkan tabel yang lama
TRUNCATE TABLE public.app_settings;

-- Masukkan setelan konsep baru
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES 
    ('maintenance', '{"is_maintenance_mode": false, "maintenance_message": "Sistem sedang dalam perbaikan rutin. Silakan kembali dalam beberapa jam."}'::jsonb),
    ('access', '{"enable_registration": false}'::jsonb),
    ('limits', '{"daily_export_limit": 5, "export_quality": "standard"}'::jsonb),
    ('onboarding', '{"welcome_message": "Selamat datang di UMKM Hub! Silakan lengkapi profil Anda untuk mulai menggunakan template desain kami."}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

NOTIFY pgrst, 'reload schema';
