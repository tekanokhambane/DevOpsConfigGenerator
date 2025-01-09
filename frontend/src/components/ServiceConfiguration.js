import React from 'react';

const ServiceConfiguration = ({ service, formData, onChange }) => {
  const renderEC2Config = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">EC2 Configuration</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Instance Type</label>
        <select
          name="ec2InstanceType"
          value={formData.ec2InstanceType || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Instance Type</option>
          <option value="t2.micro">t2.micro (1 vCPU, 1 GiB RAM)</option>
          <option value="t2.small">t2.small (1 vCPU, 2 GiB RAM)</option>
          <option value="t2.medium">t2.medium (2 vCPU, 4 GiB RAM)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Volume Size (GB)</label>
        <input
          type="number"
          name="ec2VolumeSize"
          value={formData.ec2VolumeSize || 8}
          onChange={onChange}
          min="8"
          max="16384"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="ec2EnableAutoScaling"
            checked={formData.ec2EnableAutoScaling || false}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Auto Scaling</span>
        </label>
      </div>
    </div>
  );

  const renderRDSConfig = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">RDS Configuration</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Database Engine</label>
        <select
          name="rdsEngine"
          value={formData.rdsEngine || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Database Engine</option>
          <option value="mysql">MySQL</option>
          <option value="postgres">PostgreSQL</option>
          <option value="aurora">Aurora</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Instance Class</label>
        <select
          name="rdsInstanceClass"
          value={formData.rdsInstanceClass || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Instance Class</option>
          <option value="db.t3.micro">db.t3.micro</option>
          <option value="db.t3.small">db.t3.small</option>
          <option value="db.t3.medium">db.t3.medium</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="rdsMultiAZ"
            checked={formData.rdsMultiAZ || false}
            onChange={onChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Multi-AZ Deployment</span>
        </label>
      </div>
    </div>
  );

  const renderLambdaConfig = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Lambda Configuration</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Runtime</label>
        <select
          name="lambdaRuntime"
          value={formData.lambdaRuntime || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Runtime</option>
          <option value="nodejs18.x">Node.js 18.x</option>
          <option value="python3.9">Python 3.9</option>
          <option value="java11">Java 11</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Memory (MB)</label>
        <input
          type="number"
          name="lambdaMemory"
          value={formData.lambdaMemory || 128}
          onChange={onChange}
          min="128"
          max="10240"
          step="64"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );

  const renderECSConfig = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">ECS Configuration</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Launch Type</label>
        <select
          name="ecsLaunchType"
          value={formData.ecsLaunchType || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select Launch Type</option>
          <option value="FARGATE">AWS Fargate</option>
          <option value="EC2">EC2</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Task CPU Units</label>
        <select
          name="ecsTaskCpu"
          value={formData.ecsTaskCpu || ''}
          onChange={onChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select CPU Units</option>
          <option value="256">0.25 vCPU</option>
          <option value="512">0.5 vCPU</option>
          <option value="1024">1 vCPU</option>
        </select>
      </div>
    </div>
  );

  const renderServiceConfig = () => {
    switch (service) {
      case 'ec2':
        return renderEC2Config();
      case 'rds':
        return renderRDSConfig();
      case 'lambda':
        return renderLambdaConfig();
      case 'ecs':
        return renderECSConfig();
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {renderServiceConfig()}
    </div>
  );
};

export default ServiceConfiguration;