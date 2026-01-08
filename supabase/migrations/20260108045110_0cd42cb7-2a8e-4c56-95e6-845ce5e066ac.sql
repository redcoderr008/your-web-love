-- Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create has_role function with security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles - only admins can view roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    image_emoji TEXT DEFAULT '🚀',
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can view visible projects
CREATE POLICY "Anyone can view visible projects"
ON public.projects
FOR SELECT
USING (is_visible = true);

-- Admins can do everything with projects
CREATE POLICY "Admins can manage projects"
ON public.projects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create graphics_designs table
CREATE TABLE public.graphics_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on graphics_designs
ALTER TABLE public.graphics_designs ENABLE ROW LEVEL SECURITY;

-- Public can view visible designs
CREATE POLICY "Anyone can view visible designs"
ON public.graphics_designs
FOR SELECT
USING (is_visible = true);

-- Admins can do everything with designs
CREATE POLICY "Admins can manage designs"
ON public.graphics_designs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for graphics designs
INSERT INTO storage.buckets (id, name, public) VALUES ('graphics', 'graphics', true);

-- Storage policies for graphics bucket
CREATE POLICY "Anyone can view graphics"
ON storage.objects
FOR SELECT
USING (bucket_id = 'graphics');

CREATE POLICY "Admins can upload graphics"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'graphics' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update graphics"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'graphics' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete graphics"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'graphics' AND public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_graphics_designs_updated_at
BEFORE UPDATE ON public.graphics_designs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();