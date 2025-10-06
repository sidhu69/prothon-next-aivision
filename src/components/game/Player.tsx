import { useRef } from "react";
import * as THREE from "three";

interface PlayerProps {
  position: [number, number, number];
  rotation: number;
  isShooting: boolean;
  isCurrentPlayer?: boolean;
}

export const Player = ({ position, rotation, isShooting, isCurrentPlayer = false }: PlayerProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const bodyColor = isCurrentPlayer ? "#00d9ff" : "#ff3366";
  const emissiveColor = isCurrentPlayer ? "#00d9ff" : "#ff3366";

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Legs */}
      <mesh position={[-0.15, -0.4, 0]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={0.2} metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.15, -0.4, 0]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={0.2} metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Body/Torso */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.35, 0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={0.2} metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0.35, 0.15, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={0.2} metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.35, 0.4, 0.35]} />
        <meshStandardMaterial color={bodyColor} emissive={emissiveColor} emissiveIntensity={0.4} metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Helmet visor */}
      <mesh position={[0, 0.8, 0.18]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.02]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Backpack */}
      <mesh position={[0, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.15]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.4} roughness={0.6} />
      </mesh>
      
      {/* Gun */}
      <group position={[0.3, 0.1, 0.25]} rotation={[0, 0, 0]}>
        {/* Gun body */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.08, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Gun barrel */}
        <mesh position={[0, 0, 0.35]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Gun stock */}
        <mesh position={[0, -0.05, -0.25]} castShadow>
          <boxGeometry args={[0.06, 0.12, 0.15]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Muzzle flash */}
        {isShooting && (
          <mesh position={[0, 0, 0.5]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
        )}
      </group>
      
      {/* Name tag */}
      {!isCurrentPlayer && (
        <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.8, 0.2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};
