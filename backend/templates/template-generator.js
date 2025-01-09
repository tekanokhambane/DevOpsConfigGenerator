const generateEC2Template = (config) => ({
	AWSTemplateFormatVersion: '2010-09-09',
	Description: `EC2 instance deployment for ${config.appName}`,
	Parameters: {
		InstanceType: {
			Type: 'String',
			Default: config.instanceType
		},
		VolumeSize: {
			Type: 'Number',
			Default: config.volumeSize || 8
		}
	},
	Resources: {
		EC2Instance: {
			Type: 'AWS::EC2::Instance',
			Properties: {
				InstanceType: { Ref: 'InstanceType' },
				ImageId: getAMIForRegion(config.region),
				BlockDeviceMappings: [{
					DeviceName: '/dev/xvda',
					Ebs: {
						VolumeSize: { Ref: 'VolumeSize' }
					}
				}]
			}
		}
	}
});

const generateLambdaTemplate = (config) => ({
	AWSTemplateFormatVersion: '2010-09-09',
	Description: `Lambda function deployment for ${config.appName}`,
	Resources: {
		LambdaFunction: {
			Type: 'AWS::Lambda::Function',
			Properties: {
				FunctionName: config.appName,
				Handler: config.handler || 'index.handler',
				Role: { 'Fn::GetAtt': ['LambdaExecutionRole', 'Arn'] },
				Code: {
					ZipFile: 'exports.handler = async (event) => { return { statusCode: 200, body: "Hello from Lambda!" }; }'
				},
				Runtime: config.runtime,
				Timeout: config.timeout || 3,
				MemorySize: config.memory || 128
			}
		},
		LambdaExecutionRole: {
			Type: 'AWS::IAM::Role',
			Properties: {
				AssumeRolePolicyDocument: {
					Version: '2012-10-17',
					Statement: [{
						Effect: 'Allow',
						Principal: { Service: ['lambda.amazonaws.com'] },
						Action: ['sts:AssumeRole']
					}]
				},
				ManagedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']
			}
		}
	}
});

const generateECSTemplate = (config) => ({
	AWSTemplateFormatVersion: '2010-09-09',
	Description: `ECS cluster deployment for ${config.appName}`,
	Resources: {
		ECSCluster: {
			Type: 'AWS::ECS::Cluster',
			Properties: {
				ClusterName: config.appName
			}
		},
		ECSTaskDefinition: {
			Type: 'AWS::ECS::TaskDefinition',
			Properties: {
				Family: `${config.appName}-task`,
				RequiresCompatibilities: [config.launchType],
				NetworkMode: 'awsvpc',
				Cpu: config.cpu || '256',
				Memory: config.memory || '512',
				ContainerDefinitions: [{
					Name: config.appName,
					Image: config.containerImage || 'nginx:latest',
					PortMappings: [{
						ContainerPort: 80,
						Protocol: 'tcp'
					}]
				}]
			}
		}
	}
});

const getAMIForRegion = (region) => {
	const amiMap = {
		'us-east-1': 'ami-0c55b159cbfafe1f0',
		'us-east-2': 'ami-0568773882d492fc8',
		'us-west-1': 'ami-0d382e80be7ffdae5',
		'us-west-2': 'ami-0735c191cf914754d'
	};
	return amiMap[region] || amiMap['us-east-1'];
};

module.exports = {
	generateEC2Template,
	generateLambdaTemplate,
	generateECSTemplate
};