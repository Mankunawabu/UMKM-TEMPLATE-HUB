-- Script untuk menambahkan kolom styling pada tabel template_fields

ALTER TABLE public.template_fields
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS font_size INTEGER DEFAULT 16,
ADD COLUMN IF NOT EXISTS font_weight TEXT DEFAULT '400',
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS text_align TEXT DEFAULT 'left',
ADD COLUMN IF NOT EXISTS max_chars INTEGER,
ADD COLUMN IF NOT EXISTS is_currency BOOLEAN DEFAULT false;

-- Tambahkan constraint untuk memastikan hanya 5 font yang diizinkan (Opsional tapi direkomendasikan)
ALTER TABLE public.template_fields
ADD CONSTRAINT check_font_family 
CHECK (font_family IN ('Poppins', 'Inter', 'Montserrat', 'Plus Jakarta Sans', 'SF Pro'));

-- Refresh schema cache PostgREST agar API langsung membaca kolom baru
NOTIFY pgrst, 'reload schema';
