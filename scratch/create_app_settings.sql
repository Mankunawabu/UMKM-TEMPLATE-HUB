CREATE TABLE IF NOT EXISTS public.app_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Hanya admin yang bisa memodifikasi (Insert, Update, Delete)
CREATE POLICY "Admin can modify app_settings"
    ON public.app_settings
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Semua orang (termasuk anon) bisa membaca settings (untuk branding/logo di halaman login)
CREATE POLICY "Public can view app_settings"
    ON public.app_settings
    FOR SELECT
    TO public
    USING (true);

-- Insert default settings if not exists
INSERT INTO public.app_settings (setting_key, setting_value)
VALUES 
    ('general', '{"name": "UMKM Hub", "support_email": "support@umkmhub.id"}'::jsonb),
    ('branding', '{"primary_color": "#C27BA0", "secondary_color": "#8C4A6E", "logo_url": ""}'::jsonb),
    ('features', '{"enable_registration": false, "enable_public_gallery": true}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

NOTIFY pgrst, 'reload schema';
