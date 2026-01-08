import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Twitter,
  Palette,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-bg.jpg";
import karanPhoto from "@/assets/karan-photo.jpg";
import AnimatedBackground from "./AnimatedBackground";
import FloatingShapes from "./FloatingShapes";
import CursorEffect from "./CursorEffect";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  image_emoji: string;
}

interface GraphicsDesign {
  id: string;
  title: string;
  image_url: string;
  category: string;
}
const TypedText = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const texts = ["Student", "Coder", "Web Developer", "Problem Solver"];

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];

    if (isTyping) {
      if (currentText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentTextIndex, isTyping, texts]);

  return (
    <span className="text-primary">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Portfolio = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message not sent!",
      description: "Thank you for your time. This feature is comming soon",
    });
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };
  const [projects, setProjects] = useState<Project[]>([]);
  const [graphicsDesigns, setGraphicsDesigns] = useState<GraphicsDesign[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      
      if (!error && data) {
        setProjects(data);
      }
    };

    const fetchGraphicsDesigns = async () => {
      const { data, error } = await supabase
        .from('graphics_designs')
        .select('*')
        .eq('is_visible', true)
        .order('display_order')
        .limit(6);
      
      if (!error && data) {
        setGraphicsDesigns(data);
      }
    };

    fetchProjects();
    fetchGraphicsDesigns();
  }, []);

  const fallbackProjects = [
    {
      id: '1',
      title: "Portfolio Website",
      description: "A personal portfolio built with modern web technologies to showcase my work, skills, and experiences.",
      tech_stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
      github_url: "https://github.com/redcoder-008",
      demo_url: "https://www.karankamat.com.np",
      image_emoji: "👨‍💻",
    },
    {
      id: '2',
      title: "Daily Track",
      description: "A web and mobile app that helps users track daily expenses, manage to-do lists, scan bills, and write notes.",
      tech_stack: ["React", "Node.js", "MongoDB", "Mobile App"],
      github_url: "https://github.com/redcoder-008",
      demo_url: "https://daily-track-eight.vercel.app/",
      image_emoji: "📱",
    },
    {
      id: '3',
      title: "Pop Mitra",
      description: "An AI-powered application that generates titles, descriptions, and hashtags using the Gemini API based on profile details.",
      tech_stack: ["React", "Gemini API", "AI/ML", "JavaScript"],
      github_url: "https://github.com/redcoder-008",
      demo_url: "https://popmitra.vercel.app/",
      image_emoji: "🤖",
    },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const skills = [
    {
      name: "JavaScript",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "React",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      name: "Node.js",
      icon: <Server className="w-5 h-5" />,
    },
    {
      name: "MongoDB",
      icon: <Database className="w-5 h-5" />,
    },
    {
      name: "Express",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: "TypeScript",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "Python",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      name: "PostgreSQL",
      icon: <Database className="w-5 h-5" />,
    },
    {
      name: "React Native",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      name: "Docker",
      icon: <Server className="w-5 h-5" />,
    },
  ];
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cool Effects */}
      <AnimatedBackground />
      <FloatingShapes />
      <CursorEffect />
      {/* Hero Section */}
      <section className="relative min-h-screen bg-background section-spacing">
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Left side - Text content */}
            <div className="fade-in-up">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                  Karan
                  <span className="text-primary gradient-text">
                    {" "}
                    Kumar
                  </span>{" "}
                  <br />
                  <span className="">Kamat</span>
                </h1>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Hi, It's{" "}
                <span className="text-primary gradient-text">Karan</span>
              </h2>
              <p className="text-2xl mb-8 font-medium">
                <span className="text-white">I'm a </span>
                <TypedText />
              </p>

              <div className="text-muted-foreground space-y-4 mb-8">
                <p>
                  Hello! I'm Karan Kumar Kamat from Dhanpalthan-7, Kamalpur,
                  Nepal. I completed  Diploma in Computer Engineering from
                  Adarsha Secondary School which is located at Biratnagar-7.
                </p>
                <p className="text-base">
                  Computer Engineering graduate passionate about solving complex
                  problems with elegant solutions. I live for those "Aha!"
                  moments when debugging code at 2 AM.
                </p>
                <p className="text-base">
                  When I'm not optimizing algorithms, you'll find me exploring
                  the latest tech trends or building something cool that
                  probably nobody asked for (but everyone ends up loving).
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mb-8">
                <a
                  href="https://www.linkedin.com/in/krnkmt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/redcoder-008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/9779804005610"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/karankewat_008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>

              <div className="flex gap-4">
                <a href="mailto:redcoder008@gmail.com.com?subject=Hiring Inquiry">
                  <Button className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-full">
                    Hire
                  </Button>{" "}
                </a>
                <a href="https://wa.me/9779804005610">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded-full"
                  >
                    Contact
                  </Button>{" "}
                </a>
              </div>
            </div>

            {/* Right side - Profile photo */}
            <div className="fade-in-up-delay flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl float-animation glow-animation">
                  <img
                    src={karanPhoto}
                    alt="Karan Kumar Kamat - Computer Engineering Student"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-primary/50 to-transparent opacity-20 animate-pulse"></div>
              </div>
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
            <h2 className="text-4xl font-bold mb-8 fade-in-up gradient-text">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="fade-in-up">
                <p className="text-lg text-muted-foreground mb-6 text-left">
                  I'm a passionate developer mastering Data Structures &
                  Algorithms with Java. I believe clean code and optimized
                  algorithms can solve real-world problems.
                </p>
                <p className="text-lg text-muted-foreground mb-6 text-left">
                  When I'm not cracking coding problems, you'll find me: •
                  Solving challenges on LeetCode & CodeChef • Building projects
                  to sharpen my skills • Sharing my DSA learning journey
                </p>
                <p className="text-lg text-muted-foreground mb-8 text-left">
                  My Tech Toolkit: Java | Data Structures | Algorithms | OOP |
                  Problem Solving |
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/KaranKumarKamat(Resume).pdf " download>
                    <Button className="btn-hero">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </a>
                </div>
              </div>

              <div className="fade-in-up-delay">
                <h3 className="text-2xl font-semibold mb-6">Core Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {skills.slice(0, 6).map((skill, index) => (
                    <div
                      key={index}
                      className="skill-badge flex items-center gap-3"
                    >
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
            <h2 className="text-4xl font-bold mb-4 fade-in-up">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground fade-in-up-delay">
              Here are some of my recent projects that showcase my skills and
              experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <Card
                key={project.id}
                className={`card-hover fade-in-up-${
                  index === 0 ? "" : index === 1 ? "delay" : "delay-2"
                }`}
              >
                <CardHeader>
                  <div className="text-4xl mb-4">{project.image_emoji}</div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button size="sm" className="flex-1" asChild>
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Graphics Design Section */}
      {graphicsDesigns.length > 0 && (
        <section id="graphics" className="section-spacing bg-surface">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-in-up flex items-center justify-center gap-3">
                <Palette className="w-10 h-10 text-primary" />
                Graphics Design
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up-delay">
                Some of my creative design work
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {graphicsDesigns.map((design) => (
                <Card key={design.id} className="overflow-hidden card-hover">
                  <div className="aspect-video relative">
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <h3 className="text-white font-semibold">{design.title}</h3>
                        <Badge variant="secondary" className="mt-1">{design.category}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/graphics">
                <Button size="lg" className="gap-2">
                  View Full Portfolio <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

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
                className={`skill-badge text-center fade-in-up${
                  index > 4 ? "-delay" : ""
                }`}
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
              <h2 className="text-4xl font-bold mb-4 fade-in-up">
                Get In Touch
              </h2>
              <p className="text-xl text-muted-foreground fade-in-up-delay">
                Let's work together on your next project
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="fade-in-up">
                <h3 className="text-2xl font-semibold mb-8">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">
                        redcoder008@gmail.com
                      </p>
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
                      <p className="font-medium">WhatsApp </p>
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
              © Karan Kumar Kamat. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Portfolio;
