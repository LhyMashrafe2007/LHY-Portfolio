import { useEffect, useRef } from 'react';

export function useMagneticEffect(strength: number = 30) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Only apply effect if within 100px radius
      const distance = Math.sqrt(x * x + y * y);
      if (distance < 100) {
        element.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      } else {
        element.style.transform = 'translate(0px, 0px)';
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
