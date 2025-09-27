import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  type: 'circle' | 'triangle' | 'square';
  size: number;
  x: number;
  y: number;
  animationDelay: number;
  duration: number;
}

const FloatingShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const generateShapes = () => {
      const newShapes: Shape[] = [];
      const shapeTypes: ('circle' | 'triangle' | 'square')[] = ['circle', 'triangle', 'square'];
      
      for (let i = 0; i < 15; i++) {
        newShapes.push({
          id: i,
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          size: Math.random() * 40 + 20,
          x: Math.random() * 100,
          y: Math.random() * 100,
          animationDelay: Math.random() * 20,
          duration: Math.random() * 20 + 15,
        });
      }
      setShapes(newShapes);
    };

    generateShapes();
  }, []);

  const getShapeElement = (shape: Shape) => {
    const baseClasses = "absolute opacity-10 animate-pulse";
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      animationDelay: `${shape.animationDelay}s`,
      animationDuration: `${shape.duration}s`,
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className={`${baseClasses} rounded-full bg-gradient-to-br from-primary to-cyan-400`}
            style={style}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            className={`${baseClasses} bg-gradient-to-br from-primary to-cyan-400`}
            style={{
              ...style,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            className={`${baseClasses} bg-gradient-to-br from-primary to-cyan-400 rotate-45`}
            style={style}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => getShapeElement(shape))}
      
      {/* Additional floating elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-bounce opacity-60" 
           style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-40" 
           style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-primary rounded-full animate-bounce opacity-50" 
           style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
      <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-cyan-300 opacity-30 animate-spin" 
           style={{ animationDuration: '8s' }} />
    </div>
  );
};

export default FloatingShapes;