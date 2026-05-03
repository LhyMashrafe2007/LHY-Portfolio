import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { GradientText } from '../ui/GradientText';
import { TiltCard } from '../ui/TiltCard';

export function Projects() {
  const { data } = useAdmin();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(data.projects.map(p => p.category)))];

  const filteredProjects = filter === 'All' 
    ? data.projects 
    : data.projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">// Featured Work</h2>
          <GradientText as="h3" className="text-5xl md:text-7xl font-display tracking-tight">
            Selected Projects
          </GradientText>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-mono text-sm transition-all duration-300 ${
                filter === cat 
                  ? 'bg-primary text-primary-foreground glow-cyan border border-transparent' 
                  : 'glass text-muted-foreground hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <TiltCard className="h-full w-full">
                  <div className="glass rounded-2xl overflow-hidden flex flex-col h-full group border border-white/10 hover:border-primary/50 transition-colors">
                    {/* Image Placeholder */}
                    <div className="h-48 w-full bg-gradient-to-br from-muted to-background relative overflow-hidden flex-shrink-0">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                          <span className="font-display text-4xl font-bold opacity-30">{project.title.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 text-xs font-mono rounded-full flex items-center gap-2 border ${
                          project.status === 'Live' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${project.status === 'Live' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                          {project.status}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <span className="text-xs font-mono text-primary mb-2 block">{project.category}</span>
                        <h4 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{project.title}</h4>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-6 flex-grow">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-4 mt-auto pt-4 border-t border-white/10">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <ExternalLink className="w-4 h-4" /> Live Demo
                          </a>
                        )}
                        {project.sourceUrl && (
                          <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                            <Github className="w-4 h-4" /> Source
                          </a>
                        )}
                        {(!project.liveUrl && !project.sourceUrl) && (
                          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground/50">
                            Details restricted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
