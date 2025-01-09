import React from 'react';

const IAMPolicyGenerator = ({ config }) => {
  const generateServicePolicies = () => {
    const policies = {
      'iam/service-roles.tf': `
# Common IAM role for EC2 instances
resource "aws_iam_role" "ec2_role" {
  name = "${config.projectName}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# EC2 instance profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${config.projectName}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}`,
      'iam/policies.tf': generatePolicies(config),
      'iam/README.md': `
# IAM Roles and Policies

This directory contains IAM roles and policies for the ${config.projectName} infrastructure.

## Included Resources

${generatePolicyList(config)}

## Security Notes

- Follow the principle of least privilege
- Regularly review and audit permissions
- Use AWS Organizations for multi-account setups
- Enable MFA for all IAM users
`
    };

    return policies;
  };

  const generatePolicies = (config) => {
    let policies = '';

    if (config.useS3) {
      policies += `
# S3 access policy
resource "aws_iam_role_policy" "s3_access" {
  name = "${config.projectName}-s3-access"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${config.projectName}-*",
          "arn:aws:s3:::${config.projectName}-*/*"
        ]
      }
    ]
  })
}`;
    }

    if (config.useRDS) {
      policies += `
# RDS access policy
resource "aws_iam_role_policy" "rds_access" {
  name = "${config.projectName}-rds-access"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "rds:Describe*",
          "rds:ListTagsForResource"
        ]
        Resource = "*"
      }
    ]
  })
}`;
    }

    if (config.useCloudWatch) {
      policies += `
# CloudWatch access policy
resource "aws_iam_role_policy" "cloudwatch_access" {
  name = "${config.projectName}-cloudwatch-access"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudwatch:PutMetricData",
          "cloudwatch:GetMetricStatistics",
          "cloudwatch:ListMetrics"
        ]
        Resource = "*"
      }
    ]
  })
}`;
    }

    return policies;
  };

  const generatePolicyList = (config) => {
    const policies = [];
    policies.push('- Base EC2 instance role and profile');
    
    if (config.useS3) policies.push('- S3 bucket access policy');
    if (config.useRDS) policies.push('- RDS access policy');
    if (config.useCloudWatch) policies.push('- CloudWatch metrics policy');
    
    return policies.join('\n');
  };

  const renderPolicyDownload = (policies) => {
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
          {Object.entries(generateServicePolicies()).map(([filename, content]) => (
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
        <h3 className="text-lg font-medium">IAM Roles and Policies</h3>
        <p className="mt-2 text-sm text-gray-500">
          Download the generated IAM roles and policies for your infrastructure.
        </p>
        {renderPolicyDownload()}
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
              Review all IAM policies carefully before applying them. Always follow the principle of least privilege.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IAMPolicyGenerator;