import React from 'react';

const ServiceSelector = ({ onServiceSelect }) => {
  const services = [
    {
      id: 'compute',
      name: 'Compute Services',
      options: [
        { id: 'ec2', name: 'EC2', description: 'Virtual servers in the cloud' },
        { id: 'lambda', name: 'Lambda', description: 'Serverless functions' },
        { id: 'ecs', name: 'ECS', description: 'Container orchestration' },
        { id: 'eks', name: 'EKS', description: 'Managed Kubernetes' }
      ]
    },
    {
      id: 'storage',
      name: 'Storage Services',
      options: [
        { id: 's3', name: 'S3', description: 'Object storage' },
        { id: 'rds', name: 'RDS', description: 'Relational databases' },
        { id: 'dynamodb', name: 'DynamoDB', description: 'NoSQL database' },
        { id: 'elasticache', name: 'ElastiCache', description: 'In-memory caching' }
      ]
    },
    {
      id: 'networking',
      name: 'Networking & CDN',
      options: [
        { id: 'vpc', name: 'VPC', description: 'Virtual Private Cloud' },
        { id: 'alb', name: 'Application Load Balancer', description: 'HTTP/HTTPS load balancing' },
        { id: 'cloudfront', name: 'CloudFront', description: 'Content delivery network' },
        { id: 'route53', name: 'Route 53', description: 'DNS service' }
      ]
    },
    {
      id: 'security',
      name: 'Security & Identity',
      options: [
        { id: 'iam', name: 'IAM', description: 'Identity and access management' },
        { id: 'acm', name: 'Certificate Manager', description: 'SSL/TLS certificates' },
        { id: 'waf', name: 'WAF', description: 'Web Application Firewall' },
        { id: 'secrets', name: 'Secrets Manager', description: 'Secrets management' }
      ]
    },
    {
      id: 'monitoring',
      name: 'Monitoring & Logging',
      options: [
        { id: 'cloudwatch', name: 'CloudWatch', description: 'Monitoring and observability' },
        { id: 'cloudtrail', name: 'CloudTrail', description: 'API activity tracking' },
        { id: 'xray', name: 'X-Ray', description: 'Application tracing' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {services.map(category => (
        <div key={category.id} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {category.options.map(service => (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service)}
                className="relative flex items-start p-4 border rounded-lg hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {service.name}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {service.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelector;