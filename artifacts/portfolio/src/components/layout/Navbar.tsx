import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { GradientText } from '../ui/GradientText';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Highlight active section based on scroll position
      const sections = navLinks.map(link => document.getElementById(link.href.substring(1)));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (section && 
            section.offsetTop <= scrollPosition && 
            section.offsetTop + section.offsetHeight > scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-4 glass' : 'py-6 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#home" onClick={(e) => handleSmoothScroll(e, '#home')} className="group flex items-center gap-2">
            <div className="relative flex items-center justify-center overflow-hidden" style={{ height: '36px' }}>
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, #7000ff, #ff006e, #00d4ff)',
                  backgroundSize: '300% 100%',
                  padding: '1.5px',
                  borderRadius: '8px',
                }}
              >
                <div className="bg-background rounded-[6px] px-3 h-full flex items-center">
                  <span
                    className="font-display font-bold text-base tracking-widest"
                    style={{
                      background: 'linear-gradient(90deg, #00d4ff, #7000ff, #ff006e)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    ITXLHY
                  </span>
                </div>
              </motion.div>
              {/* Invisible spacer for width */}
              <span className="font-display font-bold text-base tracking-widest opacity-0 px-3">ITXLHY</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="relative text-sm font-medium tracking-wide py-2"
              >
                <span className={activeSection === link.href.substring(1) ? 'text-white' : 'text-muted-foreground hover:text-white transition-colors'}>
                  {link.name}
                </span>
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary glow-cyan"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} 
              className="w-6 h-0.5 bg-white block" 
            />
            <motion.span 
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} 
              className="w-6 h-0.5 bg-white block" 
            />
            <motion.span 
              animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} 
              className="w-6 h-0.5 bg-white block" 
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-[55] bg-background/90 flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-4xl font-display font-bold hover:text-primary transition-colors"
                >
                  <GradientText>{link.name}</GradientText>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
