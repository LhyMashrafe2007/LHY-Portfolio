import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAdmin } from '@/context/AdminContext';
import { GradientText } from '../ui/GradientText';

export function Skills() {
  const { data } = useAdmin();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Group skills by category
  const categories = useMemo(() => {
    const cats: Record<string, typeof data.skills> = {};
    data.skills.forEach(skill => {
      if (!cats[skill.category]) cats[skill.category] = [];
      cats[skill.category].push(skill);
    });
    return cats;
  }, [data.skills]);

  return (
    <section id="skills" className="py-32 relative overflow-hidden" ref={ref}>
      {/* Animated gradient background blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">// Technical Arsenal</h2>
          <GradientText as="h3" className="text-5xl md:text-7xl font-display tracking-tight">
            Interactive Galaxy
          </GradientText>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Object.entries(categories).map(([category, skills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="glass p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h4 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">{category}</h4>
              
              <div className="space-y-6">
                {skills.map((skill, skillIndex) => (
                  <div key={skill.id} className="relative">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-muted-foreground group-hover:text-white transition-colors">{skill.name}</span>
                      <span className="text-xs font-mono text-primary">{skill.proficiency}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary relative"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: 0.5 + (catIndex * 0.1) + (skillIndex * 0.05), ease: "easeOut" }}
                      >
                        <div className="absolute inset-0 bg-white/20 blur-[2px] animate-pulse" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
