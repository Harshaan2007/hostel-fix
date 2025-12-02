-- Create enum for issue types
CREATE TYPE public.issue_type AS ENUM ('socket', 'light', 'fan', 'ac', 'wiring', 'switch', 'other');

-- Create enum for issue status
CREATE TYPE public.issue_status AS ENUM ('pending', 'in_progress', 'resolved');

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL,
  issue_type issue_type NOT NULL,
  description TEXT NOT NULL,
  status issue_status NOT NULL DEFAULT 'pending',
  student_name VARCHAR(100),
  student_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert complaints (students don't need accounts)
CREATE POLICY "Anyone can submit complaints"
ON public.complaints
FOR INSERT
WITH CHECK (true);

-- Allow anyone to view complaints (for demo - in production, restrict to staff)
CREATE POLICY "Anyone can view complaints"
ON public.complaints
FOR SELECT
USING (true);

-- Allow anyone to update complaints (for demo - in production, restrict to staff)
CREATE POLICY "Anyone can update complaints"
ON public.complaints
FOR UPDATE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_complaint_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_complaints_timestamp
BEFORE UPDATE ON public.complaints
FOR EACH ROW
EXECUTE FUNCTION public.update_complaint_timestamp();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.complaints;