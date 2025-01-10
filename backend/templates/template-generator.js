/**
 * Generates an AWS CloudFormation template for deploying an EC2 instance.
 *
 * @param {Object} config - Configuration object for the EC2 instance.
 * @param {string} config.appName - The name of the application.
 * @param {string} config.instanceType - The type of the EC2 instance (e.g., t2.micro).
 * @param {number} [config.volumeSize=8] - The size of the EBS volume in GB. Defaults to 8 if not provided.
 * @param {string} config.region - The AWS region where the EC2 instance will be deployed.
 * @returns {Object} - The CloudFormation template as a JavaScript object.
 */
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

/**
 * Generates an AWS CloudFormation template for deploying a Lambda function.
 *
 * @param {Object} config - Configuration object for the Lambda function.
 * @param {string} config.appName - The name of the Lambda function.
 * @param {string} [config.handler='index.handler'] - The handler for the Lambda function.
 * @param {string} config.runtime - The runtime environment for the Lambda function (e.g., 'nodejs14.x').
 * @param {number} [config.timeout=3] - The timeout duration for the Lambda function in seconds.
 * @param {number} [config.memory=128] - The memory size for the Lambda function in MB.
 * @returns {Object} The CloudFormation template for the Lambda function.
 */
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

/**
 * Generates an AWS CloudFormation template for deploying an ECS cluster.
 *
 * @param {Object} config - Configuration object for the ECS deployment.
 * @param {string} config.appName - The name of the application.
 * @param {string} config.launchType - The launch type for the ECS task (e.g., 'EC2', 'FARGATE').
 * @param {string} [config.cpu='256'] - The number of CPU units used by the task.
 * @param {string} [config.memory='512'] - The amount of memory (in MiB) used by the task.
 * @param {string} [config.containerImage='nginx:latest'] - The Docker image to use for the container.
 * @returns {Object} The AWS CloudFormation template for the ECS cluster deployment.
 */
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

/**
 * Retrieves the Amazon Machine Image (AMI) ID for a given AWS region.
 *
 * @param {string} region - The AWS region code (e.g., 'us-east-1', 'us-west-2').
 * @returns {string} The AMI ID corresponding to the specified region. If the region is not found, returns the AMI ID for 'us-east-1'.
 */
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