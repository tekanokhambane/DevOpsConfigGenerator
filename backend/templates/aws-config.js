const AWS_REGIONS = [
	{ value: 'us-east-1', label: 'US East (N. Virginia)' },
	{ value: 'us-east-2', label: 'US East (Ohio)' },
	{ value: 'us-west-1', label: 'US West (N. California)' },
	{ value: 'us-west-2', label: 'US West (Oregon)' },
	{ value: 'af-south-1', label: 'Africa (Cape Town)' },
	{ value: 'ap-east-1', label: 'Asia Pacific (Hong Kong)' },
	{ value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
	{ value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
	{ value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
	{ value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
	{ value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
	{ value: 'ca-central-1', label: 'Canada (Central)' },
	{ value: 'eu-central-1', label: 'Europe (Frankfurt)' },
	{ value: 'eu-west-1', label: 'Europe (Ireland)' },
	{ value: 'eu-west-2', label: 'Europe (London)' },
	{ value: 'eu-west-3', label: 'Europe (Paris)' },
	{ value: 'eu-north-1', label: 'Europe (Stockholm)' },
	{ value: 'sa-east-1', label: 'South America (São Paulo)' }
];

const EC2_INSTANCE_TYPES = {
	'General Purpose': [
		't2.micro', 't2.small', 't2.medium', 't2.large',
		't3.micro', 't3.small', 't3.medium', 't3.large',
		'm5.large', 'm5.xlarge', 'm5.2xlarge'
	],
	'Compute Optimized': [
		'c5.large', 'c5.xlarge', 'c5.2xlarge',
		'c6g.large', 'c6g.xlarge', 'c6g.2xlarge'
	],
	'Memory Optimized': [
		'r5.large', 'r5.xlarge', 'r5.2xlarge',
		'r6g.large', 'r6g.xlarge', 'r6g.2xlarge'
	]
};

const LAMBDA_RUNTIMES = [
	'nodejs18.x', 'nodejs16.x', 'python3.9', 'python3.8',
	'java11', 'java8', 'dotnet6', 'go1.x', 'ruby2.7'
];

const ECS_LAUNCH_TYPES = ['FARGATE', 'EC2'];

const SERVICES = [
	{
		id: 'ec2',
		name: 'EC2',
		description: 'Virtual servers in the cloud',
		configOptions: ['instance-type', 'region', 'volume-size']
	},
	{
		id: 'lambda',
		name: 'Lambda',
		description: 'Run code without thinking about servers',
		configOptions: ['runtime', 'memory', 'timeout']
	},
	{
		id: 'ecs',
		name: 'ECS',
		description: 'Run containerized applications',
		configOptions: ['launch-type', 'container-config', 'task-size']
	}
];

module.exports = {
	AWS_REGIONS,
	EC2_INSTANCE_TYPES,
	LAMBDA_RUNTIMES,
	ECS_LAUNCH_TYPES,
	SERVICES
};