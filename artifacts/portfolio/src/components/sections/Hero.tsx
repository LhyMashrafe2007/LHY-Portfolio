import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Download, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { HERO_IDENTITIES } from '@/data/initialData';
import { GradientText } from '../ui/GradientText';

const HeroScene = React.lazy(() => import('../3d/HeroScene'));

const TYPING_SPEED = 45;
const ERASING_SPEED = 25;
const PAUSE_AFTER_TYPE = 2200;
const PAUSE_AFTER_ERASE = 400;

export function Hero() {
  const { data } = useAdmin();
  const nameLetters = data.profile.name.split('');

  const [displayText, setDisplayText] = useState('');
  const [identityIndex, setIdentityIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'erasing' | 'switching'>('typing');

  const currentIdentity = HERO_IDENTITIES[identityIndex];

  const runTyping = useCallback(() => {
    let charIndex = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      charIndex++;
      setDisplayText(currentIdentity.substring(0, charIndex));
      if (charIndex >= currentIdentity.length) {
        clearInterval(interval);
        setPhase('pausing');
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [currentIdentity]);

  const runErasing = useCallback(() => {
    let charIndex = currentIdentity.length;
    const interval = setInterval(() => {
      charIndex--;
      setDisplayText(currentIdentity.substring(0, charIndex));
      if (charIndex <= 0) {
        clearInterval(interval);
        setPhase('switching');
      }
    }, ERASING_SPEED);
    return () => clearInterval(interval);
  }, [currentIdentity]);

  useEffect(() => {
    if (phase === 'typing') {
      return runTyping();
    } else if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('erasing'), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    } else if (phase === 'erasing') {
      return runErasing();
    } else {
      const t = setTimeout(() => {
        setIdentityIndex(i => (i + 1) % HERO_IDENTITIES.length);
        setPhase('typing');
      }, PAUSE_AFTER_ERASE);
      return () => clearTimeout(t);
    }
  }, [phase, runTyping, runErasing]);

  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-0" />}>
        <HeroScene />
      </Suspense>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center mt-16 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-5 sm:mb-6 px-4 py-2 rounded-full border border-white/10 glass"
        >
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs sm:text-sm font-medium tracking-wide">Dhaka, Bangladesh</span>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter mb-5 sm:mb-6 flex flex-wrap justify-center pointer-events-none gap-x-1">
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
              className={letter === ' ' ? 'w-3 sm:w-6 md:w-8' : 'inline-block drop-shadow-2xl'}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        {/* Looping identity text */}
        <div className="h-8 sm:h-10 md:h-12 mb-8 sm:mb-10 flex items-center justify-center">
          <GradientText as="h2" className="text-base sm:text-xl md:text-3xl font-medium tracking-wide text-center">
            {displayText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.75 }}
              className="inline-block w-[2px] h-[0.9em] bg-primary ml-0.5 align-middle"
            />
          </GradientText>
        </div>

        {/* Available for hire badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 mb-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-400 text-xs font-mono tracking-wider">Available for work</span>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {/* Primary CTA */}
          <button
            onClick={handleScrollToProjects}
            className="group relative px-8 py-3.5 rounded-xl font-medium text-base overflow-hidden transition-all duration-300 w-full sm:w-auto"
            style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #7000ff 100%)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(0,212,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.3)')}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-semibold">
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>

          {/* Secondary CTA */}
          <a
            href={data.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-3.5 rounded-xl font-medium text-base overflow-hidden transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 hover:border-primary/50 hover:bg-primary/5 text-white hover:text-primary"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <Download className="w-4 h-4 group-hover:animate-bounce" />
            <span className="font-semibold">Download Resume</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-0.5 h-10 sm:h-12 bg-gradient-to-b from-primary to-transparent"
          animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5], y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
