import React from 'react';
import { useParams } from 'react-router-dom';
import SimulationEngine from '@/components/simulation/SimulationEngine';
import SimulationPreview from '@/components/SimulationPreview';

const SimulationPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // If id is provided, show the specific simulation
  // Otherwise, show the simulation preview with scenarios
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 md:h-20"></div> {/* Spacer for navigation */}
      
      <div className="py-12 px-6">
        {id ? (
          <SimulationEngine />
        ) : (
          <SimulationPreview />
        )}
      </div>
    </div>
  );
};

export default SimulationPage;
