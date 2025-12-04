import Hero from "@/components/Hero";
import NewsVerification from "@/components/NewsVerification";
import CompanyVerification from "@/components/CompanyVerification";
import WebsiteVerification from "@/components/WebsiteVerification";
import ScoreTracker from "@/components/ScoreTracker";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <NewsVerification />
      <CompanyVerification />
      <WebsiteVerification />
      <ScoreTracker />
    </div>
  );
};

export default Index;
