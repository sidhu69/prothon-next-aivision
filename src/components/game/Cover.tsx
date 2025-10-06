import * as THREE from "three";

interface CoverProps {
  position: [number, number, number];
  type?: 'crate' | 'barrel' | 'wall' | 'sandbags';
}

export const Cover = ({ position, type = 'crate' }: CoverProps) => {
  if (type === 'crate') {
    return (
      <group position={position}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Crate bands */}
        {[0.4, -0.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[1.52, 0.1, 1.52]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>
    );
  }
  
  if (type === 'barrel') {
    return (
      <group position={position}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Barrel ridges */}
        {[0.4, 0, -0.4].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.08, 16]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    );
  }
  
  if (type === 'wall') {
    return (
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 0.3]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.2} roughness={0.8} />
      </mesh>
    );
  }
  
  // Sandbags
  return (
    <group position={position}>
      {[...Array(3)].map((_, i) => (
        <group key={i} position={[0, i * 0.4, 0]}>
          {[...Array(2)].map((_, j) => (
            <mesh key={j} position={[(j - 0.5) * 0.8, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.35, 1.2]} />
              <meshStandardMaterial color="#a89968" metalness={0.1} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
