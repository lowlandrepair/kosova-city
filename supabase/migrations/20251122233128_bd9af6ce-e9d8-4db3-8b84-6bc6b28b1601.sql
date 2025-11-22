-- Add tags column to reports table
ALTER TABLE public.reports 
ADD COLUMN tags text[] DEFAULT '{}';

-- Add index for faster tag queries
CREATE INDEX idx_reports_tags ON public.reports USING GIN(tags);