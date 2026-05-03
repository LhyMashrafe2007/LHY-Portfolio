import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (event: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: event.clientX,
          y: event.clientY,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return mousePosition;
}
