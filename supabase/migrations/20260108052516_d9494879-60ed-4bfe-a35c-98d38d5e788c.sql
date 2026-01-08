-- Create site_settings table to store all configurable website content
CREATE TABLE public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value text NOT NULL,
    category text DEFAULT 'general',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings (public website)
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value, category) VALUES
-- Personal Info
('name', 'Karan Kumar Kamat', 'personal'),
('title', 'Student | Coder | Web Developer | Problem Solver', 'personal'),
('location', 'Dhanpalthan-7, Kamalpur, Nepal', 'personal'),
('bio_intro', 'Hello! I''m Karan Kumar Kamat from Dhanpalthan-7, Kamalpur, Nepal. I completed Diploma in Computer Engineering from Adarsha Secondary School which is located at Biratnagar-7.', 'personal'),
('bio_passion', 'Computer Engineering graduate passionate about solving complex problems with elegant solutions. I live for those "Aha!" moments when debugging code at 2 AM.', 'personal'),
('bio_hobby', 'When I''m not optimizing algorithms, you''ll find me exploring the latest tech trends or building something cool that probably nobody asked for (but everyone ends up loving).', 'personal'),

-- About Section
('about_description', 'I''m a passionate developer mastering Data Structures & Algorithms with Java. I believe clean code and optimized algorithms can solve real-world problems.', 'about'),
('about_activities', 'When I''m not cracking coding problems, you''ll find me: • Solving challenges on LeetCode & CodeChef • Building projects to sharpen my skills • Sharing my DSA learning journey', 'about'),
('about_toolkit', 'My Tech Toolkit: Java | Data Structures | Algorithms | OOP | Problem Solving', 'about'),
('resume_url', '/KaranKumarKamat(Resume).pdf', 'about'),

-- Social Links
('linkedin_url', 'https://www.linkedin.com/in/krnkmt/', 'social'),
('github_url', 'https://github.com/redcoder-008', 'social'),
('whatsapp_number', '9779804005610', 'social'),
('twitter_url', 'https://x.com/karankewat_008', 'social'),
('email', 'redcoder008@gmail.com', 'social'),

-- Skills (JSON array)
('skills', '["JavaScript", "React", "Node.js", "MongoDB", "Express", "TypeScript", "Python", "PostgreSQL", "React Native", "Docker"]', 'skills'),

-- Typed text options
('typed_texts', '["Student", "Coder", "Web Developer", "Problem Solver"]', 'personal');