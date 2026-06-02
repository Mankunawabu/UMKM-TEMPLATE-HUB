DROP TABLE IF EXISTS activity_logs CASCADE;

CREATE TABLE activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB,
    severity TEXT DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow viewing for Admins
CREATE POLICY "Admins can view activity logs" 
ON activity_logs FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow insertion
CREATE POLICY "Users can insert activity logs" 
ON activity_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);
