import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Download,
  Code,
  Database,
  Globe,
  Smartphone,
  Server,
  Cpu,
  ArrowDown,
  Send,
  MessageCircle,
  Twitter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-bg.jpg";

const Portfolio = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const projects = [
    {
      title: "Portfolio Website",
      description: "A personal portfolio built with modern web technologies to showcase my work, skills, and experiences.",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      github: "https://github.com/redcoder-008",
      demo: "https://www.karankamat.com.np",
      image: "👨‍💻"
    },
    {
      title: "Daily Track",
      description: "A web and mobile app that helps users track daily expenses, manage to-do lists, scan bills, and write notes.",
      techStack: ["React", "Node.js", "MongoDB", "Mobile App"],
      github: "https://github.com/redcoder-008",
      demo: "https://daily-track-eight.vercel.app/",
      image: "📱"
    },
    {
      title: "Pop Mitra",
      description: "An AI-powered application that generates titles, descriptions, and hashtags using the Gemini API based on profile details.",
      techStack: ["React", "Gemini API", "AI/ML", "JavaScript"],
      github: "https://github.com/redcoder-008",
      demo: "https://popmitra.vercel.app/",
      image: "🤖"
    }
  ];

  const skills = [
    { name: "JavaScript", icon: <Code className="w-5 h-5" /> },
    { name: "React", icon: <Globe className="w-5 h-5" /> },
    { name: "Node.js", icon: <Server className="w-5 h-5" /> },
    { name: "MongoDB", icon: <Database className="w-5 h-5" /> },
    { name: "Express", icon: <Cpu className="w-5 h-5" /> },
    { name: "TypeScript", icon: <Code className="w-5 h-5" /> },
    { name: "Python", icon: <Cpu className="w-5 h-5" /> },
    { name: "PostgreSQL", icon: <Database className="w-5 h-5" /> },
    { name: "React Native", icon: <Smartphone className="w-5 h-5" /> },
    { name: "Docker", icon: <Server className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-center section-spacing"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container-custom relative z-10">
          <div className="fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Karan Kumar <span className="hero-text-gradient">Kamat</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 font-medium">
              Computer Engineering Graduate | MERN Stack Developer
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              Passionate about coding, problem-solving, and building applications that make life easier using modern technologies and AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up-delay">
              <Button className="btn-hero">
                View My Work
              </Button>
              <Button className="btn-outline-hero">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/70" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-spacing bg-surface">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 fade-in-up">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
                <p className="text-lg text-muted-foreground mb-6 text-left">
                  Hi, I'm Karan Kumar Kamat from Dhanpalthan-7, Morang, Nepal. I recently completed 
                  my Diploma in Computer Engineering and am passionate about coding, problem-solving, 
                  and building applications that make life easier.
                </p>
                <p className="text-lg text-muted-foreground mb-6 text-left">
                  I have knowledge of programming languages such as Java, C++, and Python, and also 
                  have basic experience with the MERN stack. I enjoy learning new technologies and 
                  exploring how AI can be used to create innovative solutions.
                </p>
                <p className="text-lg text-muted-foreground mb-8 text-left">
                  Through my projects, I have gained practical experience and experimented with using 
                  AI tools to build functional and useful applications that solve real-world problems.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-hero">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </div>
              
              <div className="fade-in-up-delay">
                <h3 className="text-2xl font-semibold mb-6">Core Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.slice(0, 6).map((skill, index) => (
                    <div key={index} className="skill-badge flex items-center gap-3">
                      {skill.icon}
                      <span className="font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-spacing">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 fade-in-up">Featured Projects</h2>
            <p className="text-xl text-muted-foreground fade-in-up-delay">
              Here are some of my recent projects that showcase my skills and experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className={`card-hover fade-in-up-${index === 0 ? '' : index === 1 ? 'delay' : 'delay-2'}`}>
                <CardHeader>
                  <div className="text-4xl mb-4">{project.image}</div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-spacing bg-surface">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 fade-in-up">Tech Stack</h2>
            <p className="text-xl text-muted-foreground fade-in-up-delay">
              Technologies and tools I work with
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className={`skill-badge text-center fade-in-up${index > 4 ? '-delay' : ''}`}
              >
                <div className="flex flex-col items-center gap-3">
                  {skill.icon}
                  <span className="font-medium">{skill.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-spacing">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up">Get In Touch</h2>
              <p className="text-xl text-muted-foreground fade-in-up-delay">
                Let's work together on your next project
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="fade-in-up">
                <h3 className="text-2xl font-semibold mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">redcoder008@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Github className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">GitHub</p>
                      <a 
                        href="https://github.com/redcoder-008" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        github.com/redcoder-008
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Linkedin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <a 
                        href="https://www.linkedin.com/in/krnkmt/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        linkedin.com/in/krnkmt
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Twitter className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <a 
                        href="https://x.com/karankewat_008" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        @karankewat_008
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp Support</p>
                      <a 
                        href="https://wa.me/9779804005610" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-green-500 transition-colors"
                      >
                        +977 980-400-5610
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="fade-in-up-delay">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full"
                    />
                  </div>
                  
                  <Button type="submit" className="btn-hero w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface py-8">
        <div className="container-custom">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2024 Karan Kumar Kamat. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;