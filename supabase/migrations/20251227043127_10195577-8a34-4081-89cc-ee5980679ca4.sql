-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'double', 'triple')),
  monthly_rent DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 1,
  is_available BOOLEAN DEFAULT true,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rent_allocations table
CREATE TABLE public.rent_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  rent_start_date DATE NOT NULL,
  rent_expiry_date DATE NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  allocation_id UUID REFERENCES public.rent_allocations(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_method TEXT DEFAULT 'online',
  transaction_id TEXT,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_key_id TEXT,
  razorpay_key_secret TEXT,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  payments_enabled BOOLEAN DEFAULT false,
  single_room_rent DECIMAL(10,2) DEFAULT 6000,
  double_room_rent DECIMAL(10,2) DEFAULT 4500,
  triple_room_rent DECIMAL(10,2) DEFAULT 3500,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rent_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Check if admin email
  IF NEW.email = 'paladugusaiganesh@gmail.com' THEN
    user_role := 'admin';
  ELSE
    user_role := 'user';
  END IF;
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for rooms
CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage rooms" ON public.rooms
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for rent_allocations
CREATE POLICY "Users can view own allocations" ON public.rent_allocations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all allocations" ON public.rent_allocations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for admin_settings
CREATE POLICY "Admins can manage settings" ON public.admin_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default admin settings
INSERT INTO public.admin_settings (id) VALUES (gen_random_uuid());

-- Insert sample rooms
INSERT INTO public.rooms (room_number, room_type, monthly_rent, capacity, is_available, amenities) VALUES
('101', 'single', 6000, 1, true, ARRAY['AC', 'WiFi', 'Attached Bathroom']),
('102', 'single', 6000, 1, true, ARRAY['AC', 'WiFi', 'Attached Bathroom']),
('201', 'double', 4500, 2, true, ARRAY['AC', 'WiFi', 'Shared Bathroom']),
('202', 'double', 4500, 2, true, ARRAY['AC', 'WiFi', 'Shared Bathroom']),
('301', 'triple', 3500, 3, true, ARRAY['Fan', 'WiFi', 'Shared Bathroom']),
('302', 'triple', 3500, 3, true, ARRAY['Fan', 'WiFi', 'Shared Bathroom']);