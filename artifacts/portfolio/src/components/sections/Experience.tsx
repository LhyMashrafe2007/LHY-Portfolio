import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';
import { GradientText } from '../ui/GradientText';
import { TiltCard } from '../ui/TiltCard';

export function Experience() {
  const { data } = useAdmin();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="experience" className="py-32 relative" ref={containerRef}>
      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-24">
          <h2 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">// Career Path</h2>
          <GradientText as="h3" className="text-5xl md:text-7xl font-display tracking-tight">
            Experience
          </GradientText>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 hidden md:block" />
          <motion.div 
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2 origin-top hidden md:block"
            style={{ scaleY: lineHeight }}
          />

          <div className="space-y-12 md:space-y-24 relative">
            {data.experience.map((exp, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={exp.id} className={`flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-background bg-primary z-10 items-center justify-center glow-cyan">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-1/2" />
                  
                  {/* Card Content */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}
                  >
                    <TiltCard className="h-full">
                      <div className="glass p-8 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-colors h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 group-hover:glow-cyan transition-all">
                            <span className="font-display font-bold text-xl">{exp.company.substring(0, 1)}</span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                            <span className="text-sm font-mono text-primary">{exp.company} | {exp.date}</span>
                          </div>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="text-muted-foreground text-sm flex items-start">
                              <span className="text-primary mr-2 mt-1">▹</span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {exp.techStack.map((tech, i) => (
                            <span key={i} className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-muted-foreground group-hover:border-primary/20 transition-colors">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
