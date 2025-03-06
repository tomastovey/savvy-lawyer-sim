
import React from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CaseUpload from '@/components/CaseUpload';
import SimulationPreview from '@/components/SimulationPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Features />
      <CaseUpload />
      <SimulationPreview />
      <Footer />
    </div>
  );
};

export default Index;
