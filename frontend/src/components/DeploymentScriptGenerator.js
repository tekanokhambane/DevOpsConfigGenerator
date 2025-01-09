import React from 'react';

const DeploymentScriptGenerator = ({ config }) => {
  const generateTerraformScript = () => {
    const scripts = {
      'main.tf': `
provider "aws" {
  region = "${config.region}"
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block = "${config.vpcCidr}"
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "${config.projectName}-vpc"
    Environment = "${config.environment}"
  }
}`,
      'variables.tf': `
variable "project_name" {
  description = "Name of the project"
  default     = "${config.projectName}"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  default     = "${config.environment}"
}`,
      'outputs.tf': `
output "vpc_id" {
  value = aws_vpc.main.id
}`,
      'README.md': `
# ${config.projectName} Infrastructure

## Prerequisites
- Terraform v1.0+
- AWS CLI configured
- AWS Account with appropriate permissions

## Deployment Steps
1. Initialize Terraform:
   \`\`\`bash
   terraform init
   \`\`\`

2. Review the plan:
   \`\`\`bash
   terraform plan
   \`\`\`

3. Apply the configuration:
   \`\`\`bash
   terraform apply
   \`\`\`

## Infrastructure Components
${Object.entries(config)
  .filter(([key]) => key.startsWith('use') && config[key])
  .map(([key]) => `- ${key.replace('use', '')}`)
  .join('\n')}
`
    };

    return scripts;
  };

  const generateAWSCLICommands = () => {
    const commands = [
      '# Configure AWS CLI',
      'aws configure',
      '',
      '# Create VPC',
      `aws ec2 create-vpc --cidr-block ${config.vpcCidr} --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=${config.projectName}-vpc}]'`,
    ];

    if (config.useEC2) {
      commands.push(
        '',
        '# Launch EC2 Instance',
        `aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type ${config.ec2InstanceType} --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=${config.projectName}-instance}]'`
      );
    }

    return commands.join('\n');
  };

  const renderScriptDownload = (scripts) => {
    const downloadFile = (content, filename) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          {Object.entries(scripts).map(([filename, content]) => (
            <button
              key={filename}
              onClick={() => downloadFile(content, filename)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Download {filename}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Terraform Configuration</h3>
        {renderScriptDownload(generateTerraformScript())}
      </div>
      
      <div>
        <h3 className="text-lg font-medium">AWS CLI Commands</h3>
        <pre className="mt-2 p-4 bg-gray-800 text-white rounded-md overflow-x-auto">
          {generateAWSCLICommands()}
        </pre>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Remember to review all generated configurations before deploying to production.
              Make sure to have appropriate AWS credentials and permissions configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentScriptGenerator;