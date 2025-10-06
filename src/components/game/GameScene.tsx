import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Sky } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "@/integrations/supabase/client";
import { Player } from "./Player";
import { Environment } from "./Environment";
import { Container } from "./Container";
import { Cover } from "./Cover";

interface GameSceneProps {
  matchId: string;
  playerId: string;
  onDamage: (amount: number) => void;
  onOpponentHit: () => void;
  health: number;
  gameStarted: boolean;
}

export const GameScene = ({ matchId, playerId, onDamage, onOpponentHit, health, gameStarted }: GameSceneProps) => {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  const [moveState, setMoveState] = useState({ forward: false, backward: false, left: false, right: false });
  const [isShooting, setIsShooting] = useState(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const [opponents, setOpponents] = useState<Map<string, any>>(new Map());

  // Initialize player position in database
  useEffect(() => {
    const initPosition = async () => {
      await supabase.from("player_positions").upsert({
        match_id: matchId,
        player_id: playerId,
        position_x: 0,
        position_y: 1.6,
        position_z: 5,
        rotation_y: 0,
        health: health,
        is_shooting: false,
      });
    };
    initPosition();
  }, [matchId, playerId]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      
      switch (e.code) {
        case "KeyW":
          setMoveState((s) => ({ ...s, forward: true }));
          break;
        case "KeyS":
          setMoveState((s) => ({ ...s, backward: true }));
          break;
        case "KeyA":
          setMoveState((s) => ({ ...s, left: true }));
          break;
        case "KeyD":
          setMoveState((s) => ({ ...s, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          setMoveState((s) => ({ ...s, forward: false }));
          break;
        case "KeyS":
          setMoveState((s) => ({ ...s, backward: false }));
          break;
        case "KeyA":
          setMoveState((s) => ({ ...s, left: false }));
          break;
        case "KeyD":
          setMoveState((s) => ({ ...s, right: false }));
          break;
      }
    };

    const handleMouseDown = () => {
      if (!gameStarted) return;
      setIsShooting(true);
      
      // Raycast to detect hits
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      
      // Check if we hit an opponent
      opponents.forEach((opponent) => {
        const box = new THREE.Box3().setFromCenterAndSize(
          new THREE.Vector3(opponent.position_x, opponent.position_y, opponent.position_z),
          new THREE.Vector3(1, 2, 1)
        );
        
        if (raycaster.ray.intersectsBox(box)) {
          onOpponentHit();
          // Update opponent health
          supabase.from("player_positions").update({
            health: Math.max(0, opponent.health - 20),
          }).eq("match_id", matchId).eq("player_id", opponent.player_id);
        }
      });

      setTimeout(() => setIsShooting(false), 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [gameStarted, opponents, camera, matchId, onOpponentHit]);

  // Subscribe to opponent positions
  useEffect(() => {
    const channel = supabase
      .channel(`positions-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_positions",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData && newData.player_id && newData.player_id !== playerId) {
            setOpponents((prev) => {
              const newMap = new Map(prev);
              newMap.set(newData.player_id, newData);
              return newMap;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, playerId]);

  // Movement and position sync
  useFrame((_, delta) => {
    if (!gameStarted || health <= 0) return;

    const speed = 5;
    velocity.current.set(0, 0, 0);

    if (moveState.forward) velocity.current.z -= speed * delta;
    if (moveState.backward) velocity.current.z += speed * delta;
    if (moveState.left) velocity.current.x -= speed * delta;
    if (moveState.right) velocity.current.x += speed * delta;

    camera.getWorldDirection(direction.current);
    direction.current.y = 0;
    direction.current.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction.current).normalize();

    const movement = new THREE.Vector3();
    movement.addScaledVector(direction.current, -velocity.current.z);
    movement.addScaledVector(right, -velocity.current.x);

    camera.position.add(movement);

    // Sync position to database (throttled)
    if (Math.random() < 0.1) {
      supabase.from("player_positions").upsert({
        match_id: matchId,
        player_id: playerId,
        position_x: camera.position.x,
        position_y: camera.position.y,
        position_z: camera.position.z,
        rotation_y: camera.rotation.y,
        health: health,
        is_shooting: isShooting,
      });
    }
  });

  return (
    <>
      {/* Sky and atmosphere */}
      <Sky 
        sunPosition={[100, 20, 100]} 
        turbidity={8}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <fog attach="fog" args={["#0a0a1a", 30, 100]} />
      
      {/* Advanced lighting */}
      <ambientLight intensity={0.3} color="#4488ff" />
      <directionalLight 
        position={[50, 50, 30]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={150}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
      />
      <hemisphereLight args={["#87ceeb", "#1a1a2e", 0.4]} />
      
      {/* Accent lights for atmosphere */}
      <pointLight position={[0, 10, 0]} color="#00d9ff" intensity={0.5} distance={30} />
      <pointLight position={[20, 5, 20]} color="#ff3366" intensity={0.3} distance={20} />
      <pointLight position={[-20, 5, -20]} color="#00d9ff" intensity={0.3} distance={20} />
      
      <PointerLockControls />
      
      {/* Environment */}
      <Environment />

      {/* Shipping Containers - Strategic placement */}
      <Container position={[-15, 1.3, -20]} rotation={Math.PI / 4} type="standard" />
      <Container position={[15, 1.3, 20]} rotation={-Math.PI / 4} type="standard" />
      <Container position={[-25, 1.3, 15]} rotation={Math.PI / 2} type="large" />
      <Container position={[25, 1.3, -15]} rotation={-Math.PI / 2} type="large" />
      <Container position={[0, 1.3, -30]} rotation={0} type="standard" />
      <Container position={[0, 1.3, 30]} rotation={Math.PI} type="standard" />
      
      {/* Stacked containers */}
      <Container position={[-30, 1.3, -5]} rotation={0} type="standard" />
      <Container position={[-30, 3.9, -5]} rotation={0} type="small" />
      <Container position={[30, 1.3, 5]} rotation={Math.PI} type="standard" />
      <Container position={[30, 3.9, 5]} rotation={Math.PI} type="small" />
      
      {/* Cover objects - Crates */}
      {[
        [-10, 0.75, -10],
        [10, 0.75, 10],
        [-20, 0.75, 5],
        [20, 0.75, -5],
        [5, 0.75, -15],
        [-5, 0.75, 15],
      ].map((pos, i) => (
        <Cover key={`crate-${i}`} position={pos as [number, number, number]} type="crate" />
      ))}
      
      {/* Barrels */}
      {[
        [8, 0.6, -8],
        [-8, 0.6, 8],
        [12, 0.6, 0],
        [-12, 0.6, 0],
      ].map((pos, i) => (
        <Cover key={`barrel-${i}`} position={pos as [number, number, number]} type="barrel" />
      ))}
      
      {/* Sandbag walls */}
      {[
        [0, 0.6, -10],
        [0, 0.6, 10],
        [-18, 0.6, 0],
        [18, 0.6, 0],
      ].map((pos, i) => (
        <Cover key={`sandbags-${i}`} position={pos as [number, number, number]} type="sandbags" />
      ))}
      
      {/* Concrete walls */}
      {[
        [-35, 1, 0],
        [35, 1, 0],
      ].map((pos, i) => (
        <Cover key={`wall-${i}`} position={pos as [number, number, number]} type="wall" />
      ))}

      {/* Render opponents as full characters */}
      {Array.from(opponents.values()).map((opponent) => (
        <Player
          key={opponent.player_id}
          position={[opponent.position_x, 0, opponent.position_z]}
          rotation={opponent.rotation_y}
          isShooting={opponent.is_shooting}
          isCurrentPlayer={false}
        />
      ))}

      {/* Muzzle flash effect for current player */}
      {isShooting && (
        <group position={[0.3, 1.5, -0.5]}>
          <mesh>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#ffaa00" />
          </mesh>
          <pointLight color="#ffaa00" intensity={5} distance={5} />
        </group>
      )}
      
      {/* Bullet tracer */}
      {isShooting && (
        <mesh position={[0, 1.6, -5]}>
          <cylinderGeometry args={[0.02, 0.02, 10, 8]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Player reference (invisible, just for position tracking) */}
      <group ref={playerRef} position={[0, 1.6, 0]} />
    </>
  );
};
