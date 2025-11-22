-- Add estimated_cost column to reports table
ALTER TABLE public.reports
ADD COLUMN estimated_cost numeric(10,2) DEFAULT 0 NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.reports.estimated_cost IS 'Estimated cost for repair in USD';