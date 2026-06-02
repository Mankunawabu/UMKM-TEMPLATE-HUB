ALTER TABLE public.export_logs 
ADD CONSTRAINT fk_export_logs_template 
FOREIGN KEY (template_id) 
REFERENCES public.templates(id) 
ON DELETE SET NULL;

NOTIFY pgrst, 'reload schema';
