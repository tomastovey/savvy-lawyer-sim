
import React from 'react';
import { useParams } from 'react-router-dom';
import SimulationEngine from '@/components/simulation/SimulationEngine';
import SimulationPreview from '@/components/SimulationPreview';

const SimulationPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 md:h-20"></div> {/* Spacer for navigation */}
      
      <div className="py-6 px-4 md:py-12 md:px-6">
        {id ? (
          <SimulationEngine id={id} />
        ) : (
          <div className="max-w-5xl mx-auto">
            <SimulationPreview />
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;
