
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 px-6 overflow-hidden subtle-bg">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            AI-Powered Legal Excellence
          </div>
          
          <h1 className="heading-xl text-balance max-w-5xl mx-auto">
            Courtroom Excellence, <br />
            <span className="text-primary">AI Empowered</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Analyze case documents, extract critical details, and rehearse your 
            strategies in a realistic courtroom simulation to ensure you're always court-ready.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={scrollToUpload} className="min-w-[180px]">
              Upload Your Case
            </Button>
            <Button variant="outline" size="lg" className="min-w-[180px]">
              Watch Demo
            </Button>
          </div>
          
          <div className="pt-20 animate-bounce">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Scroll to features"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
