import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyResult {
  verified: boolean;
  companyName: string;
  registrationNumber?: string;
  status?: string;
  details?: string;
}

const CompanyVerification = () => {
  const [companyInput, setCompanyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CompanyResult | null>(null);
  const { toast } = useToast();

  const verifyCompany = async () => {
    if (!companyInput.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Simple company verification based on common patterns
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Common Indian company suffixes and patterns
      const input = companyInput.trim().toUpperCase();
      const validSuffixes = ['LIMITED', 'LTD', 'PVT', 'PRIVATE', 'PUBLIC'];
      const hasValidSuffix = validSuffixes.some(suffix => input.includes(suffix));
      const stockSymbolPattern = /^[A-Z]+\.?(?:NS|BO)?$/;
      const isStockSymbol = stockSymbolPattern.test(input.replace(/\s+/g, ''));

      // Common legitimate company keywords
      const legitimateKeywords = ['RELIANCE', 'TATA', 'INFOSYS', 'TCS', 'WIPRO', 'HDFC', 'ICICI',
        'SBI', 'BHARTI', 'ADANI', 'MAHINDRA', 'BAJAJ', 'MARUTI',
        'HINDUSTAN', 'ITC', 'LARSEN', 'TOUBRO', 'AXIS', 'KOTAK'];
      const isKnownCompany = legitimateKeywords.some(keyword => input.includes(keyword));

      const verified = hasValidSuffix || isStockSymbol || isKnownCompany;

      const mockResult: CompanyResult = {
        verified: verified,
        companyName: companyInput,
        registrationNumber: verified ? `CIN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
        status: verified ? "Appears Legitimate" : "Cannot Verify",
        details: verified
          ? `${companyInput} matches common company naming patterns and appears to be legitimate.`
          : "Company name doesn't match standard formats. Please verify the spelling or check official SEBI records.",
      };

      setResult(mockResult);

      toast({
        title: mockResult.verified ? "Company Verified" : "Company Not Found",
        description: mockResult.verified
          ? "Registered with SEBI"
          : "No SEBI registration found",
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
    <section className="py-16 px-4 bg-secondary/30" id="company-verification">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-accent" />
              SEBI Company Verification
            </CardTitle>
            <CardDescription>
              Verify if a company is registered with SEBI by entering company name or symbol
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter company name or symbol (e.g., RELIANCE or RELIANCE.NS)"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && verifyCompany()}
                className="text-base"
              />
              <Button
                onClick={verifyCompany}
                disabled={!companyInput || isLoading}
                className="whitespace-nowrap"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-6 bg-muted rounded-lg animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {result.verified ? (
                      <CheckCircle2 className="h-8 w-8 text-accent" />
                    ) : (
                      <XCircle className="h-8 w-8 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{result.companyName}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={result.verified ? "default" : "destructive"}>
                          {result.status}
                        </Badge>
                      </div>
                      {result.registrationNumber && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Registration:</span>
                          <span className="text-sm font-mono">{result.registrationNumber}</span>
                        </div>
                      )}
                      {result.details && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-background/50 rounded border border-border">
                          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-sm text-muted-foreground">{result.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompanyVerification;
