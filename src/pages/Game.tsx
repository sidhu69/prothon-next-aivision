import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Canvas } from "@react-three/fiber";
import { GameScene } from "@/components/game/GameScene";
import { GameHUD } from "@/components/game/GameHUD";
import { toast } from "sonner";

const Game = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);
  const [playerId] = useState(() => `player_${Math.random().toString(36).substr(2, 9)}`);
  const [health, setHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!matchId) return;

    // Load match data
    const loadMatch = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", matchId)
        .single();

      if (error) {
        toast.error("Failed to load match");
        navigate("/");
        return;
      }

      setMatch(data);
      setScore(data.host_score || 0);
      setOpponentScore(data.guest_score || 0);
      
      if (data.status === "playing") {
        setGameStarted(true);
      }
    };

    loadMatch();

    // Subscribe to match updates
    const matchChannel = supabase
      .channel(`match-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          console.log("Match updated:", payload);
          const newData = payload.new as any;
          setMatch(newData);
          
          if (newData && newData.status === "playing" && !gameStarted) {
            setGameStarted(true);
            toast.success("Match started! Get ready!");
          }
          
          if (newData && newData.status === "finished") {
            toast.info("Match finished!");
            setTimeout(() => navigate("/"), 3000);
          }
        }
      )
      .subscribe();

    // Subscribe to player positions for opponent tracking
    const positionsChannel = supabase
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
            setOpponentHealth(newData.health || 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(positionsChannel);
    };
  }, [matchId, navigate, playerId, gameStarted]);

  const handleDamage = async (amount: number) => {
    const newHealth = Math.max(0, health - amount);
    setHealth(newHealth);

    if (newHealth <= 0) {
      toast.error("You were eliminated!");
      // Update opponent score
      if (match) {
        const isHost = match.guest_id === null;
        await supabase
          .from("matches")
          .update({
            [isHost ? "guest_score" : "host_score"]: (isHost ? opponentScore : score) + 1,
          })
          .eq("id", matchId);
      }
      
      // Respawn after 3 seconds
      setTimeout(() => setHealth(100), 3000);
    }
  };

  const handleOpponentHit = async () => {
    const newScore = score + 10;
    setScore(newScore);
    
    // Update score in database
    if (match) {
      const isHost = match.guest_id === null;
      await supabase
        .from("matches")
        .update({
          [isHost ? "host_score" : "guest_score"]: newScore,
        })
        .eq("id", matchId);
    }
  };

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-2xl text-foreground">Loading match...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <GameHUD
        health={health}
        opponentHealth={opponentHealth}
        score={score}
        opponentScore={opponentScore}
        matchCode={match.code}
        gameStarted={gameStarted}
      />
      
      <Canvas
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        className="h-full w-full"
      >
        <GameScene
          matchId={matchId!}
          playerId={playerId}
          onDamage={handleDamage}
          onOpponentHit={handleOpponentHit}
          health={health}
          gameStarted={gameStarted}
        />
      </Canvas>
    </div>
  );
};

export default Game;
