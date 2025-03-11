
import { Check, Users, Scale, Gavel, MessageSquare, Brain } from "lucide-react";

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  participants: string;
  icon: any;
  objectives: string[];
  context: string;
  stages: SimulationStage[];
}

export interface SimulationStage {
  id: string;
  title: string;
  description: string;
  interactions: SimulationInteraction[];
  outcome?: string;
}

export interface SimulationInteraction {
  id: string;
  type: 'prompt' | 'choice' | 'feedback';
  content: string;
  speaker?: string;
  role?: string;
  options?: SimulationOption[];
  feedback?: {
    positive: string;
    negative: string;
  };
}

export interface SimulationOption {
  id: string;
  text: string;
  value: 'good' | 'neutral' | 'bad';
  consequence: string;
}

export const simulationScenarios: SimulationScenario[] = [
  {
    id: 'cross-examination',
    title: 'Cross-Examination',
    description: 'Practice challenging witness testimony with AI-powered responses',
    difficulty: 'Medium',
    duration: '30 min',
    participants: '2-3',
    icon: MessageSquare,
    objectives: [
      'Expose inconsistencies in witness testimony',
      'Maintain control of the questioning',
      'Avoid asking open-ended questions',
      'Build a narrative that supports your case theory'
    ],
    context: 'You are representing the defendant in a personal injury case. The plaintiff claims they slipped and fell due to negligent maintenance of your client\'s property. The witness is a store employee who was on duty when the incident occurred.',
    stages: [
      {
        id: 'stage-1',
        title: 'Preparation',
        description: 'Review witness statement and prepare your approach',
        interactions: [
          {
            id: 'intro-1',
            type: 'prompt',
            content: 'The witness has stated that they saw the plaintiff fall, but they were busy helping another customer and didn\'t see what caused the fall. They also mentioned that floor warning signs are "usually" put up after mopping.',
            speaker: 'System',
            role: 'Instructor'
          },
          {
            id: 'prep-choice-1',
            type: 'choice',
            content: 'How will you approach this cross-examination?',
            options: [
              {
                id: 'approach-1',
                text: 'Be aggressive and immediately challenge the witness\'s credibility',
                value: 'bad',
                consequence: 'Starting with an aggressive approach may alienate the jury and make the witness defensive or uncooperative.'
              },
              {
                id: 'approach-2',
                text: 'Begin with friendly, factual questions to establish a foundation before challenging inconsistencies',
                value: 'good',
                consequence: 'This approach helps build rapport and creates a foundation of agreed facts before challenging any inconsistencies.'
              },
              {
                id: 'approach-3',
                text: 'Ask open-ended questions to get the witness to provide more details',
                value: 'neutral',
                consequence: 'Open-ended questions give the witness too much control and may allow them to elaborate in ways that hurt your case.'
              }
            ]
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'Initial Questioning',
        description: 'Establish basic facts and witness background',
        interactions: [
          {
            id: 'witness-intro',
            type: 'prompt',
            content: 'Good morning. My name is Sarah Johnson. I have worked at the store for about 3 years as a sales associate.',
            speaker: 'Witness',
            role: 'Store Employee'
          },
          {
            id: 'q1-choice',
            type: 'choice',
            content: 'Select your first line of questioning:',
            options: [
              {
                id: 'q1-1',
                text: 'Ms. Johnson, you were helping another customer when the incident occurred, correct?',
                value: 'good',
                consequence: 'This establishes a key fact that limits the witness\'s ability to have observed what happened.'
              },
              {
                id: 'q1-2',
                text: 'Can you tell us everything you remember about the day of the incident?',
                value: 'bad',
                consequence: 'This open-ended question gives the witness too much freedom to potentially harm your case.'
              },
              {
                id: 'q1-3',
                text: 'You didn\'t actually see what caused the plaintiff to fall, did you?',
                value: 'neutral',
                consequence: 'While this gets to an important point, it\'s too direct too early and could make the witness defensive.'
              }
            ]
          },
          {
            id: 'witness-response-1',
            type: 'prompt',
            content: 'Yes, I was helping another customer at the time. I was showing them some products on the opposite side of the aisle.',
            speaker: 'Witness',
            role: 'Store Employee'
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Core Examination',
        description: 'Challenge key aspects of the testimony',
        interactions: [
          {
            id: 'q2-choice',
            type: 'choice',
            content: 'Follow up question:',
            options: [
              {
                id: 'q2-1',
                text: 'And because you were helping this other customer, you didn\'t actually see what caused the plaintiff to fall, correct?',
                value: 'good',
                consequence: 'This effectively establishes a limitation in the witness\'s testimony.'
              },
              {
                id: 'q2-2',
                text: 'Would you say you were distracted at the time of the incident?',
                value: 'neutral',
                consequence: 'This question is somewhat leading and could allow the witness to disagree.'
              },
              {
                id: 'q2-3',
                text: 'So you are admitting you were not paying attention to safety hazards in your section?',
                value: 'bad',
                consequence: 'This is overly aggressive and mischaracterizes what the witness said, which could damage your credibility.'
              }
            ]
          },
          {
            id: 'witness-response-2',
            type: 'prompt',
            content: 'That\'s correct. I heard a noise and turned around to see the plaintiff on the floor, but I didn\'t see them actually fall or what caused it.',
            speaker: 'Witness',
            role: 'Store Employee'
          },
          {
            id: 'q3-choice',
            type: 'choice',
            content: 'Now focus on the warning signs:',
            options: [
              {
                id: 'q3-1',
                text: 'You mentioned in your statement that warning signs are "usually" put up after mopping. Does that mean sometimes they aren\'t?',
                value: 'good',
                consequence: 'This effectively highlights a potential inconsistency in store safety procedures.'
              },
              {
                id: 'q3-2',
                text: 'Tell me about your store\'s cleaning procedures.',
                value: 'bad',
                consequence: 'This open-ended question could allow the witness to provide rehearsed answers that strengthen the plaintiff\'s case.'
              },
              {
                id: 'q3-3',
                text: 'Do you know who was responsible for putting up warning signs that day?',
                value: 'neutral',
                consequence: 'This is a relevant question but doesn\'t directly address the inconsistency in the witness\'s statement.'
              }
            ]
          }
        ]
      },
      {
        id: 'stage-4',
        title: 'Closing',
        description: 'Finish examination with strong points',
        interactions: [
          {
            id: 'witness-response-3',
            type: 'prompt',
            content: 'Well... yes, I suppose there could be times when someone might forget to put them up right away. I can\'t say it happens often, but it\'s possible.',
            speaker: 'Witness',
            role: 'Store Employee'
          },
          {
            id: 'q4-choice',
            type: 'choice',
            content: 'Final question:',
            options: [
              {
                id: 'q4-1',
                text: 'And you have no personal knowledge of whether warning signs were put up on the day of the incident, correct?',
                value: 'good',
                consequence: 'This effectively concludes by emphasizing the witness\'s lack of knowledge about a key fact.'
              },
              {
                id: 'q4-2',
                text: 'Would you agree that the store might have been negligent that day?',
                value: 'bad',
                consequence: 'This asks for a legal conclusion and allows the witness to defend the store.'
              },
              {
                id: 'q4-3',
                text: 'No further questions, Your Honor.',
                value: 'neutral',
                consequence: 'This misses an opportunity to end with a strong point that benefits your case.'
              }
            ]
          },
          {
            id: 'witness-final',
            type: 'prompt',
            content: 'That\'s correct. I don\'t know if they were put up that day or not.',
            speaker: 'Witness',
            role: 'Store Employee'
          },
          {
            id: 'closing',
            type: 'prompt',
            content: 'No further questions, Your Honor.',
            speaker: 'You',
            role: 'Defense Attorney'
          }
        ],
        outcome: 'Your cross-examination successfully established that the witness did not see what caused the fall and cannot confirm whether warning signs were present. These points support your defense that there\'s insufficient evidence of your client\'s negligence.'
      }
    ]
  },
  {
    id: 'opening-statement',
    title: 'Opening Statement',
    description: 'Rehearse your opening statement with real-time feedback on delivery and content',
    difficulty: 'Easy',
    duration: '15 min',
    participants: '1',
    icon: Gavel,
    objectives: [
      'Present a clear roadmap of your case',
      'Introduce key evidence and witnesses',
      'Establish your case theory',
      'Connect with the jury'
    ],
    context: 'You are prosecuting a case involving corporate fraud. The defendant, a CFO, is accused of misrepresenting financial statements to investors, resulting in significant losses.',
    stages: [
      {
        id: 'prep-stage',
        title: 'Preparation',
        description: 'Plan the structure and key points of your opening statement',
        interactions: [
          {
            id: 'prep-intro',
            type: 'prompt',
            content: 'Before delivering your opening statement, consider your approach. You have evidence including doctored financial records, witness testimony from a whistleblower, and suspicious money transfers.',
            speaker: 'System',
            role: 'Instructor'
          },
          {
            id: 'prep-choice',
            type: 'choice',
            content: 'How will you structure your opening statement?',
            options: [
              {
                id: 'structure-1',
                text: 'Begin with emotional appeal about victim impact, then present evidence chronologically',
                value: 'neutral',
                consequence: 'While emotional appeals can be effective, starting this way may seem manipulative before establishing facts.'
              },
              {
                id: 'structure-2',
                text: 'Present a clear narrative that weaves together the evidence to tell a compelling story',
                value: 'good',
                consequence: 'This approach helps jurors understand and remember the case while maintaining credibility.'
              },
              {
                id: 'structure-3',
                text: 'Focus primarily on technical financial details to demonstrate expertise',
                value: 'bad',
                consequence: 'This approach risks losing jurors who may not understand complex financial concepts.'
              }
            ]
          }
        ]
      },
      {
        id: 'delivery-stage',
        title: 'Statement Delivery',
        description: 'Present your opening statement to the jury',
        interactions: [
          {
            id: 'intro-choice',
            type: 'choice',
            content: 'Select your opening line:',
            options: [
              {
                id: 'intro-1',
                text: '"Ladies and gentlemen of the jury, today we will prove beyond a reasonable doubt that the defendant knowingly defrauded investors."',
                value: 'neutral',
                consequence: 'This is direct but somewhat formulaic and doesn\'t grab attention.'
              },
              {
                id: 'intro-2',
                text: '"Imagine investing your life savings based on a lie. That\'s what happened to the victims in this case."',
                value: 'good',
                consequence: 'This opening immediately engages jurors and frames the case in human terms.'
              },
              {
                id: 'intro-3',
                text: '"The financial evidence in this case is extremely complex, but I\'ll try to simplify it for you."',
                value: 'bad',
                consequence: 'This unnecessarily emphasizes complexity and may make jurors feel inadequate.'
              }
            ]
          },
          {
            id: 'evidence-choice',
            type: 'choice',
            content: 'How will you present the evidence?',
            options: [
              {
                id: 'evidence-1',
                text: 'Present a detailed analysis of each financial document',
                value: 'bad',
                consequence: 'This approach is too detailed for an opening statement and risks losing jurors\' attention.'
              },
              {
                id: 'evidence-2',
                text: 'Focus on the whistleblower\'s testimony and human elements',
                value: 'neutral',
                consequence: 'While compelling, relying too heavily on one witness might seem insufficient.'
              },
              {
                id: 'evidence-3',
                text: 'Present a clear timeline connecting the defendant\'s actions, the falsified records, and the resulting investor losses',
                value: 'good',
                consequence: 'This creates a coherent narrative that helps jurors understand the case theory.'
              }
            ]
          }
        ]
      },
      {
        id: 'conclusion-stage',
        title: 'Conclusion',
        description: 'Wrap up your opening statement effectively',
        interactions: [
          {
            id: 'closing-choice',
            type: 'choice',
            content: 'Select your concluding statement:',
            options: [
              {
                id: 'closing-1',
                text: '"By the end of this trial, you will have no choice but to find the defendant guilty of all charges."',
                value: 'bad',
                consequence: 'This is too forceful and may alienate jurors who value their autonomy in decision-making.'
              },
              {
                id: 'closing-2',
                text: '"The evidence will show that the defendant deliberately misled investors, causing financial harm. We ask you to hold them accountable."',
                value: 'good',
                consequence: 'This confidently states what the evidence will show while respecting the jury\'s role.'
              },
              {
                id: 'closing-3',
                text: '"We have a lot of evidence to present, and I appreciate your attention throughout this complex case."',
                value: 'neutral',
                consequence: 'This misses the opportunity to reinforce key points and ends on a weak note.'
              }
            ]
          },
          {
            id: 'feedback',
            type: 'feedback',
            content: 'Based on your choices, here\'s feedback on your opening statement:',
            feedback: {
              positive: 'You effectively presented a clear narrative that connected with jurors emotionally while outlining the evidence in a logical sequence. Your conclusion appropriately asked for accountability without being overbearing.',
              negative: 'Your opening statement could be improved by creating a more cohesive narrative and avoiding technical jargon. Consider focusing more on the human impact of the alleged fraud and presenting a clearer roadmap of your case.'
            }
          }
        ],
        outcome: 'Your opening statement effectively set the stage for your case, providing the jury with a clear understanding of the evidence they will see and the story it tells about the defendant\'s actions.'
      }
    ]
  },
  {
    id: 'jury-selection',
    title: 'Jury Selection',
    description: 'Develop skills in identifying favorable jurors and eliminating biased candidates',
    difficulty: 'Hard',
    duration: '45 min',
    participants: '5+',
    icon: Users,
    objectives: [
      'Identify juror biases relevant to your case',
      'Ask effective voir dire questions',
      'Strategically use peremptory and for-cause challenges',
      'Select a jury favorable to your case theory'
    ],
    context: 'You are defending a client accused of white-collar embezzlement. You need to select jurors who will be open to your defense that your client was framed by a vindictive supervisor.',
    stages: [
      {
        id: 'js-prep',
        title: 'Preparation',
        description: 'Plan your jury selection strategy',
        interactions: [
          {
            id: 'js-prep-intro',
            type: 'prompt',
            content: 'Before beginning voir dire, you need to determine what juror profiles might be favorable or unfavorable to your case.',
            speaker: 'System',
            role: 'Instructor'
          },
          {
            id: 'js-prep-choice',
            type: 'choice',
            content: 'Which of these potential juror traits would be most concerning for your defense?',
            options: [
              {
                id: 'juror-concern-1',
                text: 'A juror who works in banking or financial compliance',
                value: 'good',
                consequence: 'This shows good awareness - such jurors might be inherently skeptical of financial crime defenses and have strong opinions about corporate responsibility.'
              },
              {
                id: 'juror-concern-2',
                text: 'A juror who enjoys reality TV shows',
                value: 'bad',
                consequence: 'This trait has little relevance to how a juror might view your case and shows poor prioritization of concerns.'
              },
              {
                id: 'juror-concern-3',
                text: 'A juror who has expressed general distrust of large corporations',
                value: 'neutral',
                consequence: 'While this might be relevant in some corporate cases, it\'s not directly related to your client\'s embezzlement case or their defense of being framed.'
              }
            ]
          }
        ]
      },
      {
        id: 'voir-dire',
        title: 'Voir Dire Questioning',
        description: 'Question potential jurors to uncover biases',
        interactions: [
          {
            id: 'juror-intro-1',
            type: 'prompt',
            content: 'Juror #4: "I\'ve been an accountant for 15 years and have conducted several corporate audits."',
            speaker: 'Potential Juror',
            role: 'Accountant'
          },
          {
            id: 'voir-dire-q1',
            type: 'choice',
            content: 'What question would you ask this juror?',
            options: [
              {
                id: 'q-accountant-1',
                text: '"Have you ever uncovered financial impropriety in your audits, and if so, how did that affect your view of the people involved?"',
                value: 'good',
                consequence: 'This directly addresses potential bias from professional experience that could affect their view of your client.'
              },
              {
                id: 'q-accountant-2',
                text: '"Do you think you can be fair in this case?"',
                value: 'bad',
                consequence: 'This is too direct and will likely just get an affirmative answer without revealing actual biases.'
              },
              {
                id: 'q-accountant-3',
                text: '"What do you know about embezzlement schemes?"',
                value: 'neutral',
                consequence: 'This might reveal knowledge but doesn\'t directly address potential bias.'
              }
            ]
          },
          {
            id: 'juror-intro-2',
            type: 'prompt',
            content: 'Juror #7: "I was once accused of workplace theft, but it turned out to be a misunderstanding."',
            speaker: 'Potential Juror',
            role: 'Office Worker'
          },
          {
            id: 'voir-dire-q2',
            type: 'choice',
            content: 'What question would you ask this juror?',
            options: [
              {
                id: 'q-accused-1',
                text: '"How did that experience affect your view of workplace accusations and the people who make them?"',
                value: 'good',
                consequence: 'This effectively explores how personal experience might create empathy for your client\'s claim of being framed.'
              },
              {
                id: 'q-accused-2',
                text: '"Did you do it?"',
                value: 'bad',
                consequence: 'This is inappropriate and antagonistic, likely to alienate both the juror and others in the panel.'
              },
              {
                id: 'q-accused-3',
                text: '"How was the misunderstanding resolved?"',
                value: 'neutral',
                consequence: 'This is relevant but doesn\'t directly address how the experience might affect their judgment in your case.'
              }
            ]
          }
        ]
      },
      {
        id: 'challenges',
        title: 'Juror Challenges',
        description: 'Strategically use challenges to shape the jury',
        interactions: [
          {
            id: 'challenge-intro',
            type: 'prompt',
            content: 'You have one remaining peremptory challenge and need to decide which potential juror to remove from the panel.',
            speaker: 'System',
            role: 'Instructor'
          },
          {
            id: 'challenge-choice',
            type: 'choice',
            content: 'Which juror would you use your final peremptory challenge on?',
            options: [
              {
                id: 'challenge-1',
                text: 'The accountant who has previously testified as an expert witness for the prosecution in fraud cases',
                value: 'good',
                consequence: 'This juror likely has strong biases against financial crimes defendants and professional credibility that might influence other jurors.'
              },
              {
                id: 'challenge-2',
                text: 'The retired teacher who expressed being "tough on crime" but has no specific financial background',
                value: 'neutral',
                consequence: 'While this juror might have some general bias, they lack the specific expertise that would make them particularly damaging to your case.'
              },
              {
                id: 'challenge-3',
                text: 'The nurse who mentioned she doesn\'t follow financial news',
                value: 'bad',
                consequence: 'This juror shows no particular bias against your client and their lack of financial expertise might actually be beneficial for your defense.'
              }
            ]
          }
        ],
        outcome: 'Your jury selection strategy has resulted in a panel that includes several members with personal experiences of workplace conflicts and misunderstandings. You\'ve successfully removed jurors with strong financial compliance backgrounds who might have been skeptical of your defense theory.'
      }
    ]
  }
];
