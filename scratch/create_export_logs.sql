CREATE TABLE IF NOT EXISTS public.export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID, -- Bisa null jika mengekspor kanvas kosong
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

-- User hanya bisa melihat dan menambah log miliknya sendiri
CREATE POLICY "Users can view own export_logs"
    ON public.export_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own export_logs"
    ON public.export_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own export_logs"
    ON public.export_logs
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Admin bisa melihat semua log
CREATE POLICY "Admin can view all export_logs"
    ON public.export_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Indeks untuk pencarian cepat limit harian
CREATE INDEX IF NOT EXISTS idx_export_logs_user_date ON public.export_logs(user_id, created_at);

NOTIFY pgrst, 'reload schema';
