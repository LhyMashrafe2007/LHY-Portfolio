import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { MagneticButton } from '../ui/MagneticButton';

export function Footer() {
  const { data } = useAdmin();

  return (
    <footer className="py-12 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            LHY Mashrafe © 2026 · Built with React & Three.js
          </span>
        </div>

        <div className="flex items-center gap-4">
          <MagneticButton as="a" href={data.contactLinks.github} target="_blank" rel="noopener noreferrer" variant="ghost" className="p-2">
            <Github className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton as="a" href={data.contactLinks.linkedin} target="_blank" rel="noopener noreferrer" variant="ghost" className="p-2">
            <Linkedin className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton as="a" href={data.contactLinks.twitter} target="_blank" rel="noopener noreferrer" variant="ghost" className="p-2">
            <Twitter className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton as="a" href={`mailto:${data.contactLinks.email}`} variant="ghost" className="p-2">
            <Mail className="w-5 h-5" />
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}
