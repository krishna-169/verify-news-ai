import { ShieldCheck, Newspaper, Building2 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Truth Verification Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Verify news authenticity with AI-powered fact-checking and confirm company legitimacy through SEBI registration
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-lg shadow-card">
              <Newspaper className="h-5 w-5 text-primary" />
              <span className="font-medium">News Verification</span>
            </div>
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-lg shadow-card">
              <Building2 className="h-5 w-5 text-accent" />
              <span className="font-medium">Company Check</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
