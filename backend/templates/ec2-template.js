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

const getAMIForRegion = (region) => {
	// Simplified AMI mapping - in production, you'd want to maintain a complete mapping
	const amiMap = {
		'us-east-1': 'ami-0c55b159cbfafe1f0',
		'eu-west-1': 'ami-0a8e758f5e873d1c1'
	};
	return amiMap[region] || amiMap['us-east-1'];
};

module.exports = { generateTemplate };