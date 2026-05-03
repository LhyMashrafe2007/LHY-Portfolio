import { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ value, duration = 2, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalMilSecs = duration * 1000;
      const incrementTime = totalMilSecs / end;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}
