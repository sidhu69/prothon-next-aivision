interface GameHUDProps {
  health: number;
  opponentHealth: number;
  score: number;
  opponentScore: number;
  matchCode: string;
  gameStarted: boolean;
}

export const GameHUD = ({
  health,
  opponentHealth,
  score,
  opponentScore,
  matchCode,
  gameStarted,
}: GameHUDProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Top bar */}
      <div className="flex items-center justify-between p-6">
        <div className="rounded-lg bg-card/80 px-6 py-3 backdrop-blur-sm">
          <div className="text-sm text-muted-foreground">Match Code</div>
          <div className="text-2xl font-bold text-primary">{matchCode}</div>
        </div>

        <div className="flex gap-8">
          <div className="rounded-lg bg-card/80 px-6 py-3 text-center backdrop-blur-sm">
            <div className="text-sm text-muted-foreground">Your Score</div>
            <div className="text-3xl font-bold text-primary">{score}</div>
          </div>
          <div className="rounded-lg bg-card/80 px-6 py-3 text-center backdrop-blur-sm">
            <div className="text-sm text-muted-foreground">Opponent</div>
            <div className="text-3xl font-bold text-destructive">{opponentScore}</div>
          </div>
        </div>
      </div>

      {/* Health bars */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="mb-4 rounded-lg bg-card/80 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Your Health</span>
            <span className="text-sm font-bold text-primary">{health}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${health}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-card/80 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Opponent Health</span>
            <span className="text-sm font-bold text-destructive">{opponentHealth}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-destructive transition-all duration-300"
              style={{ width: `${opponentHealth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-6 w-6">
          <div className="absolute left-1/2 top-0 h-2 w-0.5 -translate-x-1/2 bg-primary" />
          <div className="absolute bottom-0 left-1/2 h-2 w-0.5 -translate-x-1/2 bg-primary" />
          <div className="absolute left-0 top-1/2 h-0.5 w-2 -translate-y-1/2 bg-primary" />
          <div className="absolute right-0 top-1/2 h-0.5 w-2 -translate-y-1/2 bg-primary" />
        </div>
      </div>

      {/* Waiting overlay */}
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-4 text-4xl font-bold text-primary">Waiting for opponent...</div>
            <div className="text-lg text-muted-foreground">
              Share match code: <span className="font-mono text-accent">{matchCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 rounded-lg bg-card/80 p-4 backdrop-blur-sm">
        <div className="text-sm font-semibold text-foreground mb-2">Controls</div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div><span className="font-mono text-accent">W/A/S/D</span> - Move</div>
          <div><span className="font-mono text-accent">Mouse</span> - Look</div>
          <div><span className="font-mono text-accent">Click</span> - Shoot</div>
          <div><span className="font-mono text-accent">ESC</span> - Unlock cursor</div>
        </div>
      </div>
    </div>
  );
};
