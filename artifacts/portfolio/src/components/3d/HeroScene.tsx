import React, { useEffect, useState, useRef } from 'react';

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

function useMemoParticles(count: number) {
  const ref = useRef<Array<{
    width: string; height: string; background: string;
    left: string; top: string; opacity: number;
    duration: number; delay: number;
  }>>([]);
  if (ref.current.length === 0) {
    ref.current = Array.from({ length: count }, () => ({
      width: Math.random() * 2 + 0.5 + 'px',
      height: Math.random() * 2 + 0.5 + 'px',
      background: ['#00d4ff', '#7000ff', '#ff006e'][Math.floor(Math.random() * 3)],
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: Math.random() * 0.4 + 0.2,
      duration: Math.random() * 8 + 5,
      delay: Math.random() * 8,
    }));
  }
  return ref.current;
}

function MobileBackground() {
  const particles = useMemoParticles(18);
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 10% 10%, rgba(0,212,255,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 70% 50% at 90% 90%, rgba(255,0,110,0.10) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(112,0,255,0.06) 0%, transparent 70%)
        `,
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.width,
            height: p.height,
            background: p.background,
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function DesktopBackground() {
  const particles = useMemoParticles(50);
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, #00d4ff 0%, #7000ff 50%, transparent 80%)',
          top: '-100px', left: '-100px',
          opacity: 0.20,
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, #ff006e 0%, #7000ff 60%, transparent 80%)',
          bottom: '-50px', right: '-50px',
          opacity: 0.15,
          filter: 'blur(80px)',
          animation: 'float 6s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)',
          top: '40%', right: '20%',
          opacity: 0.08,
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.width, height: p.height,
            background: p.background,
            left: p.left, top: p.top,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `-${p.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

export default function HeroScene() {
  const [canUseWebGL, setCanUseWebGL] = useState(false);
  const [WebGLComponent, setWebGLComponent] = useState<React.ComponentType | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const m = isMobileDevice();
    setMobile(m);
    if (m) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        setCanUseWebGL(true);
        import('./HeroScene3D').then(mod => {
          setWebGLComponent(() => mod.default);
        }).catch(() => setCanUseWebGL(false));
      }
    } catch {
      setCanUseWebGL(false);
    }
  }, []);

  if (canUseWebGL && WebGLComponent) return <WebGLComponent />;
  if (mobile) return <MobileBackground />;
  return <DesktopBackground />;
}
