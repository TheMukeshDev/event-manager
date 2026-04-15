-- Certificate Assets Table
CREATE TABLE IF NOT EXISTS public.certificate_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'logo',
  category TEXT DEFAULT 'general',
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  is_favorite BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.certificate_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to certificate_assets" 
ON public.certificate_assets FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to certificate_assets" 
ON public.certificate_assets FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to certificate_assets" 
ON public.certificate_assets FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete to certificate_assets" 
ON public.certificate_assets FOR DELETE USING (auth.role() = 'authenticated');

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_certificate_assets_type ON public.certificate_assets(type);
CREATE INDEX IF NOT EXISTS idx_certificate_assets_category ON public.certificate_assets(category);
