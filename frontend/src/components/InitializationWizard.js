import React, { useState } from 'react';

const INITIALIZATION_STEPS = [
  {
    id: 'project-basics',
    title: 'Project Basics',
    fields: [
      { name: 'projectName', label: 'Project Name', type: 'text', required: true },
      { name: 'environment', label: 'Environment', type: 'select', options: ['development', 'staging', 'production'], required: true },
      { name: 'organization', label: 'Organization Name', type: 'text', required: true },
      { name: 'awsAccountId', label: 'AWS Account ID', type: 'text', required: true }
    ]
  },
  {
    id: 'networking',
    title: 'Networking Configuration',
    fields: [
      { name: 'vpcCidr', label: 'VPC CIDR Block', type: 'text', placeholder: '10.0.0.0/16', required: true },
      { name: 'availabilityZones', label: 'Number of Availability Zones', type: 'number', min: 1, max: 3, required: true },
      { name: 'privateSubnets', label: 'Include Private Subnets', type: 'checkbox' },
      { name: 'publicSubnets', label: 'Include Public Subnets', type: 'checkbox' },
      { name: 'natGateways', label: 'Include NAT Gateways', type: 'checkbox' }
    ]
  },
  {
    id: 'compute',
    title: 'Compute Services',
    fields: [
      { name: 'useEC2', label: 'EC2 Instances', type: 'checkbox' },
      { name: 'useECS', label: 'Container Services (ECS)', type: 'checkbox' },
      { name: 'useEKS', label: 'Kubernetes (EKS)', type: 'checkbox' },
      { name: 'useLambda', label: 'Serverless Functions', type: 'checkbox' },
      { name: 'useAutoScaling', label: 'Auto Scaling', type: 'checkbox' }
    ]
  },
  {
    id: 'loadbalancing',
    title: 'Load Balancing & DNS',
    fields: [
      { name: 'useALB', label: 'Application Load Balancer', type: 'checkbox' },
      { name: 'useNLB', label: 'Network Load Balancer', type: 'checkbox' },
      { name: 'useRoute53', label: 'Route 53 DNS', type: 'checkbox' },
      { name: 'useCloudFront', label: 'CloudFront CDN', type: 'checkbox' },
      { name: 'useACM', label: 'Certificate Manager (ACM)', type: 'checkbox' }
    ]
  },
  {
    id: 'storage',
    title: 'Storage Services',
    fields: [
      { name: 'useS3', label: 'S3 Buckets', type: 'checkbox' },
      { name: 'useRDS', label: 'RDS Database', type: 'checkbox' },
      { name: 'useDynamoDB', label: 'DynamoDB', type: 'checkbox' },
      { name: 'useElastiCache', label: 'ElastiCache', type: 'checkbox' },
      { name: 'useEFS', label: 'Elastic File System', type: 'checkbox' }
    ]
  },
  {
    id: 'security',
    title: 'Security & Monitoring',
    fields: [
      { name: 'useWAF', label: 'Web Application Firewall', type: 'checkbox' },
      { name: 'useGuardDuty', label: 'GuardDuty', type: 'checkbox' },
      { name: 'useCloudTrail', label: 'CloudTrail', type: 'checkbox' },
      { name: 'useCloudWatch', label: 'CloudWatch', type: 'checkbox' },
      { name: 'useKMS', label: 'KMS Encryption', type: 'checkbox' }
    ]
  },
  {
    id: 'additional',
    title: 'Additional Services',
    fields: [
      { name: 'useSQS', label: 'Simple Queue Service (SQS)', type: 'checkbox' },
      { name: 'useSNS', label: 'Simple Notification Service (SNS)', type: 'checkbox' },
      { name: 'useCognito', label: 'Cognito User Pools', type: 'checkbox' },
      { name: 'useSecretsManager', label: 'Secrets Manager', type: 'checkbox' },
      { name: 'useCodePipeline', label: 'CodePipeline (CI/CD)', type: 'checkbox' }
    ]
  }
];

function InitializationWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = () => {
    const currentFields = INITIALIZATION_STEPS[currentStep].fields;
    const newErrors = {};
    
    currentFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === INITIALIZATION_STEPS.length - 1) {
        onComplete(formData);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        );
    }
  };

  const currentStepData = INITIALIZATION_STEPS[currentStep];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
        <p className="text-sm text-gray-500">Step {currentStep + 1} of {INITIALIZATION_STEPS.length}</p>
      </div>

      <div className="space-y-4">
        {currentStepData.fields.map(field => (
          <div key={field.name} className={field.type === 'checkbox' ? 'flex items-center space-x-3' : ''}>
            <label className={`block text-sm font-medium text-gray-700 ${field.type === 'checkbox' ? 'order-2' : ''}`}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className={field.type === 'checkbox' ? 'order-1' : ''}>
              {renderField(field)}
            </div>
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="ml-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {currentStep === INITIALIZATION_STEPS.length - 1 ? 'Generate Infrastructure' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default InitializationWizard;