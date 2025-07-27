-- Create enum types
CREATE TYPE public.education_status AS ENUM ('none', 'primary', 'secondary', 'higher_secondary', 'vocational');
CREATE TYPE public.health_status AS ENUM ('excellent', 'good', 'fair', 'poor', 'critical');
CREATE TYPE public.gender AS ENUM ('male', 'female', 'other');
CREATE TYPE public.user_role AS ENUM ('admin', 'corporate', 'ngo');

-- Create profiles table for corporate/NGO users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'corporate',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create children table to store street children data
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 18),
  gender gender NOT NULL,
  district TEXT NOT NULL,
  location TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  education_status education_status NOT NULL DEFAULT 'none',
  health_status health_status NOT NULL DEFAULT 'fair',
  special_needs TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create donations table for CSR contributions
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  purpose TEXT NOT NULL,
  beneficiary_children_count INTEGER DEFAULT 0,
  transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create success_stories table
CREATE TABLE public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create audit_logs table for transparency
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for children (readable by authenticated users)
CREATE POLICY "Authenticated users can view children" ON public.children
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins and NGOs can insert children" ON public.children
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'ngo')
    )
  );

CREATE POLICY "Only admins and NGOs can update children" ON public.children
  FOR UPDATE TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'ngo')
    )
  );

-- Create RLS policies for donations
CREATE POLICY "Users can view their own donations" ON public.donations
  FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Users can insert their own donations" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create RLS policies for success_stories
CREATE POLICY "Everyone can view verified success stories" ON public.success_stories
  FOR SELECT TO authenticated USING (verified = true);

CREATE POLICY "Admins can view all success stories" ON public.success_stories
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO public.children (name, age, gender, district, location, education_status, health_status, verified) VALUES
('Arjun Kumar', 12, 'male', 'Mumbai Central', 'Dharavi Slum Area', 'primary', 'good', true),
('Priya Sharma', 8, 'female', 'Delhi North', 'Yamuna Bank', 'none', 'fair', true),
('Ravi Singh', 15, 'male', 'Kolkata East', 'Howrah Bridge Area', 'secondary', 'poor', true),
('Meera Patel', 10, 'female', 'Pune West', 'Camp Area', 'primary', 'good', true),
('Kiran Das', 14, 'male', 'Chennai South', 'Marina Beach Area', 'secondary', 'excellent', true),
('Sunita Roy', 9, 'female', 'Bangalore North', 'Majestic Area', 'none', 'fair', true),
('Deepak Kumar', 13, 'male', 'Hyderabad Central', 'Charminar Area', 'primary', 'good', true),
('Asha Gupta', 11, 'female', 'Jaipur East', 'Pink City Area', 'primary', 'good', true),
('Rohit Verma', 16, 'male', 'Lucknow West', 'Chowk Area', 'higher_secondary', 'fair', true),
('Kavya Reddy', 7, 'female', 'Visakhapatnam', 'Beach Road Area', 'none', 'good', true);

-- Insert sample success stories
INSERT INTO public.success_stories (child_id, title, description, verified) VALUES
((SELECT id FROM public.children WHERE name = 'Arjun Kumar'), 
 'From Streets to School: Arjun''s Journey', 
 'Arjun was found living under a bridge in Dharavi. Through our education program, he now attends a local school and dreams of becoming an engineer. His attendance rate is 95% and he excels in mathematics.', 
 true),
((SELECT id FROM public.children WHERE name = 'Priya Sharma'), 
 'A New Beginning for Priya', 
 'Priya lost her parents in an accident and was living on the streets. She now lives in a safe shelter and has started her primary education. She shows exceptional talent in arts and crafts.', 
 true),
((SELECT id FROM public.children WHERE name = 'Kiran Das'), 
 'Kiran''s Educational Success', 
 'Despite challenging circumstances, Kiran maintained excellent health and completed his secondary education with distinction. He is now preparing for engineering entrance exams.', 
 true);