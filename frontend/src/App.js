import React, { useState } from 'react';
import InitializationWizard from './components/InitializationWizard';
import ServiceSelector from './components/ServiceSelector';
import ServiceConfiguration from './components/ServiceConfiguration';
import DeploymentScriptGenerator from './components/DeploymentScriptGenerator';
import DeploymentInstructions from './components/DeploymentInstructions';

function App() {
  const [step, setStep] = useState('init');
  const [config, setConfig] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  const handleInitializationComplete = (data) => {
    setConfig(data);
    setStep('services');
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep('config');
  };

  const handleConfigurationComplete = (serviceConfig) => {
    setConfig(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [selectedService.id]: serviceConfig
      }
    }));
    setStep('generate');
  };

  const handleBackToServices = () => {
    setSelectedService(null);
    setStep('services');
  };

  const renderStep = () => {
    switch (step) {
      case 'init':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-8">Project Initialization</h2>
            <InitializationWizard onComplete={handleInitializationComplete} />
          </div>
        );
      case 'services':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-8">Select AWS Service</h2>
            <ServiceSelector onServiceSelect={handleServiceSelect} />
          </div>
        );
      case 'config':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-8">Configure {selectedService.name}</h2>
            <ServiceConfiguration
              service={selectedService.id}
              formData={config.services?.[selectedService.id] || {}}
              onChange={(e) => {
                const { name, value, type, checked } = e.target;
                const newConfig = {
                  ...config.services?.[selectedService.id],
                  [name]: type === 'checkbox' ? checked : value
                };
                handleConfigurationComplete(newConfig);
              }}
            />
            <div className="mt-6">
              <button
                onClick={handleBackToServices}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Services
              </button>
            </div>
          </div>
        );
      case 'generate':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-8">Generated Configuration</h2>
            <DeploymentScriptGenerator config={config} />
            <div className="flex justify-between">
              <button
                onClick={handleBackToServices}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Configure More Services
              </button>
              <button
                onClick={() => setStep('deploy')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                View Deployment Instructions
              </button>
            </div>
          </div>
        );
      case 'deploy':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-8">Deployment Instructions</h2>
            <DeploymentInstructions config={config} />
            <div className="mt-6">
              <button
                onClick={() => setStep('generate')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Configuration
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;