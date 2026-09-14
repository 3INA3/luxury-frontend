'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import { Mesh } from 'three';
import { motion } from 'framer-motion';

function FloatingOrb({ position, color, speed = 1, scale = 1 }: any) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={ref} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#d4af37" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#e94560" />
      <FloatingOrb position={[-2, 0.5, 0]} color="#d4af37" speed={0.8} scale={0.9} />
      <FloatingOrb position={[2, -0.3, -1]} color="#c0c0c0" speed={1.2} scale={0.7} />
      <FloatingOrb position={[0, 1.2, -2]} color="#b8860b" speed={0.6} scale={0.5} />
      <FloatingOrb position={[-1.5, -1, 1]} color="#e94560" speed={1} scale={0.4} />
      <Environment preset="city" />
    </>
  );
}

export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const isMobile = window.innerWidth < 768;
    if (isMobile) setReduceMotion(true);
  }, []);

  if (!mounted || reduceMotion) {
    return (
      <div className="absolute inset-0 bg-luxury-gradient flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
