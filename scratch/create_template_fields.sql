-- Hapus tabel lama (beserta semua constraint-nya yang mengganggu)
DROP TABLE IF EXISTS public.template_fields CASCADE;

-- Buat tabel template_fields baru yang bersih
CREATE TABLE public.template_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
    shape_type TEXT NOT NULL DEFAULT 'rect',
    x INTEGER NOT NULL DEFAULT 0,
    y INTEGER NOT NULL DEFAULT 0,
    width INTEGER NOT NULL DEFAULT 100,
    height INTEGER NOT NULL DEFAULT 100,
    placeholder_label TEXT,
    is_editable BOOLEAN NOT NULL DEFAULT true,
    field_role TEXT NOT NULL DEFAULT 'image',
    render_mode TEXT NOT NULL DEFAULT 'under',
    z_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atur Row Level Security (RLS)
ALTER TABLE public.template_fields ENABLE ROW LEVEL SECURITY;

-- Policy untuk Admin: Bisa akses penuh (Select, Insert, Update, Delete)
CREATE POLICY "Admin can manage template_fields"
    ON public.template_fields
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

-- Policy untuk User Biasa/Anon: Bisa melihat template_fields jika template-nya published
CREATE POLICY "Users can view template_fields for published templates"
    ON public.template_fields
    FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.templates
            WHERE templates.id = template_fields.template_id AND templates.status = 'published'
        )
    );

-- Indexing
CREATE INDEX IF NOT EXISTS idx_template_fields_template_id ON public.template_fields(template_id);
