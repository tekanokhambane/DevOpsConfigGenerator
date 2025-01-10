/**
 * Generates an AWS CloudFormation template for deploying an EC2 instance.
 *
 * @param {string} appName - The name of the application to be deployed.
 * @param {string} region - The AWS region where the EC2 instance will be deployed.
 * @param {string} instanceType - The type of EC2 instance to be used.
 * @returns {Object} The CloudFormation template as a JavaScript object.
 */
const generateTemplate = (appName, region, instanceType) => {
	return {
		AWSTemplateFormatVersion: '2010-09-09',
		Description: `EC2 instance deployment for ${appName}`,
		Parameters: {
			InstanceType: {
				Type: 'String',
				Default: instanceType,
				Description: 'EC2 instance type'
			}
		},
		Resources: {
			EC2Instance: {
				Type: 'AWS::EC2::Instance',
				Properties: {
					InstanceType: { Ref: 'InstanceType' },
					ImageId: getAMIForRegion(region),
					Tags: [
						{
							Key: 'Name',
							Value: appName
						}
					]
				}
			}
		}
	};
};

/**
 * Retrieves the Amazon Machine Image (AMI) ID for a given AWS region.
 *
 * @param {string} region - The AWS region code (e.g., 'us-east-1', 'eu-west-1').
 * @returns {string} The AMI ID corresponding to the specified region. If the region is not found, returns the default AMI ID for 'us-east-1'.
 */
const getAMIForRegion = (region) => {
	// Simplified AMI mapping - in production, you'd want to maintain a complete mapping
	const amiMap = {
		'us-east-1': 'ami-0c55b159cbfafe1f0',
		'eu-west-1': 'ami-0a8e758f5e873d1c1'
	};
	return amiMap[region] || amiMap['us-east-1'];
};

module.exports = { generateTemplate };