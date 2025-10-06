import * as THREE from "three";

export const Environment = () => {
  return (
    <>
      {/* Ground with texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.1} 
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Grid overlay */}
      <gridHelper args={[150, 75, "#00d9ff", "#003344"]} position={[0, 0.02, 0]} />
      
      {/* Arena boundary walls */}
      {/* North wall */}
      <mesh position={[0, 3, -50]} castShadow receiveShadow>
        <boxGeometry args={[150, 6, 1]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* South wall */}
      <mesh position={[0, 3, 50]} castShadow receiveShadow>
        <boxGeometry args={[150, 6, 1]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* East wall */}
      <mesh position={[50, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 6, 150]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* West wall */}
      <mesh position={[-50, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 6, 150]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Corner towers */}
      {[
        [45, 45],
        [45, -45],
        [-45, 45],
        [-45, -45],
      ].map(([x, z], i) => (
        <group key={`tower-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[4, 8, 4]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
          </mesh>
          <mesh position={[0, 8.5, 0]} castShadow>
            <cylinderGeometry args={[3, 4, 1, 8]} />
            <meshStandardMaterial color="#2a2a3e" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Tower lights */}
          <pointLight position={[0, 8, 0]} color="#00d9ff" intensity={2} distance={15} />
        </group>
      ))}
    </>
  );
};
