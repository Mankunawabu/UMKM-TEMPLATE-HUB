-- Drop existing select policy
DROP POLICY IF EXISTS "Admins can view activity logs" ON activity_logs;

-- Recreate with simple authenticated read (Admin route is already protected)
CREATE POLICY "Admins can view activity logs" 
ON activity_logs FOR SELECT 
USING (auth.role() = 'authenticated');
