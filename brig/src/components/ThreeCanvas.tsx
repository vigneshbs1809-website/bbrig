"use client";

import { Canvas } from "@react-three/fiber";
import SceneController from "./SceneController";

interface ThreeCanvasProps {
  activeProject: number | null;
  activeService: number | null;
}

export default function ThreeCanvas({ activeProject, activeService }: ThreeCanvasProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        backgroundColor: "#000000",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 60, near: 0.1, far: 100, position: [0, 1.8, 7.5] }}
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: "high-performance",
        }}
      >
        {/* Set WebGL background color matching site color - Pure Plain Black */}
        <color attach="background" args={["#000000"]} />
        
        {/* Volumetric Fog - critical for soft Awwwards look and camera clipping transitions */}
        <fogExp2 attach="fog" args={["#000000", 0.015]} />

        {/* Core lighting system */}
        <ambientLight intensity={0.2} />
        <directionalLight 
          position={[5, 12, 5]} 
          intensity={0.6} 
          color="#ffffff" 
        />
        
        {/* Mount scrolling system (contains camera scroll controller) */}
        <SceneController />
      </Canvas>
    </div>
  );
}


