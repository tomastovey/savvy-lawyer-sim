
import React from 'react';
import { FileSearch, Scale, BookOpen, PenTool, Briefcase, Gavel } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: FileSearch,
    title: 'Document Analysis',
    description: 'AI analyzes briefs, evidence, and transcripts to extract every critical detail in seconds.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Scale,
    title: 'Argument Evaluation',
    description: 'Highlights your strongest arguments and identifies vulnerabilities for improvement.',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    icon: BookOpen,
    title: 'Legal Research',
    description: 'Identifies areas needing further research and provides relevant case law and precedents.',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: PenTool,
    title: 'Strategy Refinement',
    description: 'Helps refine your strategy and perfect cross-examinations through interactive scenarios.',
    color: 'bg-sky-50 text-sky-600'
  },
  {
    icon: Briefcase,
    title: 'Case Organization',
    description: 'Organizes all case materials and insights in one central, easily accessible dashboard.',
    color: 'bg-cyan-50 text-cyan-600'
  },
  {
    icon: Gavel,
    title: 'Courtroom Simulation',
    description: 'Practice in a realistic courtroom environment to prepare for every possible challenge.',
    color: 'bg-teal-50 text-teal-600'
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <div 
      className={cn(
        "rounded-xl p-6 glass-panel transition-all duration-300 group hover:shadow-md",
        "animate-fade-up [animation-delay:var(--delay)]"
      )}
      style={{ '--delay': `${index * 100 + 200}ms` } as React.CSSProperties}
    >
      <div className={cn("p-3 rounded-lg w-fit mb-4", feature.color)}>
        <feature.icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
            Key Features
          </div>
          <h2 className="heading-lg max-w-3xl mx-auto text-balance">
            Revolutionize Your Legal Preparation
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-balance">
            Comprehensive tools designed to analyze, strategize, and simulate every aspect of your legal case.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
