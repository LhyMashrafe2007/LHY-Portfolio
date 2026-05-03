import React, { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen noise-bg bg-background text-foreground">
      <CustomCursor />
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
