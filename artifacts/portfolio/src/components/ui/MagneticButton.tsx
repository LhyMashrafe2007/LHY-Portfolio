import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: 'primary' | 'outline' | 'ghost';
  as?: any;
  href?: string;
  target?: string;
  rel?: string;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, strength = 30, variant = 'primary', as: Component = 'button', ...props }, ref) => {
    const magneticRef = useMagneticEffect(strength) as React.RefObject<any>;

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan border-transparent",
      outline: "border-primary/50 text-primary hover:bg-primary/10 glass",
      ghost: "text-foreground hover:text-primary hover:bg-white/5",
    };

    return (
      <Component
        ref={(node: any) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          if (magneticRef) magneticRef.current = node;
        }}
        className={cn(
          "relative px-6 py-3 rounded-md font-medium transition-colors duration-300 overflow-hidden group",
          variants[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        {variant === 'primary' && (
          <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </Component>
    );
  }
);

MagneticButton.displayName = "MagneticButton";
