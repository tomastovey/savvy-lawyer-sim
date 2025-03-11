
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimulationEngine from '@/components/simulation/SimulationEngine';
import SimulationPreview from '@/components/SimulationPreview';
import Navigation from '@/components/Navigation';
import { simulationScenarios } from '@/data/simulationData';

const SimulationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Validate simulation ID
    if (id && !simulationScenarios.some(s => s.id === id)) {
      navigate('/simulation', { replace: true });
    }
  }, [id, navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="h-16 md:h-20"></div> {/* Spacer for navigation */}
      
      <div className="py-6 px-4 md:py-12 md:px-6">
        {id ? (
          <SimulationEngine id={id} />
        ) : (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Legal Simulations</h1>
            <SimulationPreview />
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationPage;
