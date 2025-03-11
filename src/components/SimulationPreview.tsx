
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Play, X, Info } from 'lucide-react';
import { toast } from 'sonner';

// Simulation scenarios
const scenarios = [
  {
    id: 'cross-examination',
    title: 'Cross-Examination',
    description: 'Practice challenging witness testimony with AI-powered responses',
    difficulty: 'Medium',
    duration: '30 min',
    participants: '2-3'
  },
  {
    id: 'opening-statement',
    title: 'Opening Statement',
    description: 'Rehearse your opening statement with real-time feedback on delivery and content',
    difficulty: 'Easy',
    duration: '15 min',
    participants: '1'
  },
  {
    id: 'jury-selection',
    title: 'Jury Selection',
    description: 'Develop skills in identifying favorable jurors and eliminating biased candidates',
    difficulty: 'Hard',
    duration: '45 min',
    participants: '5+'
  }
];

const SimulationPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [showScenarios, setShowScenarios] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Show scenarios after video intro plays
    setTimeout(() => {
      setIsPlaying(false);
      setShowScenarios(true);
    }, 3000);
  };

  const handleScenarioSelect = (scenarioId: string) => {
    setActiveScenario(scenarioId);
    toast.success("Scenario selected! In a full implementation, this would launch the simulation.");
  };

  const handleStartSimulation = () => {
    if (!activeScenario) {
      toast.error("Please select a scenario first");
      return;
    }
    
    toast.success(`Starting ${scenarios.find(s => s.id === activeScenario)?.title} simulation`);
    // This would launch the full simulation in a production environment
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
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvdXJ0cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80')] bg-center bg-cover opacity-70"></div>
              
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
              
              {/* Video content (would be replaced with actual video in production) */}
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
              Premium Feature
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
                  <h4 className="font-medium">Simulation Options</h4>
                  <p className="text-sm text-muted-foreground">Configure your practice environment and difficulty settings before starting</p>
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
              Performance Feedback
            </h3>
            <p className="text-muted-foreground">
              Receive detailed analysis and recommendations to improve your courtroom presence and strategy.
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
