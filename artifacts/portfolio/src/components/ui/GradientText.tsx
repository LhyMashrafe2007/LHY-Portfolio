import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children?: React.ReactNode;
  className?: string;
  as?: string;
}

export function GradientText({ children, className, as = 'span' }: GradientTextProps) {
  return React.createElement(
    as,
    { className: cn("gradient-text font-bold", className) },
    children
  );
}
