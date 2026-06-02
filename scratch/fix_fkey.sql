ALTER TABLE activity_logs
  DROP CONSTRAINT IF EXISTS activity_logs_user_id_fkey,
  ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

NOTIFY pgrst, 'reload schema';
