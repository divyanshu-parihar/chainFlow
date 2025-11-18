"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  Sphere,
  Stars,
} from "@react-three/drei";

const ChainOrb = () => (
  <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
    <Sphere args={[2.4, 64, 64]}>
      <MeshDistortMaterial
        color="#38bdf8"
        speed={2}
        distort={0.4}
        radius={1}
      />
    </Sphere>
  </Float>
);

const HaloRing = () => (
  <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.5]}>
      <torusGeometry args={[3.4, 0.08, 32, 100]} />
      <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={0.6} />
    </mesh>
  </Float>
);

const ParticleField = () => (
  <Stars
    radius={18}
    depth={45}
    count={4000}
    factor={4}
    saturation={0}
    fade
    speed={0.8}
  />
);

export function HeroCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
        <Suspense fallback={null}>
          <color attach="background" args={["#020617"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.6} color="#0ea5e9" />
          <pointLight position={[-10, -5, -10]} intensity={1} color="#6366f1" />
          <ChainOrb />
          <HaloRing />
          <ParticleField />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.9}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 2.6}
          />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/10 to-slate-950" />
    </div>
  );
}
