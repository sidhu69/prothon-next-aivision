import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MenuButton } from "@/components/MenuButton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Target, Users, Code2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [matchCode, setMatchCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createMatch = async () => {
    setIsCreating(true);
    try {
      const code = generateCode();
      const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from("matches")
        .insert({
          code,
          host_id: playerId,
          status: "waiting",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Match created! Code: ${code}`);
      navigate(`/game/${data.id}`);
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Failed to create match");
    } finally {
      setIsCreating(false);
    }
  };

  const joinMatch = async () => {
    if (!matchCode.trim()) {
      toast.error("Please enter a match code");
      return;
    }

    setIsJoining(true);
    try {
      const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data: match, error: fetchError } = await supabase
        .from("matches")
        .select()
        .eq("code", matchCode.toUpperCase())
        .eq("status", "waiting")
        .single();

      if (fetchError || !match) {
        toast.error("Match not found or already started");
        setIsJoining(false);
        return;
      }

      const { error: updateError } = await supabase
        .from("matches")
        .update({
          guest_id: playerId,
          status: "playing",
        })
        .eq("id", match.id);

      if (updateError) throw updateError;

      toast.success("Joined match!");
      navigate(`/game/${match.id}`);
    } catch (error) {
      console.error("Error joining match:", error);
      toast.error("Failed to join match");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      {/* Glowing orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-accent/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-8">
        {/* Logo/Title */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Target className="h-16 w-16 text-primary" />
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-black text-transparent">
              TDM Arena
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Fast-paced 1v1 Team Deathmatch
          </p>
        </div>

        {/* Main menu cards */}
        <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
            <CardHeader>
              <div className="mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center text-2xl">Create Match</CardTitle>
              <CardDescription className="text-center">
                Start a new match and get a code to share
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MenuButton
                onClick={createMatch}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? "Creating..." : "Create Match"}
              </MenuButton>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-card/50 backdrop-blur-sm transition-all hover:border-accent/50 hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)]">
            <CardHeader>
              <div className="mb-4 flex items-center justify-center">
                <Code2 className="h-12 w-12 text-accent" />
              </div>
              <CardTitle className="text-center text-2xl">Join Match</CardTitle>
              <CardDescription className="text-center">
                Enter a match code to join a game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter match code"
                value={matchCode}
                onChange={(e) => setMatchCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono uppercase"
                maxLength={6}
              />
              <MenuButton
                onClick={joinMatch}
                disabled={isJoining || !matchCode}
                variant="secondary"
                className="w-full"
              >
                {isJoining ? "Joining..." : "Join Match"}
              </MenuButton>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border/50 bg-card/30 p-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-4xl">⚡</div>
            <h3 className="mb-2 font-semibold text-foreground">Fast-Paced</h3>
            <p className="text-sm text-muted-foreground">
              Quick matches with instant respawn
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/30 p-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-4xl">🎯</div>
            <h3 className="mb-2 font-semibold text-foreground">Skill-Based</h3>
            <p className="text-sm text-muted-foreground">
              Test your aim and reflexes
            </p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card/30 p-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-4xl">🌐</div>
            <h3 className="mb-2 font-semibold text-foreground">Real-Time</h3>
            <p className="text-sm text-muted-foreground">
              Live multiplayer sync
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
