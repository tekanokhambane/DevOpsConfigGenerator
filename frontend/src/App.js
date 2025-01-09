import React, { useState, useEffect } from 'react';

function App() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [configOptions, setConfigOptions] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    appName: '',
    serviceType: '',
    region: '',
    instanceType: '',
    runtime: '',
    memory: 128,
    timeout: 3,
    launchType: '',
    volumeSize: 8,
    containerImage: '',
    cpu: '256'
  });
  const [config, setConfig] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available services and configuration options
    const fetchData = async () => {
      try {
        const [servicesRes, optionsRes] = await Promise.all([
          fetch('http://localhost:3001/services'),
          fetch('http://localhost:3001/config-options')
        ]);
        const servicesData = await servicesRes.json();
        const optionsData = await optionsRes.json();
        
        setServices(servicesData.services);
        setConfigOptions(optionsData);
      } catch (err) {
        setError('Failed to load configuration options');
      }
    };
    fetchData();
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData(prev => ({ ...prev, serviceType: service.id }));
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/generate-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate configuration');
      }

      setConfig(data.config);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([config], { type: 'text/yaml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.appName}-${formData.serviceType}-config.yaml`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const renderServiceSelection = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => handleServiceSelect(service)}
          className="p-6 border rounded-lg hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <h3 className="text-lg font-medium">{service.name}</h3>
          <p className="mt-2 text-sm text-gray-500">{service.description}</p>
        </button>
      ))}
    </div>
  );

  const renderServiceConfig = () => {
    if (!selectedService) return null;

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Application Name</label>
          <input
            type="text"
            name="appName"
            value={formData.appName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Region</option>
            {configOptions?.regions.map(region => (
              <option key={region.value} value={region.value}>{region.label}</option>
            ))}
          </select>
        </div>

        {selectedService.id === 'ec2' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instance Type Category</label>
              <select
                name="instanceTypeCategory"
                onChange={(e) => {
                  const category = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    instanceType: configOptions.instanceTypes[category]?.[0] || ''
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {Object.keys(configOptions?.instanceTypes || {}).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instance Type</label>
              <select
                name="instanceType"
                value={formData.instanceType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Instance Type</option>
                {Object.values(configOptions?.instanceTypes || {})
                  .flat()
                  .map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
              </select>
            </div>
          </>
        )}

        {selectedService.id === 'lambda' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Runtime</label>
              <select
                name="runtime"
                value={formData.runtime}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Runtime</option>
                {configOptions?.lambdaRuntimes.map(runtime => (
                  <option key={runtime} value={runtime}>{runtime}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Memory (MB)</label>
              <input
                type="number"
                name="memory"
                value={formData.memory}
                onChange={handleInputChange}
                min="128"
                max="10240"
                step="64"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timeout (seconds)</label>
              <input
                type="number"
                name="timeout"
                value={formData.timeout}
                onChange={handleInputChange}
                min="1"
                max="900"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {selectedService.id === 'ecs' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Launch Type</label>
              <select
                name="launchType"
                value={formData.launchType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Launch Type</option>
                {configOptions?.ecsLaunchTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Container Image</label>
              <input
                type="text"
                name="containerImage"
                value={formData.containerImage}
                onChange={handleInputChange}
                placeholder="nginx:latest"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            {loading ? 'Generating...' : 'Generate Configuration'}
          </button>
        </div>
      </form>
    );
  };

  const renderResult = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated Configuration</h3>
        <div className="space-x-4">
          <button
            onClick={() => setStep(2)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        {config}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8">Cloud Configuration Generator</h2>
                
                {error && (
                  <div className="mb-4 text-red-600">
                    {error}
                  </div>
                )}

                {step === 1 && renderServiceSelection()}
                {step === 2 && renderServiceConfig()}
                {step === 3 && renderResult()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;