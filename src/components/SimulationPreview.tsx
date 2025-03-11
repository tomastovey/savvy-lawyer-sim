
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Play, X, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { simulationScenarios } from '@/data/simulationData';

const SimulationPreview = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [showScenarios, setShowScenarios] = useState(false);

  // Use the actual scenarios from the data file
  const scenarios = simulationScenarios.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    difficulty: s.difficulty,
    duration: s.duration,
    participants: s.participants
  }));

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Show scenarios after video intro plays
    setTimeout(() => {
      setIsPlaying(false);
      setShowScenarios(true);
    }, 2000);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setActiveScenario(scenarioId);
  };

  const handleStartSimulation = () => {
    if (!activeScenario) {
      toast.error("Please select a scenario first");
      return;
    }
    
    navigate(`/simulation/${activeScenario}`);
  };

  const resetView = () => {
    setShowScenarios(false);
    setActiveScenario(null);
  };

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
        
        {!showScenarios ? (
          <div className="relative mx-auto rounded-2xl overflow-hidden shadow-xl animate-fade-up [animation-delay:200ms] max-w-5xl">
            <div className={cn(
              "relative aspect-video bg-black/90 w-full overflow-hidden",
              isPlaying ? "cursor-default" : "cursor-pointer"
            )}>
              {/* Courtroom simulation preview image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute inset-0 bg-[url('/lovable-uploads/6584220c-b7b4-45f9-abae-8a3de28904c8.png')] bg-center bg-cover opacity-70"></div>
              
              {/* Play button */}
              {!isPlaying && (
                <button 
                  className="absolute inset-0 flex items-center justify-center z-20"
                  onClick={handlePlayClick}
                  aria-label="Play simulation preview"
                >
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 transform hover:scale-110">
                    <Play className="h-8 w-8 text-primary ml-1" />
                  </div>
                </button>
              )}
              
              {/* Loading animation (would be replaced with actual video in production) */}
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black">
                  <div className="text-center">
                    <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/80 text-sm">Loading simulation scenarios...</p>
                  </div>
                  <button 
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                    onClick={() => setIsPlaying(false)}
                    aria-label="Close simulation preview"
                  >
                    <X size={24} />
                  </button>
                </div>
              )}
            </div>
            
            {/* Feature badge */}
            <div className="absolute top-4 left-4 z-20 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              Interactive Simulations
            </div>
          </div>
        ) : (
          <div className="animate-fade-up max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Select a Simulation Scenario</h3>
              <Button variant="ghost" size="sm" onClick={resetView}>
                <X className="mr-1 h-4 w-4" /> Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {scenarios.map((scenario) => (
                <div 
                  key={scenario.id}
                  className={cn(
                    "glass-panel rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md border-2",
                    activeScenario === scenario.id ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => handleScenarioSelect(scenario.id)}
                >
                  <h4 className="text-lg font-semibold mb-2">{scenario.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{scenario.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                    <div>
                      <span className="block font-medium text-foreground">Difficulty</span>
                      <span>{scenario.difficulty}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-foreground">Duration</span>
                      <span>{scenario.duration}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-foreground">Participants</span>
                      <span>{scenario.participants}</span>
                    </div>
                  </div>
                  
                  {activeScenario === scenario.id && (
                    <div className="mt-2 text-primary text-sm font-medium">
                      Scenario selected ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/5 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-primary">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="font-medium">Chat with AI Assistant</h4>
                  <p className="text-sm text-muted-foreground">During the simulation, you can ask the AI for advice and guidance on your approach</p>
                </div>
              </div>
              <Button 
                size="lg" 
                className="group w-full md:w-auto" 
                onClick={handleStartSimulation}
                disabled={!activeScenario}
              >
                Start Simulation
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )}
        
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
              AI Assistant Chat
            </h3>
            <p className="text-muted-foreground">
              Get real-time guidance and advice from our AI legal assistant during your simulation practice.
            </p>
          </div>
        </div>
        
        {!showScenarios && (
          <div className="text-center mt-12 animate-fade-up [animation-delay:600ms]">
            <Button size="lg" className="group" onClick={handlePlayClick}>
              Start Simulation
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SimulationPreview;
