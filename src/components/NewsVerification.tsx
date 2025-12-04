import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  isTrue: boolean;
  confidence: number;
  analysis: string;
  timestamp: string;
}

const NewsVerification = () => {
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const verifyNews = async (content: string, type: "url" | "text") => {
    setIsLoading(true);
    setResult(null);

    try {
      // Simple content analysis without requiring login
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Basic credibility checks
      const text = content.toLowerCase();
      const clickbaitWords = ['shocking', 'unbelievable', 'miracle', 'secret', 'doctors hate'];
      const hasClickbait = clickbaitWords.some(word => text.includes(word));
      const hasSources = text.includes('source') || text.includes('study') || text.includes('research');
      const sensationalMarks = (text.match(/!/g) || []).length;

      const credibilityScore = 80 - (hasClickbait ? 20 : 0) + (hasSources ? 10 : 0) - (sensationalMarks > 3 ? 15 : 0);
      const isCredible = credibilityScore >= 70;

      const mockResult: VerificationResult = {
        isTrue: isCredible,
        confidence: Math.max(50, Math.min(95, credibilityScore)),
        analysis: isCredible
          ? `This content appears credible. ${hasSources ? 'It references sources or research. ' : ''}No obvious clickbait patterns detected.`
          : `This content may lack credibility. ${hasClickbait ? 'Contains clickbait language. ' : ''}${!hasSources ? 'No clear sources cited. ' : ''}${sensationalMarks > 3 ? 'Excessive sensational language detected.' : ''}`,
        timestamp: new Date().toISOString(),
      };

      setResult(mockResult);

      // Update score in localStorage
      const currentScore = parseInt(localStorage.getItem("verificationScore") || "0");
      const newScore = mockResult.isTrue ? currentScore + 10 : currentScore;
      localStorage.setItem("verificationScore", newScore.toString());

      // Save to history
      const history = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
      history.unshift({
        ...mockResult,
        content: content.substring(0, 100) + "...",
        type,
      });
      localStorage.setItem("verificationHistory", JSON.stringify(history.slice(0, 10)));

      toast({
        title: mockResult.isTrue ? "News Verified" : "News Flagged",
        description: mockResult.isTrue ? "+10 points added" : "No points added",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4" id="news-verification">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6 text-primary" />
              News Verification
            </CardTitle>
            <CardDescription>
              Submit a news URL or paste content directly for AI-powered fact-checking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Direct Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <Input
                  placeholder="https://example.com/news-article"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="text-base"
                />
                <Button
                  onClick={() => verifyNews(urlInput, "url")}
                  disabled={!urlInput || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify News URL"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Paste your news content here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[150px] text-base"
                />
                <Button
                  onClick={() => verifyNews(textInput, "text")}
                  disabled={!textInput || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify News Text"
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            {result && (
              <div className="mt-6 p-6 bg-muted rounded-lg animate-slide-up">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.isTrue ? (
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    ) : (
                      <XCircle className="h-8 w-8 text-destructive" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {result.isTrue ? "Verified as True" : "Flagged as Questionable"}
                      </h3>
                      <Badge variant={result.isTrue ? "default" : "destructive"} className="mt-1">
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{result.analysis}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsVerification;
