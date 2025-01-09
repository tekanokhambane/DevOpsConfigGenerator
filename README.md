# Cloud Configuration Generator

A full-stack web application that generates deployment configuration files for cloud providers.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Project Structure

```
project-root/
├── backend/         # Express.js server
├── frontend/        # React.js application
└── README.md
```

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The backend will run on http://localhost:3001

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

## Usage

1. Fill in the form with your desired configuration:
   - Application Name
   - Cloud Region
   - Instance Type

2. Click "Generate Configuration" to create your configuration file

3. Use the "Download" button to download the configuration as a YAML file

## Features

- Generate AWS CloudFormation templates for EC2 instances
- Support for multiple regions and instance types
- Download configurations as YAML files
- Input validation
- Error handling