import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
}

export function TiltCard({ children, className, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct * 20); // max rotation 10deg
    y.set(yPct * -20);
    
    if (glare) {
      setGlarePosition({
        x: (mouseX / width) * 100,
        y: (mouseY / height) * 100,
        opacity: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (glare) {
      setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: y,
        rotateY: x,
        transformStyle: "preserve-3d",
      }}
    >
      <div 
        className="w-full h-full relative"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
        
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 z-50 rounded-xl transition-opacity duration-300"
            style={{
              opacity: glarePosition.opacity,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
