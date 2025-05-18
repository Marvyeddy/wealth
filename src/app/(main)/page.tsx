import Cta from "@/components/Cta";
import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import StatsData from "@/components/StatsData";
import Testimonials from "@/components/Testimonials";
import React from "react";

const Home = () => {
  return (
    <div className="mt-40">
      <Hero />
      <StatsData />
      <Feature />
      <HowItWorks />
      <Testimonials />
      <Cta />
    </div>
  );
};

export default Home;
