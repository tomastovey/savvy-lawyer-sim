
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Award, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { simulationScenarios, SimulationStage, SimulationInteraction, SimulationOption } from '@/data/simulationData';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '../auth/AuthModal';

interface UserChoice {
  interactionId: string;
  optionId: string;
  value: 'good' | 'neutral' | 'bad';
}

const SimulationEngine = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [scenario, setScenario] = useState(simulationScenarios.find(s => s.id === id));
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(0);
  const [userChoices, setUserChoices] = useState<UserChoice[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!scenario) {
      navigate('/simulation');
      toast.error('Simulation not found');
    }
    
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [scenario, navigate, isAuthenticated]);
  
  // Calculate progress
  useEffect(() => {
    if (!scenario) return;
    
    const totalInteractions = scenario.stages.reduce((acc, stage) => 
      acc + stage.interactions.length, 0);
    
    let completedInteractions = 0;
    for (let i = 0; i < currentStageIndex; i++) {
      completedInteractions += scenario.stages[i].interactions.length;
    }
    completedInteractions += currentInteractionIndex;
    
    const calculatedProgress = Math.floor((completedInteractions / totalInteractions) * 100);
    setProgress(calculatedProgress);
  }, [scenario, currentStageIndex, currentInteractionIndex]);
  
  const currentStage = scenario?.stages[currentStageIndex];
  const currentInteraction = currentStage?.interactions[currentInteractionIndex];
  
  const handleOptionSelect = (option: SimulationOption) => {
    if (!currentInteraction) return;
    
    // Record user choice
    setUserChoices(prev => [
      ...prev, 
      { 
        interactionId: currentInteraction.id, 
        optionId: option.id,
        value: option.value
      }
    ]);
    
    // Show feedback toast based on option value
    if (option.value === 'good') {
      toast.success('Excellent choice!');
    } else if (option.value === 'neutral') {
      toast.info('Acceptable approach, but consider alternatives.');
    } else {
      toast.error('This approach could be problematic.');
    }
    
    // Advance to next interaction or stage
    advanceSimulation();
  };
  
  const advanceSimulation = () => {
    if (!scenario || !currentStage) return;
    
    // Check if there are more interactions in current stage
    if (currentInteractionIndex < currentStage.interactions.length - 1) {
      setCurrentInteractionIndex(currentInteractionIndex + 1);
    } 
    // Check if there are more stages
    else if (currentStageIndex < scenario.stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setCurrentInteractionIndex(0);
    } 
    // Simulation complete
    else {
      setIsComplete(true);
    }
  };
  
  const calculateScore = () => {
    if (!userChoices.length) return 0;
    
    const points = userChoices.reduce((total, choice) => {
      if (choice.value === 'good') return total + 3;
      if (choice.value === 'neutral') return total + 1;
      return total;
    }, 0);
    
    const maxPossiblePoints = userChoices.length * 3;
    return Math.round((points / maxPossiblePoints) * 100);
  };
  
  const handleNext = () => {
    if (currentInteraction?.type !== 'choice') {
      advanceSimulation();
    }
  };
  
  const getButtonLabel = () => {
    if (isComplete) return 'View Results';
    if (currentInteraction?.type === 'choice') return 'Select an option';
    if (currentStageIndex === scenario!.stages.length - 1 && 
        currentInteractionIndex === currentStage!.interactions.length - 1) {
      return 'Complete Simulation';
    }
    return 'Continue';
  };
  
  const handleCompleteSimulation = () => {
    setShowResults(true);
  };
  
  if (!scenario) return null;
  
  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Simulation Complete</h2>
          <p className="text-muted-foreground">
            You've completed the {scenario.title} simulation
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Performance Score</span>
            <span className="font-bold">{calculateScore()}%</span>
          </div>
          <Progress value={calculateScore()} className="h-3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600 h-5 w-5" />
              <h3 className="font-medium">Strengths</h3>
            </div>
            <ul className="text-sm space-y-2">
              {userChoices.filter(c => c.value === 'good').length > 0 ? (
                userChoices
                  .filter(c => c.value === 'good')
                  .slice(0, 3)
                  .map((choice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Made effective strategic decisions</span>
                    </li>
                  ))
              ) : (
                <li className="text-muted-foreground">No notable strengths identified</li>
              )}
            </ul>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-amber-600 h-5 w-5" />
              <h3 className="font-medium">Areas for Improvement</h3>
            </div>
            <ul className="text-sm space-y-2">
              {userChoices.filter(c => c.value === 'bad').length > 0 ? (
                userChoices
                  .filter(c => c.value === 'bad')
                  .slice(0, 3)
                  .map((choice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>Made decisions that could harm your case</span>
                    </li>
                  ))
              ) : (
                <li className="text-green-600">No major issues identified</li>
              )}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-blue-600 h-5 w-5" />
              <h3 className="font-medium">Achievement</h3>
            </div>
            <div className="text-center py-2">
              {calculateScore() >= 80 ? (
                <>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    Expert
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Outstanding performance!
                  </p>
                </>
              ) : calculateScore() >= 60 ? (
                <>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    Proficient
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solid performance with room to grow.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    Developing
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep practicing to improve your skills.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {currentStage.outcome && (
          <div className="mb-8 p-4 border rounded-lg bg-slate-50">
            <h3 className="font-medium mb-2">Outcome</h3>
            <p className="text-muted-foreground">{currentStage.outcome}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentStageIndex(0);
              setCurrentInteractionIndex(0);
              setUserChoices([]);
              setIsComplete(false);
              setShowResults(false);
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Restart Simulation
          </Button>
          
          <Button onClick={() => navigate('/simulation')}>
            Return to Scenarios
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Simulation header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/simulation')}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Scenarios
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Stage {currentStageIndex + 1} of {scenario.stages.length}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                navigate('/simulation');
              }
            }}
          >
            <XCircle className="mr-1 h-4 w-4" /> Exit
          </Button>
        </div>
        
        <Progress value={progress} className="h-2 mb-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>Start</span>
          <span>Complete</span>
        </div>
      </div>
      
      {/* Stage info */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">{currentStage?.title}</h2>
        <p className="text-muted-foreground">{currentStage?.description}</p>
      </div>
      
      {/* Interaction content */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {currentInteraction?.type === 'prompt' && (
          <div className="mb-4">
            {currentInteraction.speaker && currentInteraction.role && (
              <div className="mb-2">
                <span className="font-semibold">{currentInteraction.speaker}</span>
                {currentInteraction.role && (
                  <span className="text-muted-foreground text-sm ml-2">
                    ({currentInteraction.role})
                  </span>
                )}
              </div>
            )}
            <p className="text-base">{currentInteraction.content}</p>
          </div>
        )}
        
        {currentInteraction?.type === 'choice' && (
          <div className="mb-4">
            <h3 className="font-medium mb-4">{currentInteraction.content}</h3>
            <div className="space-y-3">
              {currentInteraction.options?.map((option) => (
                <button
                  key={option.id}
                  className="w-full text-left p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {currentInteraction?.type === 'feedback' && (
          <div className="mb-4">
            <h3 className="font-medium mb-3">{currentInteraction.content}</h3>
            
            {userChoices.filter(c => c.value === 'good').length > 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">Strengths</h4>
                <p className="text-sm text-muted-foreground">
                  {currentInteraction.feedback?.positive}
                </p>
              </div>
            )}
            
            {userChoices.filter(c => c.value === 'bad').length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-1">Areas for Improvement</h4>
                <p className="text-sm text-muted-foreground">
                  {currentInteraction.feedback?.negative}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className={cn(
        "flex justify-end",
        currentInteraction?.type === 'choice' ? "opacity-50" : ""
      )}>
        <Button
          disabled={currentInteraction?.type === 'choice'}
          onClick={isComplete ? handleCompleteSimulation : handleNext}
        >
          {getButtonLabel()}
          {isComplete ? null : <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab="signin"
      />
    </div>
  );
};

export default SimulationEngine;
