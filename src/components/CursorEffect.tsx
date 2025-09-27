import { useEffect, useState } from 'react';

interface Trail {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

const CursorEffect = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let trailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Add new trail point
      setTrails(prev => [
        ...prev.slice(-10), // Keep only last 10 points
        {
          id: trailId++,
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
        }
      ]);
    };

    // Fade out trail points
    const fadeInterval = setInterval(() => {
      setTrails(prev => 
        prev
          .map(trail => ({ ...trail, opacity: trail.opacity - 0.1 }))
          .filter(trail => trail.opacity > 0)
      );
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(fadeInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Main cursor */}
      <div
        className="fixed w-4 h-4 bg-primary rounded-full mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          left: mousePos.x - 8,
          top: mousePos.y - 8,
          transform: 'scale(1)',
        }}
      />

      {/* Trailing particles */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed w-2 h-2 bg-cyan-400 rounded-full"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            opacity: trail.opacity * 0.6,
            transform: `scale(${trail.opacity})`,
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}

      {/* Outer cursor ring */}
      <div
        className="fixed w-8 h-8 border-2 border-primary rounded-full transition-all duration-200 ease-out mix-blend-difference"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
        }}
      />
    </div>
  );
};

export default CursorEffect;