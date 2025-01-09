const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const YAML = require('yaml');
const { AWS_REGIONS, EC2_INSTANCE_TYPES, LAMBDA_RUNTIMES, ECS_LAUNCH_TYPES, SERVICES } = require('./templates/aws-config');
const { generateEC2Template, generateLambdaTemplate, generateECSTemplate } = require('./templates/template-generator');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/services', (req, res) => {
	res.json({ services: SERVICES });
});

app.get('/config-options', (req, res) => {
	res.json({
		regions: AWS_REGIONS,
		instanceTypes: EC2_INSTANCE_TYPES,
		lambdaRuntimes: LAMBDA_RUNTIMES,
		ecsLaunchTypes: ECS_LAUNCH_TYPES
	});
});

const validateConfig = (config) => {
	const { serviceType, appName } = config;
	
	if (!serviceType || !appName) {
		throw new Error('Missing required fields: serviceType and appName');
	}

	switch (serviceType) {
		case 'ec2':
			if (!config.instanceType || !config.region) {
				throw new Error('EC2 requires instanceType and region');
			}
			break;
		case 'lambda':
			if (!config.runtime) {
				throw new Error('Lambda requires runtime');
			}
			break;
		case 'ecs':
			if (!config.launchType) {
				throw new Error('ECS requires launchType');
			}
			break;
		default:
			throw new Error('Invalid service type');
	}
};

app.post('/generate-config', (req, res) => {
	try {
		const config = req.body;
		validateConfig(config);

		let template;
		switch (config.serviceType) {
			case 'ec2':
				template = generateEC2Template(config);
				break;
			case 'lambda':
				template = generateLambdaTemplate(config);
				break;
			case 'ecs':
				template = generateECSTemplate(config);
				break;
			default:
				throw new Error('Unsupported service type');
		}

		const yamlConfig = YAML.stringify(template);
		
		res.json({
			success: true,
			config: yamlConfig,
			json: template
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message
		});
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});