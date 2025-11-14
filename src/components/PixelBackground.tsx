import { useEffect, useState } from 'react';

export function PixelBackground() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    // Generate random pixel stars
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() > 0.7 ? 2 : 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      <div className="pixel-stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="pixel-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              width: star.size === 2 ? '12px' : '8px',
              height: star.size === 2 ? '12px' : '8px',
            }}
          />
        ))}
      </div>
      
      {/* Grid overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px),
            linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </>
  );
}
