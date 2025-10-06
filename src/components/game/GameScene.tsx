import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Sky } from "@react-three/drei";
import * as THREE from "three";
import { supabase } from "@/integrations/supabase/client";

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
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <PointerLockControls />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Grid pattern on ground */}
      <gridHelper args={[100, 50, "#00d9ff", "#00d9ff"]} position={[0, 0.01, 0]} />

      {/* Cover objects */}
      {[...Array(10)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            1,
            (Math.random() - 0.5) * 40,
          ]}
          castShadow
        >
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#00d9ff" emissive="#00d9ff" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Render opponents */}
      {Array.from(opponents.values()).map((opponent) => (
        <group
          key={opponent.player_id}
          position={[opponent.position_x, opponent.position_y - 0.8, opponent.position_z]}
        >
          {/* Body */}
          <mesh>
            <boxGeometry args={[0.6, 1.6, 0.4]} />
            <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={0.3} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}

      {/* Shooting effect */}
      {isShooting && (
        <mesh position={[0, 0, -2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      )}

      {/* Player reference (invisible, just for position tracking) */}
      <group ref={playerRef} position={[0, 1.6, 0]} />
    </>
  );
};
