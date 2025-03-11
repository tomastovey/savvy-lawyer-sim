
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  XCircle, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Mic, 
  MicOff,
  MessageSquare,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { simulationScenarios, SimulationStage, SimulationInteraction, SimulationOption } from '@/data/simulationData';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '../auth/AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserChoice {
  interactionId: string;
  optionId: string;
  value: 'good' | 'neutral' | 'bad';
}

interface ChatMessage {
  sender: 'user' | 'ai' | 'participant';
  content: string;
  senderName?: string;
  senderRole?: string;
  timestamp: Date;
  isUserTurn?: boolean;
  suggestedResponses?: string[];
}

interface SimulationEngineProps {
  id: string;
}

const SimulationEngine: React.FC<SimulationEngineProps> = ({ id }) => {
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
  
  // Group chat functionality
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiHelperMessage, setAiHelperMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scenario) {
      navigate('/simulation');
      toast.error('Simulation not found');
    }
    
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [scenario, navigate, isAuthenticated]);
  
  // Initialize simulation with first message
  useEffect(() => {
    if (scenario) {
      // Add welcome/context message
      const initialMessages: ChatMessage[] = [
        {
          sender: 'ai',
          senderName: 'System',
          senderRole: 'Simulation Guide',
          content: `Welcome to the ${scenario.title} simulation. ${scenario.context}`,
          timestamp: new Date()
        }
      ];
      
      setChatMessages(initialMessages);
      advanceSimulation(true);
    }
  }, [scenario]);
  
  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
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
    
    // Add user message to chat
    const userChatMessage: ChatMessage = {
      sender: 'user',
      senderName: 'You',
      senderRole: 'Defense Attorney',
      content: option.text,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userChatMessage]);
    
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
  
  const advanceSimulation = (isInitial = false) => {
    if (!scenario || !currentStage) return;
    
    let nextInteractionIndex = currentInteractionIndex;
    let nextStageIndex = currentStageIndex;
    
    // For initial call, don't increment counters
    if (!isInitial) {
      // Check if there are more interactions in current stage
      if (currentInteractionIndex < currentStage.interactions.length - 1) {
        nextInteractionIndex = currentInteractionIndex + 1;
      } 
      // Check if there are more stages
      else if (currentStageIndex < scenario.stages.length - 1) {
        nextStageIndex = currentStageIndex + 1;
        nextInteractionIndex = 0;
      } 
      // Simulation complete
      else {
        setIsComplete(true);
        return;
      }
    }
    
    const nextStage = scenario.stages[nextStageIndex];
    const nextInteraction = nextStage.interactions[nextInteractionIndex];
    
    // Add message to chat based on interaction type
    if (nextInteraction) {
      if (nextInteraction.type === 'prompt') {
        // Add prompt as message from the specified participant
        const promptMessage: ChatMessage = {
          sender: 'participant',
          senderName: nextInteraction.speaker || 'Participant',
          senderRole: nextInteraction.role || '',
          content: nextInteraction.content,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, promptMessage]);
        setIsUserTurn(false);
      } 
      else if (nextInteraction.type === 'choice') {
        // Set user turn - they need to choose an option
        setIsUserTurn(true);
        
        const userTurnMessage: ChatMessage = {
          sender: 'ai',
          senderName: 'System',
          senderRole: 'Prompt',
          content: nextInteraction.content,
          isUserTurn: true,
          suggestedResponses: nextInteraction.options?.map(opt => opt.text) || [],
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, userTurnMessage]);
      }
      else if (nextInteraction.type === 'user-input') {
        // Free text input from user
        setIsUserTurn(true);
        
        const userInputPrompt: ChatMessage = {
          sender: 'ai',
          senderName: 'System',
          senderRole: 'Prompt',
          content: nextInteraction.content,
          isUserTurn: true,
          suggestedResponses: nextInteraction.suggestedResponses || [],
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, userInputPrompt]);
      }
      else if (nextInteraction.type === 'feedback') {
        const feedbackMessage: ChatMessage = {
          sender: 'ai',
          senderName: 'System',
          senderRole: 'Feedback',
          content: nextInteraction.content,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, feedbackMessage]);
        
        if (nextInteraction.feedback) {
          if (userChoices.filter(c => c.value === 'good').length > 0) {
            const positiveMessage: ChatMessage = {
              sender: 'ai',
              senderName: 'System',
              senderRole: 'Positive Feedback',
              content: nextInteraction.feedback.positive,
              timestamp: new Date(Date.now() + 100)
            };
            setChatMessages(prev => [...prev, positiveMessage]);
          }
          
          if (userChoices.filter(c => c.value === 'bad').length > 0) {
            const negativeMessage: ChatMessage = {
              sender: 'ai',
              senderName: 'System',
              senderRole: 'Areas for Improvement',
              content: nextInteraction.feedback.negative,
              timestamp: new Date(Date.now() + 200)
            };
            setChatMessages(prev => [...prev, negativeMessage]);
          }
        }
      }
    }
    
    // Update state for next interaction
    setCurrentInteractionIndex(nextInteractionIndex);
    setCurrentStageIndex(nextStageIndex);
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
  
  const handleSendUserMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim() && !currentInteraction) return;
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      sender: 'user',
      senderName: 'You',
      senderRole: 'Defense Attorney',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsUserTurn(false);
    
    // Record as neutral choice by default if this is a choice interaction
    if (currentInteraction?.type === 'choice' && currentInteraction.options) {
      setUserChoices(prev => [
        ...prev, 
        { 
          interactionId: currentInteraction.id, 
          optionId: 'custom-input',
          value: 'neutral'
        }
      ]);
    }
    
    // Progress to next interaction
    setTimeout(() => {
      advanceSimulation();
    }, 500);
  };
  
  const handleCompleteSimulation = () => {
    setShowResults(true);
  };
  
  const handleAIHelp = () => {
    setShowAIHelper(true);
    
    // Generate contextual advice
    let helpMessage = "";
    
    if (currentStage && currentInteraction) {
      if (currentInteraction.type === 'choice') {
        helpMessage = `In this situation involving ${currentStage.title}, consider what would be most effective given the context. Think about how your response might affect the other participants and the overall outcome of your case.`;
      } else {
        helpMessage = `For this ${scenario?.title} simulation stage, remember your objectives: ${scenario?.objectives[0]}. Your approach should align with your overall case strategy.`;
      }
    } else {
      helpMessage = "I'm here to help with your legal simulation. What specific aspect would you like guidance on?";
    }
    
    setAiHelperMessage(helpMessage);
  };
  
  const handleSuggestedResponseClick = (response: string) => {
    setUserMessage(response);
  };
  
  const toggleVoiceRecording = () => {
    // In a real implementation, this would integrate with a speech-to-text API
    setIsRecording(!isRecording);
    toast.info(isRecording ? "Voice recording stopped" : "Listening for your response...");
    
    if (isRecording) {
      // Simulated voice-to-text result
      setTimeout(() => {
        setUserMessage("I believe we need to focus on the evidence presented in the documentation.");
        setIsRecording(false);
      }, 2000);
    }
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
              setChatMessages([]);
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
    <div className="max-w-4xl mx-auto relative">
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
      <div className="mb-4">
        <h2 className="text-xl font-bold">{currentStage?.title}</h2>
        <p className="text-muted-foreground">{currentStage?.description}</p>
      </div>
      
      {/* Group Chat Interface */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden flex flex-col h-[60vh] min-h-[400px]">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex gap-3 group",
              msg.sender === 'user' ? "justify-end" : ""
            )}>
              {msg.sender !== 'user' && (
                <Avatar className="h-9 w-9 mt-0.5">
                  {msg.sender === 'ai' ? (
                    <AvatarImage src="/lovable-uploads/8970d23c-db91-404f-8796-74ae27161745.png" alt="AI" />
                  ) : null}
                  <AvatarFallback>
                    {msg.sender === 'ai' ? (
                      <MessageSquare className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn(
                "max-w-[80%] flex flex-col",
                msg.sender === 'user' ? "items-end" : "items-start"
              )}>
                {msg.senderName && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.senderName}</span>
                    {msg.senderRole && (
                      <span className="text-xs text-muted-foreground">
                        ({msg.senderRole})
                      </span>
                    )}
                  </div>
                )}
                
                <div className={cn(
                  "p-3 rounded-lg",
                  msg.sender === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : msg.sender === 'ai'
                      ? "bg-secondary text-secondary-foreground rounded-tl-none"
                      : "bg-muted text-muted-foreground rounded-tl-none"
                )}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                
                <div className="text-xs text-muted-foreground mt-1">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                
                {/* Suggested responses */}
                {msg.isUserTurn && msg.suggestedResponses && msg.suggestedResponses.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.suggestedResponses.map((response, i) => (
                      <button 
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-left"
                        onClick={() => handleSuggestedResponseClick(response)}
                      >
                        {response.length > 40 ? response.substring(0, 40) + '...' : response}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {msg.sender === 'user' && (
                <Avatar className="h-9 w-9 mt-0.5">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        {/* Input area */}
        {isUserTurn && (
          <div className="p-3 border-t border-muted">
            {showAIHelper && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-blue-800 mb-1">AI Assistant Tip</h4>
                  <button 
                    onClick={() => setShowAIHelper(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
                <p className="text-muted-foreground">{aiHelperMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSendUserMessage} className="flex flex-col gap-3">
              {currentInteraction?.type === 'choice' && currentInteraction.options && (
                <div className="space-y-3">
                  {currentInteraction.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="w-full text-left p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option.text}
                    </button>
                  ))}
                  <div className="text-center text-sm text-muted-foreground my-2">or</div>
                </div>
              )}
              
              <div className="relative">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="resize-none pr-24"
                  rows={3}
                />
                
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    className={cn(isRecording ? "bg-red-100 text-red-500 border-red-200" : "")}
                    onClick={toggleVoiceRecording}
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </Button>
                  
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    onClick={handleAIHelp}
                  >
                    <MessageSquare size={18} />
                  </Button>
                  
                  <Button type="submit" size="icon">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Navigation buttons - only show when not user's turn */}
        {!isUserTurn && (
          <div className="p-3 border-t border-muted flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIHelp}
            >
              Ask for Help
              <MessageSquare className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={isComplete ? handleCompleteSimulation : () => advanceSimulation()}
              disabled={isUserTurn}
            >
              {isComplete ? "View Results" : "Continue"}
              {!isComplete && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}
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
