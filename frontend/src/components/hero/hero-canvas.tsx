"use client";

import * as THREE from "three";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";

// A modern, particle-based wave effect
const ParticleWave = () => {
  const count = 2000;
  const ref = useRef<THREE.Points>(null!);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const y = 0;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Modern gradient colors (cyan to purple)
      const mixedColor = i % 2 === 0 ? "#06b6d4" : "#8b5cf6"; 
      color.set(mixedColor);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return [positions, colors];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const z = positions[i3 + 2];
      
      // Complex wave movement
      positions[i3 + 1] = 
        Math.sin(x * 0.3 + time * 0.5) * 1.2 + 
        Math.sin(z * 0.4 + time * 0.3) * 1.2 + 
        Math.sin((x + z) * 0.1 + time * 0.2) * 0.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[0, -2, 0]} rotation={[-Math.PI / 3, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Deep dark background */}
          <color attach="background" args={["#020617"]} />
          <fog attach="fog" args={["#020617", 5, 25]} />
          
          {/* Ambient lighting */}
          <ambientLight intensity={0.5} />
          
          {/* The Main Wave Effect */}
          <ParticleWave />

          {/* Background Sparkles (The "Spakel") */}
          <Sparkles 
            count={150}
            scale={[20, 20, 20]}
            size={2}
            speed={0.5}
            opacity={0.5}
            color="#ffffff"
          />
          
          {/* Distant Stars for depth */}
          <Stars 
            radius={50} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
      {/* Gradient overlay to blend canvas into the rest of the page smoothly */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/50 to-[#020617]" />
    </div>
  );
}