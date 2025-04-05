import Header from "@components/homepage/Header";
import Hero from "@components/homepage/Hero";
import Features from "@components/homepage/Features";
import Platforms from "@components/homepage/Platforms";
import Workflow from "@components/homepage/Workflow";
import AITools from "@components/homepage/AITools";
import FAQ from "@components/homepage/FAQ";
import Footer from "@components/homepage/Footer";
import HowSquirrelPilotWorks from "@components/homepage/HowSquirrelPilotWorks";
import AiPoweredResults from "@components/homepage/AiPoweredResults";
import ContactSection from "@components/homepage/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Platforms />
      <Workflow />
      <AITools />
      <AiPoweredResults />
      <HowSquirrelPilotWorks />
      <ContactSection />
      <FAQ />
      <Footer />
    </>
  );
}
