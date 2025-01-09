import React from 'react';

const DeploymentInstructions = ({ config }) => {
  const generateSetupInstructions = () => {
    const instructions = [
      '# AWS Infrastructure Setup Instructions',
      '',
      '## Prerequisites',
      '1. Install required tools:',
      '```bash',
      'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash  # Install NVM',
      'nvm install 16  # Install Node.js',
      'npm install -g aws-cdk  # Install AWS CDK',
      'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"',
      'unzip awscliv2.zip',
      'sudo ./aws/install',
      'curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -',
      'sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"',
      'sudo apt-get update && sudo apt-get install terraform',
      '```',
      '',
      '## Configuration Steps',
      '',
      '1. Configure AWS CLI:',
      '```bash',
      'aws configure',
      '# Enter your AWS Access Key ID',
      '# Enter your AWS Secret Access Key',
      '# Enter default region name',
      '# Enter default output format',
      '```',
      '',
      '2. Initialize Terraform:',
      '```bash',
      'cd infrastructure',
      'terraform init',
      '```',
      '',
      '3. Deploy Infrastructure:',
      '```bash',
      'terraform plan    # Review the changes',
      'terraform apply   # Apply the changes',
      '```',
      '',
      '## Service-Specific Setup',
    ];

    if (config.useEC2) {
      instructions.push(
        '',
        '### EC2 Setup',
        '```bash',
        'aws ec2 describe-instances --filters "Name=tag:Project,Values=' + config.projectName + '"',
        '```'
      );
    }

    if (config.useRDS) {
      instructions.push(
        '',
        '### RDS Setup',
        '```bash',
        'aws rds describe-db-instances --query "DBInstances[*].Endpoint.Address"',
        '```'
      );
    }

    if (config.useS3) {
      instructions.push(
        '',
        '### S3 Setup',
        '```bash',
        'aws s3 ls s3://' + config.projectName + '-*',
        '```'
      );
    }

    instructions.push(
      '',
      '## Verification Steps',
      '',
      '1. Check VPC Status:',
      '```bash',
      'aws ec2 describe-vpcs --filters "Name=tag:Project,Values=' + config.projectName + '"',
      '```',
      '',
      '2. Check Security Groups:',
      '```bash',
      'aws ec2 describe-security-groups --filters "Name=vpc-id,Values=${vpc_id}"',
      '```',
      '',
      '## Cleanup Instructions',
      '',
      'To destroy the infrastructure:',
      '```bash',
      'terraform destroy',
      '```',
      '',
      '## Monitoring Setup',
      '',
      '1. View CloudWatch Metrics:',
      '```bash',
      'aws cloudwatch list-metrics --namespace "AWS/EC2"',
      '```',
      '',
      '2. Check CloudWatch Logs:',
      '```bash',
      'aws logs describe-log-groups',
      '```'
    );

    return instructions.join('\n');
  };

  const downloadInstructions = () => {
    const content = generateSetupInstructions();
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deployment-instructions.md';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Deployment Instructions</h3>
        <button
          onClick={downloadInstructions}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download Instructions
        </button>
      </div>

      <div className="prose prose-sm max-w-none">
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          {generateSetupInstructions()}
        </pre>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              These instructions include all necessary steps to deploy your infrastructure.
              Make sure to follow them in order and verify each step before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentInstructions;