import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, History } from "lucide-react";

interface HistoryItem {
  isTrue: boolean;
  confidence: number;
  content: string;
  type: string;
  timestamp: string;
}

const ScoreTracker = () => {
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load initial data
    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for same-tab updates
    const interval = setInterval(loadData, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadData = () => {
    const savedScore = parseInt(localStorage.getItem("verificationScore") || "0");
    const savedHistory = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
    setScore(savedScore);
    setHistory(savedHistory);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Score */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Your Truth Score
              </CardTitle>
              <CardDescription>Earn +10 points for each verified true news</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {score}
                </div>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Verification Stats
              </CardTitle>
              <CardDescription>Your verification activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Verifications:</span>
                <Badge variant="secondary">{history.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">True News:</span>
                <Badge className="bg-gradient-success">
                  {history.filter(h => h.isTrue).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Flagged:</span>
                <Badge variant="destructive">
                  {history.filter(h => !h.isTrue).length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <Card className="mt-6 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {history.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Badge
                      variant={item.isTrue ? "default" : "destructive"}
                      className="mt-1"
                    >
                      {item.isTrue ? "✓" : "✗"}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {item.confidence}% confidence
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ScoreTracker;
