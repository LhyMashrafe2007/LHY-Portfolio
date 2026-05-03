import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, User, Briefcase, Star, Mail, Home } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'home', label: 'Go to Home', description: 'Back to the top', icon: <Home className="w-4 h-4" />, action: () => scrollTo('home'), category: 'Navigate' },
    { id: 'about', label: 'About Me', description: 'Learn more about LHY', icon: <User className="w-4 h-4" />, action: () => scrollTo('about'), category: 'Navigate' },
    { id: 'skills', label: 'Skills', description: 'Technical arsenal', icon: <Star className="w-4 h-4" />, action: () => scrollTo('skills'), category: 'Navigate' },
    { id: 'experience', label: 'Experience', description: 'Work history', icon: <Briefcase className="w-4 h-4" />, action: () => scrollTo('experience'), category: 'Navigate' },
    { id: 'projects', label: 'Projects', description: 'What I have built', icon: <ArrowRight className="w-4 h-4" />, action: () => scrollTo('projects'), category: 'Navigate' },
    { id: 'contact', label: 'Contact', description: 'Get in touch', icon: <Mail className="w-4 h-4" />, action: () => scrollTo('contact'), category: 'Navigate' },
  ];

  const scrollTo = (section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || (c.description || '').toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(v => !v);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) { filtered[selectedIndex].action(); setIsOpen(false); }
  };

  return (
    <>
      {/* Trigger hint */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 glass px-3 py-2 rounded-lg border border-white/10 text-xs font-mono text-muted-foreground cursor-pointer hover:border-primary/30 hover:text-white transition-all" onClick={() => setIsOpen(true)}>
        <Search className="w-3.5 h-3.5" />
        <span>Quick nav</span>
        <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
            >
              <div className="bg-[#0f0f18] border border-white/15 rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}>
                {/* Search */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                  <Search className="w-5 h-5 text-primary shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search or navigate..."
                    className="flex-1 bg-transparent text-white outline-none font-mono text-sm placeholder:text-white/30"
                  />
                  <kbd className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-1 rounded border border-white/10">ESC</kbd>
                </div>

                {/* Commands */}
                <div className="py-2 max-h-80 overflow-y-auto">
                  {filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground font-mono text-sm py-8">No results found</p>
                  ) : (
                    filtered.map((cmd, i) => (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); setIsOpen(false); }}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === selectedIndex ? 'bg-primary/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                      >
                        <span className={`${i === selectedIndex ? 'text-primary' : 'text-muted-foreground'} shrink-0`}>{cmd.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono">{cmd.label}</p>
                          {cmd.description && <p className="text-xs text-white/30 mt-0.5">{cmd.description}</p>}
                        </div>
                        <span className="text-xs font-mono text-white/20 shrink-0">{cmd.category}</span>
                        {i === selectedIndex && <ArrowRight className="w-4 h-4 text-primary shrink-0" />}
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                    <span>esc close</span>
                  </div>
                  <span className="text-xs text-white/20 font-mono">LHY Portfolio</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
