-- Allow Admins to update profiles
CREATE POLICY "Admins can update profiles" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles admin_profile
    WHERE admin_profile.id = auth.uid() AND admin_profile.role = 'admin'
  )
);
