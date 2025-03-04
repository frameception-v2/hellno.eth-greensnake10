import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export default function ScoreDisplay({ score }: { score: number }) {
  const highScore = Number(localStorage.getItem("snakeHighScore") || 0);

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Card className="w-32">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold tabular-nums">{score}</div>
        </CardContent>
      </Card>
      
      <Card className="w-32">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            High Score
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="text-2xl font-bold tabular-nums">{highScore}</div>
        </CardContent>
      </Card>
    </div>
  );
}
