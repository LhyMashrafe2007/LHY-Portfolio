import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, Sphere, TorusKnot, Environment, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';

function FloatingShapes() {
  const mousePosition = useMousePosition();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const targetX = (mousePosition.x / width - 0.5) * 2;
    const targetY = (mousePosition.y / height - 0.5) * 2;
    groupRef.current.rotation.y += 0.002;
    groupRef.current.rotation.x += 0.001;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX * 1.5, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -targetY * 1.5, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <TorusKnot args={[1, 0.3, 128, 32]} position={[-3, 1, -2]} scale={0.8}>
          <MeshDistortMaterial color="#00d4ff" emissive="#0055ff" emissiveIntensity={0.5} distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
        </TorusKnot>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[4, -1, -3]} scale={1.2}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7000ff" emissive="#3a00ff" emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2.5}>
        <Sphere args={[0.6, 32, 32]} position={[0, -2.5, 1]}>
          <MeshDistortMaterial color="#ff006e" emissive="#ff0044" emissiveIntensity={0.4} distort={0.4} speed={3} roughness={0.1} metalness={0.9} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#00d4ff" intensity={2} />
        <pointLight position={[10, -10, -5]} color="#ff006e" intensity={2} />
        <FloatingShapes />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#00d4ff" />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
