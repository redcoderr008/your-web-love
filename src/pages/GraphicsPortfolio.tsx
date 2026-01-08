import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, X } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

interface GraphicsDesign {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
}

const GraphicsPortfolio = () => {
  const [designs, setDesigns] = useState<GraphicsDesign[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<GraphicsDesign | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchDesigns = async () => {
      const { data, error } = await supabase
        .from('graphics_designs')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      
      if (!error && data) {
        setDesigns(data);
      }
    };

    fetchDesigns();
  }, []);

  const categories = ['All', ...Array.from(new Set(designs.map(d => d.category)))];
  const filteredDesigns = selectedCategory === 'All' 
    ? designs 
    : designs.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
          <h1 className="text-2xl font-bold gradient-text">Graphics Design</h1>
          <div className="w-[120px]"></div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredDesigns.map((design) => (
            <Card 
              key={design.id} 
              className="break-inside-avoid cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden"
              onClick={() => setSelectedDesign(design)}
            >
              <div className="relative">
                <img
                  src={design.image_url}
                  alt={design.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold">{design.title}</h3>
                    <Badge variant="secondary" className="mt-1">{design.category}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredDesigns.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">No designs found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedDesign && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedDesign(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedDesign(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div 
            className="max-w-5xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedDesign.image_url}
              alt={selectedDesign.title}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            <div className="text-center mt-4 text-white">
              <h2 className="text-2xl font-bold">{selectedDesign.title}</h2>
              <Badge variant="secondary" className="mt-2">{selectedDesign.category}</Badge>
              {selectedDesign.description && (
                <p className="mt-2 text-white/80">{selectedDesign.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphicsPortfolio;
