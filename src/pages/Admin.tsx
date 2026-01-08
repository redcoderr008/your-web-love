import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Edit2, Save, X, LogOut, Upload, Eye, EyeOff, Image, FolderOpen, Settings } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  image_emoji: string;
  display_order: number;
  is_visible: boolean;
}

interface GraphicsDesign {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  display_order: number;
  is_visible: boolean;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  category: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [designs, setDesigns] = useState<GraphicsDesign[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingDesign, setEditingDesign] = useState<GraphicsDesign | null>(null);
  const [editingSettings, setEditingSettings] = useState<{ [key: string]: string }>({});
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tech_stack: '',
    github_url: '',
    demo_url: '',
    image_emoji: '🚀',
  });
  const [newDesign, setNewDesign] = useState({
    title: '',
    description: '',
    category: 'General',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchProjects();
      fetchDesigns();
      fetchSiteSettings();
    }
  }, [user, isAdmin]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setProjects(data);
    }
  };

  const fetchDesigns = async () => {
    const { data, error } = await supabase
      .from('graphics_designs')
      .select('*')
      .order('display_order');
    
    if (!error && data) {
      setDesigns(data);
    }
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('category');
    
    if (!error && data) {
      setSiteSettings(data);
      const settingsMap: { [key: string]: string } = {};
      data.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
      setEditingSettings(settingsMap);
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.description) {
      toast({ title: "Error", description: "Title and description are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from('projects').insert({
      title: newProject.title,
      description: newProject.description,
      tech_stack: newProject.tech_stack.split(',').map(t => t.trim()).filter(t => t),
      github_url: newProject.github_url || null,
      demo_url: newProject.demo_url || null,
      image_emoji: newProject.image_emoji || '🚀',
      display_order: projects.length,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Project added!" });
      setNewProject({ title: '', description: '', tech_stack: '', github_url: '', demo_url: '', image_emoji: '🚀' });
      fetchProjects();
    }
  };

  const handleUpdateProject = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Project updated!" });
      setEditingProject(null);
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Project deleted!" });
      fetchProjects();
    }
  };

  const handleToggleProjectVisibility = async (project: Project) => {
    await supabase
      .from('projects')
      .update({ is_visible: !project.is_visible })
      .eq('id', project.id);
    fetchProjects();
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('graphics')
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Error", description: uploadError.message, variant: "destructive" });
      setUploadingImage(false);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('graphics')
      .getPublicUrl(fileName);

    setUploadingImage(false);
    return publicUrl;
  };

  const handleAddDesign = async (file: File) => {
    if (!newDesign.title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }

    const imageUrl = await handleImageUpload(file);
    if (!imageUrl) return;

    const { error } = await supabase.from('graphics_designs').insert({
      title: newDesign.title,
      description: newDesign.description || null,
      category: newDesign.category,
      image_url: imageUrl,
      display_order: designs.length,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Design added!" });
      setNewDesign({ title: '', description: '', category: 'General' });
      fetchDesigns();
    }
  };

  const handleDeleteDesign = async (id: string) => {
    const { error } = await supabase.from('graphics_designs').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Design deleted!" });
      fetchDesigns();
    }
  };

  const handleToggleDesignVisibility = async (design: GraphicsDesign) => {
    await supabase
      .from('graphics_designs')
      .update({ is_visible: !design.is_visible })
      .eq('id', design.id);
    fetchDesigns();
  };

  const handleUpdateSetting = async (key: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: editingSettings[key] })
      .eq('key', key);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `${key} updated!` });
      fetchSiteSettings();
    }
  };

  const handleSaveAllSettings = async () => {
    const updates = Object.entries(editingSettings).map(([key, value]) => 
      supabase.from('site_settings').update({ value }).eq('key', key)
    );
    
    await Promise.all(updates);
    toast({ title: "Success", description: "All settings saved!" });
    fetchSiteSettings();
  };

  const getSettingsByCategory = (category: string) => {
    return siteSettings.filter(s => s.category === category);
  };

  const getSettingLabel = (key: string): string => {
    const labels: { [key: string]: string } = {
      name: 'Full Name',
      title: 'Professional Title',
      location: 'Location',
      bio_intro: 'Bio Introduction',
      bio_passion: 'Bio Passion',
      bio_hobby: 'Bio Hobbies',
      about_description: 'About Description',
      about_activities: 'About Activities',
      about_toolkit: 'Tech Toolkit',
      resume_url: 'Resume URL/Path',
      linkedin_url: 'LinkedIn URL',
      github_url: 'GitHub URL',
      whatsapp_number: 'WhatsApp Number',
      twitter_url: 'Twitter/X URL',
      email: 'Email Address',
      skills: 'Skills (JSON Array)',
      typed_texts: 'Typed Texts (JSON Array)',
    };
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You don't have admin privileges.</p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Admin Panel</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              <FolderOpen className="w-4 h-4 mr-2" /> View Site
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="graphics">Graphics Designs</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Personal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory('personal').map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <label className="text-sm font-medium">{getSettingLabel(setting.key)}</label>
                      {setting.key === 'bio_intro' || setting.key === 'bio_passion' || setting.key === 'bio_hobby' ? (
                        <Textarea
                          value={editingSettings[setting.key] || ''}
                          onChange={(e) => setEditingSettings({ ...editingSettings, [setting.key]: e.target.value })}
                          rows={3}
                        />
                      ) : (
                        <Input
                          value={editingSettings[setting.key] || ''}
                          onChange={(e) => setEditingSettings({ ...editingSettings, [setting.key]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory('about').map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <label className="text-sm font-medium">{getSettingLabel(setting.key)}</label>
                      <Textarea
                        value={editingSettings[setting.key] || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, [setting.key]: e.target.value })}
                        rows={setting.key === 'resume_url' ? 1 : 3}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory('social').map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <label className="text-sm font-medium">{getSettingLabel(setting.key)}</label>
                      <Input
                        value={editingSettings[setting.key] || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, [setting.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSettingsByCategory('skills').map((setting) => (
                    <div key={setting.key} className="space-y-2">
                      <label className="text-sm font-medium">{getSettingLabel(setting.key)}</label>
                      <Textarea
                        value={editingSettings[setting.key] || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, [setting.key]: e.target.value })}
                        rows={2}
                        placeholder='["Skill 1", "Skill 2", "Skill 3"]'
                      />
                      <p className="text-xs text-muted-foreground">Enter as JSON array: ["JavaScript", "React", "Node.js"]</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button onClick={handleSaveAllSettings} className="w-full">
                <Save className="w-4 h-4 mr-2" /> Save All Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" /> Add New Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <Input
                    placeholder="Emoji Icon (e.g., 🚀)"
                    value={newProject.image_emoji}
                    onChange={(e) => setNewProject({ ...newProject, image_emoji: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <Input
                  placeholder="Tech Stack (comma separated)"
                  value={newProject.tech_stack}
                  onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="GitHub URL"
                    value={newProject.github_url}
                    onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                  />
                  <Input
                    placeholder="Demo URL"
                    value={newProject.demo_url}
                    onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddProject}>
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id} className={!project.is_visible ? 'opacity-50' : ''}>
                  <CardContent className="p-4">
                    {editingProject?.id === project.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          />
                          <Input
                            value={editingProject.image_emoji}
                            onChange={(e) => setEditingProject({ ...editingProject, image_emoji: e.target.value })}
                          />
                        </div>
                        <Textarea
                          value={editingProject.description}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        />
                        <Input
                          value={editingProject.tech_stack.join(', ')}
                          onChange={(e) => setEditingProject({ 
                            ...editingProject, 
                            tech_stack: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          })}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            value={editingProject.github_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                            placeholder="GitHub URL"
                          />
                          <Input
                            value={editingProject.demo_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                            placeholder="Demo URL"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateProject(editingProject)}>
                            <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                          <Button variant="outline" onClick={() => setEditingProject(null)}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <span className="text-3xl">{project.image_emoji}</span>
                          <div>
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {project.tech_stack.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleToggleProjectVisibility(project)}>
                            {project.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingProject(project)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteProject(project.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="graphics">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" /> Upload New Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Design Title"
                    value={newDesign.title}
                    onChange={(e) => setNewDesign({ ...newDesign, title: e.target.value })}
                  />
                  <Input
                    placeholder="Category"
                    value={newDesign.category}
                    onChange={(e) => setNewDesign({ ...newDesign, category: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Description (optional)"
                  value={newDesign.description}
                  onChange={(e) => setNewDesign({ ...newDesign, description: e.target.value })}
                />
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    id="design-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAddDesign(file);
                    }}
                  />
                  <Button asChild disabled={uploadingImage || !newDesign.title}>
                    <label htmlFor="design-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImage ? 'Uploading...' : 'Upload Design'}
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design) => (
                <Card key={design.id} className={!design.is_visible ? 'opacity-50' : ''}>
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{design.title}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">{design.category}</Badge>
                        {design.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{design.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleToggleDesignVisibility(design)}>
                          {design.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteDesign(design.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
