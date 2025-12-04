import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Loader2, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationResult {
  isLegitimate: boolean;
  confidence: number;
  analysis: string;
  riskFactors: string[];
  timestamp: string;
}

const WebsiteVerification = () => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const verifyWebsite = async (url: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Simple URL analysis without requiring login
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Analyze URL characteristics
      const urlObj = new URL(url);
      const hasHttps = urlObj.protocol === 'https:';
      const domain = urlObj.hostname;
      const suspiciousPatterns = ['bit.ly', 'tinyurl', 'free', 'promo', 'win', 'click'];
      const isSuspicious = suspiciousPatterns.some(pattern => domain.toLowerCase().includes(pattern));
      const commonTLDs = ['.com', '.org', '.net', '.edu', '.gov'];
      const hasCommonTLD = commonTLDs.some(tld => domain.endsWith(tld));

      const isLegit = hasHttps && !isSuspicious && hasCommonTLD;
      const confidence = hasHttps ? (isSuspicious ? 60 : 85) : 50;

      const mockResult: VerificationResult = {
        isLegitimate: isLegit,
        confidence: confidence,
        analysis: isLegit
          ? `This website uses HTTPS and has a standard domain structure. It appears to follow security best practices.`
          : `This website may have security concerns. ${!hasHttps ? 'No HTTPS encryption detected. ' : ''}${isSuspicious ? 'Domain patterns suggest caution. ' : ''}`,
        riskFactors: isLegit
          ? ["HTTPS enabled", "Standard domain structure", "No suspicious patterns"]
          : [
            !hasHttps && "No HTTPS encryption",
            isSuspicious && "Suspicious domain pattern",
            !hasCommonTLD && "Unusual domain extension"
          ].filter(Boolean) as string[],
        timestamp: new Date().toISOString(),
      };

      setResult(mockResult);

      // Update score in localStorage
      const currentScore = parseInt(localStorage.getItem("verificationScore") || "0");
      const newScore = mockResult.isLegitimate ? currentScore + 10 : currentScore;
      localStorage.setItem("verificationScore", newScore.toString());

      // Save to history
      const history = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
      history.unshift({
        ...mockResult,
        content: url,
        type: "website",
      });
      localStorage.setItem("verificationHistory", JSON.stringify(history.slice(0, 10)));

      toast({
        title: mockResult.isLegitimate ? "Website Verified" : "Website Flagged",
        description: mockResult.isLegitimate ? "+10 points added" : "Suspicious website detected",
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
    <section className="py-16 px-4" id="website-verification">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="h-6 w-6 text-primary" />
              Website Verification
            </CardTitle>
            <CardDescription>
              Check if a website is legitimate or potentially fake/malicious
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="text-base"
                type="url"
              />
              <Button
                onClick={() => verifyWebsite(websiteUrl)}
                disabled={!websiteUrl || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Website...
                  </>
                ) : (
                  "Verify Website"
                )}
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-6 bg-muted rounded-lg animate-slide-up">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {result.isLegitimate ? (
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    ) : (
                      <ShieldAlert className="h-8 w-8 text-destructive" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {result.isLegitimate ? "Legitimate Website" : "Suspicious Website"}
                      </h3>
                      <Badge variant={result.isLegitimate ? "default" : "destructive"} className="mt-1">
                        {result.confidence}% Confidence
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{result.analysis}</p>

                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Risk Analysis:</h4>
                  <ul className="space-y-1">
                    {result.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        {result.isLegitimate ? (
                          <CheckCircle2 className="h-3 w-3 text-accent" />
                        ) : (
                          <XCircle className="h-3 w-3 text-destructive" />
                        )}
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WebsiteVerification;
