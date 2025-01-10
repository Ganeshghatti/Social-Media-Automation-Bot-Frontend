import Navbar from "@/components/global/navbar";
import Clients from "@/sections/clients";
import Contact from "@/sections/contact";
import CTA from "@/sections/cta";
import Features from "@/sections/features";
import Hero from "@/sections/hero";
import Productivity from "@/sections/productivity";
import Footer from "@/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Productivity />
      <Clients />
      <Features />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}
