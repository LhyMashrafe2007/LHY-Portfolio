import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { TiltCard } from '../ui/TiltCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { GradientText } from '../ui/GradientText';

export function About() {
  const { data } = useAdmin();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: "Years Experience", value: 5, suffix: "+" },
    { label: "Projects Completed", value: 50, suffix: "+" },
    { label: "Technologies Mastered", value: 20, suffix: "+" },
  ];

  // Simple function to highlight specific words in cyan
  const highlightWords = (text: string) => {
    const keywords = ['cinematic', 'scalable', 'deep space', 'neon Tokyo', 'unforgettable'];
    let result = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(regex, '<span class="text-primary font-medium">$1</span>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <section id="about" className="py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <motion.div 
          className="flex flex-col lg:flex-row gap-16 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* Image Side */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <TiltCard className="w-72 h-72 md:w-96 md:h-96 rounded-full">
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-tr from-primary via-secondary to-accent">
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, transparent, rgba(255,255,255,0.5), transparent)',
                  }}
                />
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-background relative z-10">
                  {data.profile.profileImageUrl ? (
                    <img 
                      src={data.profile.profileImageUrl} 
                      alt={data.profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-display font-bold text-muted-foreground">LM</span>
                  )}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-3/5 space-y-8">
            <div>
              <h2 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">// About Me</h2>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-muted-foreground">
                {highlightWords(data.profile.bio)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-y border-white/10">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                    {isInView ? <AnimatedCounter value={stat.value} suffix={stat.suffix} /> : '0'}
                  </span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>

            <div>
              <a
                href={data.profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base border border-primary/40 hover:border-primary hover:bg-primary/10 text-white transition-all duration-300"
                style={{ backdropFilter: 'blur(10px)' }}
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
