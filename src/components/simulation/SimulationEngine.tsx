
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
  User,
  Info,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { simulationScenarios, SimulationStage, SimulationInteraction, SimulationOption } from '@/data/simulationData';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '../auth/AuthModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface UserChoice {
  interactionId: string;
  optionId: string;
  value: 'good' | 'neutral' | 'bad';
}

interface ChatMessage {
  sender: 'user' | 'ai' | 'participant' | 'objection';
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
  const [showCourtGuidelines, setShowCourtGuidelines] = useState(false);
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
          senderName: 'Court System',
          senderRole: 'Simulation Guide',
          content: `Welcome to the ${scenario.title} simulation. You are now in the Superior Court of Justice. ${scenario.context}`,
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
    
    // Show feedback based on option value
    if (option.value === 'good') {
      // Visual cue in the courtroom of approval
      setTimeout(() => {
        const goodFeedback: ChatMessage = {
          sender: 'ai',
          senderName: 'Courtroom Observer',
          senderRole: 'Body Language',
          content: 'You notice the jury members nodding slightly, seemingly receptive to your questioning approach.',
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, goodFeedback]);
      }, 800);
    } else if (option.value === 'bad') {
      // Visual cue of disapproval
      setTimeout(() => {
        const consequenceMessage: ChatMessage = {
          sender: 'objection',
          senderName: 'Courtroom Reaction',
          content: option.consequence,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, consequenceMessage]);
      }, 800);
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
          senderName: 'Court System',
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
          senderName: 'Court System',
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
          senderName: 'Court System',
          senderRole: 'Feedback',
          content: nextInteraction.content,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, feedbackMessage]);
        
        if (nextInteraction.feedback) {
          if (userChoices.filter(c => c.value === 'good').length > 0) {
            const positiveMessage: ChatMessage = {
              sender: 'ai',
              senderName: 'Legal Mentor',
              senderRole: 'Positive Feedback',
              content: nextInteraction.feedback.positive,
              timestamp: new Date(Date.now() + 100)
            };
            setChatMessages(prev => [...prev, positiveMessage]);
          }
          
          if (userChoices.filter(c => c.value === 'bad').length > 0) {
            const negativeMessage: ChatMessage = {
              sender: 'ai',
              senderName: 'Legal Mentor',
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
    
    // Courtroom reaction to user input
    setTimeout(() => {
      // Random courtroom ambiance reactions for realism
      const reactions = [
        "The gallery remains silent as your words echo in the courtroom.",
        "The court reporter's fingers move quickly across the stenotype machine.",
        "The opposing counsel scribbles notes as you finish speaking.",
        "The judge maintains a neutral expression, carefully considering your statement."
      ];
      
      const ambianceMessage: ChatMessage = {
        sender: 'ai',
        senderName: 'Courtroom',
        senderRole: 'Ambiance',
        content: reactions[Math.floor(Math.random() * reactions.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, ambianceMessage]);
      
      // Progress to next interaction
      advanceSimulation();
    }, 800);
  };
  
  const handleCompleteSimulation = () => {
    setShowResults(true);
  };
  
  const handleAIHelp = () => {
    setShowAIHelper(true);
    
    // Generate contextual advice based on current stage
    let helpMessage = "";
    
    if (currentStage && currentInteraction) {
      if (currentInteraction.type === 'choice') {
        helpMessage = `Attorney: As we're in the ${currentStage.title} phase of this case, remember that in court, leading questions are most effective during cross-examination. Consider what information you need to establish for the record, and how the witness's answers might impact the jury's perception. Think about maintaining a respectful but authoritative demeanor.`;
      } else if (currentInteraction.type === 'user-input') {
        helpMessage = `Attorney: For this part of your ${scenario?.title}, remember to address the court formally. "Your Honor" for the judge, "Counsel" for opposing attorneys. Be concise and clear in your statements. This is your opportunity to reinforce the key points that support your case theory.`;
      } else {
        helpMessage = `Attorney: In this ${scenario?.title} stage, your primary objective should be: ${scenario?.objectives[0]}. Watch the jury's reaction to gauge the effectiveness of your approach, and remember that maintaining credibility with the court is essential.`;
      }
    } else {
      helpMessage = "Attorney: I'm here to provide legal guidance during this simulation. What specific aspect of courtroom procedure would you like advice on?";
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
        setUserMessage("Your Honor, I'd like to direct the court's attention to the witness's earlier testimony regarding the safety protocols.");
        setIsRecording(false);
      }, 2000);
    }
  };
  
  if (!scenario) return null;
  
  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Case Proceedings Concluded</h2>
          <p className="text-muted-foreground">
            You've completed the {scenario.title} simulation
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Legal Performance Assessment</span>
            <span className="font-bold">{calculateScore()}%</span>
          </div>
          <Progress value={calculateScore()} className="h-3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-600 h-5 w-5" />
              <h3 className="font-medium">Legal Strengths</h3>
            </div>
            <ul className="text-sm space-y-2">
              {userChoices.filter(c => c.value === 'good').length > 0 ? (
                userChoices
                  .filter(c => c.value === 'good')
                  .slice(0, 3)
                  .map((choice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>Demonstrated excellent questioning strategy and control of witness testimony</span>
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
                      <span>Made procedural errors that could have been avoided with better courtroom strategy</span>
                    </li>
                  ))
              ) : (
                <li className="text-green-600">No significant procedural errors noted</li>
              )}
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="text-blue-600 h-5 w-5" />
              <h3 className="font-medium">Professional Assessment</h3>
            </div>
            <div className="text-center py-2">
              {calculateScore() >= 85 ? (
                <>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    Lead Counsel
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Exceptional command of courtroom procedure and strategy.
                  </p>
                </>
              ) : calculateScore() >= 70 ? (
                <>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    Associate Attorney
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Solid performance with good understanding of legal strategy.
                  </p>
                </>
              ) : calculateScore() >= 50 ? (
                <>
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    Junior Associate
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Shows potential but needs more courtroom experience.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-500 mb-1">
                    Law Clerk
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requires significant improvement in courtroom procedure and strategy.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8 p-5 border rounded-lg bg-slate-50">
          <h3 className="font-medium mb-3 text-lg">Case Outcome & Judicial Assessment</h3>
          <div className="prose prose-slate prose-sm max-w-none">
            {currentStage.outcome && (
              <p className="text-muted-foreground mb-4">{currentStage.outcome}</p>
            )}
            
            <div className="bg-white p-4 rounded-md border border-slate-200 mb-4">
              <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                <Gavel className="h-4 w-4" /> Judge's Chambers Notes
              </h4>
              <p className="italic text-slate-600">
                {calculateScore() >= 80 
                  ? "Counsel demonstrated excellent command of procedure and evidence rules. Questioning was precise and effective. Would be pleased to see this attorney in my courtroom again."
                  : calculateScore() >= 60
                    ? "Counsel showed competence in most aspects of trial procedure. Some questioning could have been more focused, but overall maintained professional standards expected by this court."
                    : "Counsel needs significant improvement in courtroom procedure and evidentiary rules. Would recommend additional training and preparation before handling similar cases."}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-slate-200">
              <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" /> Jury Perception
              </h4>
              <p className="italic text-slate-600">
                {calculateScore() >= 80 
                  ? "The jury appeared receptive to your arguments and questioning strategy. Your clear presentation likely influenced their understanding of key facts in your client's favor."
                  : calculateScore() >= 60
                    ? "The jury seemed to follow your arguments, though at times appeared unsure about the direction of your questioning. Overall neutral to slightly positive impression."
                    : "The jury appeared confused by some of your questioning techniques and may have perceived procedural missteps negatively, potentially impacting your client's case."}
              </p>
            </div>
          </div>
        </div>
        
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
              // Add simulation restart message
              const restartMessage: ChatMessage = {
                sender: 'ai',
                senderName: 'Court System',
                senderRole: 'Simulation Guide',
                content: `Simulation restarted. Welcome back to the ${scenario.title} simulation.`,
                timestamp: new Date()
              };
              setChatMessages([restartMessage]);
              advanceSimulation(true);
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retry Case
          </Button>
          
          <Button onClick={() => navigate('/simulation')}>
            Return to Case Selection
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
            <ChevronLeft className="h-4 w-4" /> Back to Cases
          </Button>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Phase {currentStageIndex + 1} of {scenario.stages.length}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setShowCourtGuidelines(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit this case? Your progress will be lost.')) {
                navigate('/simulation');
              }
            }}
          >
            <XCircle className="mr-1 h-4 w-4" /> Exit Case
          </Button>
        </div>
        
        <Progress value={progress} className="h-2 mb-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>Case Opened</span>
          <span>Case Concluded</span>
        </div>
      </div>
      
      {/* Stage info */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">{currentStage?.title}</h2>
        <p className="text-muted-foreground">{currentStage?.description}</p>
      </div>
      
      {/* Courtroom Chat Interface */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden flex flex-col h-[60vh] min-h-[400px] border border-gray-200">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={cn(
              "flex gap-3 group",
              msg.sender === 'user' ? "justify-end" : "",
              msg.sender === 'objection' ? "bg-red-50 p-2 rounded-lg" : ""
            )}>
              {msg.sender !== 'user' && (
                <Avatar className="h-9 w-9 mt-0.5">
                  {msg.sender === 'ai' ? (
                    <AvatarImage src="/lovable-uploads/8970d23c-db91-404f-8796-74ae27161745.png" alt="AI" />
                  ) : null}
                  <AvatarFallback>
                    {msg.sender === 'ai' ? (
                      <MessageSquare className="h-5 w-5" />
                    ) : msg.sender === 'objection' ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
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
                    <span className={cn(
                      "font-medium text-sm",
                      msg.sender === 'objection' && "text-red-600"
                    )}>{msg.senderName}</span>
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
                      : msg.sender === 'objection'
                        ? "bg-red-100 text-red-800 border border-red-200 rounded-tl-none"
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
                  <h4 className="font-medium text-blue-800 mb-1">Legal Advisor Tip</h4>
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
                  <div className="text-center text-sm text-muted-foreground my-2">or formulate your own response</div>
                </div>
              )}
              
              <div className="relative">
                <Textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  placeholder="Type your courtroom response..."
                  className="resize-none pr-24 bg-white"
                  rows={3}
                />
                
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    className={cn(isRecording ? "bg-red-100 text-red-500 border-red-200" : "")}
                    onClick={toggleVoiceRecording}
                    title="Voice input"
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </Button>
                  
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline"
                    onClick={handleAIHelp}
                    title="Get legal advice"
                  >
                    <MessageSquare size={18} />
                  </Button>
                  
                  <Button type="submit" size="icon" title="Submit response">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Navigation buttons - only show when not user's turn */}
        {!isUserTurn && (
          <div className="p-3 border-t border-muted flex justify-between bg-white">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIHelp}
            >
              Request Legal Advice
              <MessageSquare className="ml-2 h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={isComplete ? handleCompleteSimulation : () => advanceSimulation()}
              disabled={isUserTurn}
            >
              {isComplete ? "View Case Assessment" : "Continue"}
              {!isComplete && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
      
      {/* Court Guidelines Dialog */}
      <Dialog open={showCourtGuidelines} onOpenChange={setShowCourtGuidelines}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Court Procedures & Guidelines</DialogTitle>
            <DialogDescription>
              Important protocols for this legal proceeding
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Courtroom Etiquette</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Always address the judge as "Your Honor"</li>
                <li>Stand when addressing the court</li>
                <li>Refer to opposing counsel as "Counsel"</li>
                <li>Do not interrupt when others are speaking</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Objections</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Object promptly when rules of evidence are violated</li>
                <li>State the legal basis for the objection</li>
                <li>Wait for the judge's ruling before continuing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Questioning Witnesses</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Use leading questions during cross-examination</li>
                <li>Avoid argumentative or badgering techniques</li>
                <li>Ask clear, concise questions</li>
                <li>Do not ask for speculation or hearsay</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
