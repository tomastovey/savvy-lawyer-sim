
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Play } from 'lucide-react';

const SimulationPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="simulation" className="py-24 px-6 relative subtle-bg">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            Courtroom Simulation
          </div>
          <h2 className="heading-lg max-w-3xl mx-auto text-balance">
            Perfect Your Strategy in a Realistic Courtroom Environment
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-balance">
            Rehearse every aspect of your trial in our immersive simulation to ensure you're always courtroom-ready.
          </p>
        </div>
        
        <div className="relative mx-auto rounded-2xl overflow-hidden shadow-xl animate-fade-up [animation-delay:200ms] max-w-5xl">
          <div className={cn(
            "relative aspect-video bg-black/90 w-full overflow-hidden",
            isPlaying ? "cursor-default" : "cursor-pointer"
          )}>
            {/* Courtroom simulation preview image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvdXJ0cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80')] bg-center bg-cover opacity-70"></div>
            
            {/* Play button */}
            {!isPlaying && (
              <button 
                className="absolute inset-0 flex items-center justify-center z-20"
                onClick={() => setIsPlaying(true)}
                aria-label="Play simulation preview"
              >
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 transform hover:scale-110">
                  <Play className="h-8 w-8 text-primary ml-1" />
                </div>
              </button>
            )}
            
            {/* Video content (would be replaced with actual video in production) */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
                <p className="text-white/60 text-sm">Simulation video would play here</p>
                <button 
                  className="absolute top-4 right-4 text-white/80 hover:text-white"
                  onClick={() => setIsPlaying(false)}
                  aria-label="Close simulation preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Feature badge */}
          <div className="absolute top-4 left-4 z-20 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
            Premium Feature
          </div>
        </div>
        
        {/* Simulation features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-up [animation-delay:400ms]">
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Role-Play Scenarios
            </h3>
            <p className="text-muted-foreground">
              Practice as different courtroom roles to understand every perspective and prepare thoroughly.
            </p>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Cross-Examination Practice
            </h3>
            <p className="text-muted-foreground">
              Rehearse questioning techniques with AI witnesses that respond realistically to your approach.
            </p>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Performance Feedback
            </h3>
            <p className="text-muted-foreground">
              Receive detailed analysis and recommendations to improve your courtroom presence and strategy.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12 animate-fade-up [animation-delay:600ms]">
          <Button size="lg" className="group">
            Start Simulation
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SimulationPreview;
