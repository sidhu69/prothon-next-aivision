import * as THREE from "three";

interface ContainerProps {
  position: [number, number, number];
  rotation?: number;
  type?: 'standard' | 'large' | 'small';
}

export const Container = ({ position, rotation = 0, type = 'standard' }: ContainerProps) => {
  const sizes = {
    standard: [2.4, 2.6, 6] as [number, number, number],
    large: [3, 3, 8] as [number, number, number],
    small: [1.5, 1.5, 3] as [number, number, number],
  };
  
  const [width, height, depth] = sizes[type];
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Main container body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color="#c44236" 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Container ridges */}
      {[...Array(8)].map((_, i) => {
        const offset = (i - 3.5) * (depth / 8);
        return (
          <mesh key={i} position={[0, 0, offset]} castShadow>
            <boxGeometry args={[width + 0.02, 0.15, 0.1]} />
            <meshStandardMaterial color="#8a2f27" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
      
      {/* Container doors */}
      <mesh position={[0, 0, depth / 2 + 0.01]} castShadow>
        <boxGeometry args={[width - 0.2, height - 0.2, 0.05]} />
        <meshStandardMaterial color="#a03730" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Door handles */}
      <mesh position={[-width / 4, 0, depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[0.15, 0.8, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[width / 4, 0, depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[0.15, 0.8, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Container markings */}
      <mesh position={[0, height / 3, depth / 2 + 0.02]}>
        <planeGeometry args={[width * 0.6, height * 0.15]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      
      {/* Warning stripes */}
      <mesh position={[-width / 2 - 0.01, height / 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 0.3]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
      <mesh position={[width / 2 + 0.01, height / 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 0.3]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  );
};
