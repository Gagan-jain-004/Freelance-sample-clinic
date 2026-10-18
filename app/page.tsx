import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { DemoCards } from "@/components/marketing/DemoCards";
import { SalesCta } from "@/components/marketing/SalesCta";
import { Footer } from "@/components/marketing/Footer";
import { DemoNotice } from "@/components/ui/DemoNotice";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Demo Notice Banner */}
      <DemoNotice variant="banner" />

      {/* Main Navigation */}
      <Navbar />

      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <DemoCards />
        <SalesCta />
      </main>

      <Footer />
    </div>
  );
}
