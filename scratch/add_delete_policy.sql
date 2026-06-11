-- Policy agar pengguna authenticated dapat menghapus baris riwayat ekspor miliknya sendiri
CREATE POLICY "Users can delete own export_logs"
    ON public.export_logs
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
