# Mailgun-Notification-app

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- hello-world - Code for the application's Lambda function written in TypeScript. 
- template.yaml - A template that defines the application's AWS resources.
- samconfig.toml - A file which was created while writing configuration during sam deploy --guided. Make sure you configure your own samconfig.toml file.
- node_modules - A folder that was install with npm install command in cmd.

## Important Configurations

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

The **S3 Bucket** name is configured in `template.yaml` file. However it should also be updated in `constants.ts` file which can be found in `hello-world` folder.

The **Signing Key** for Mailgun is configured in `constants.ts`. please make sure to configure the right key.

Aws **ACCESS KEY** and Aws **SECRET ACCESS KEY** was configured in `credientials` file which was placed at C:/Users/{username}/.aws.


## Prerequisite Installation

- AWS SAM CLI version 1.60.0
- Nodejs
- NPM
- Docker

## Build & Deployment 

- To build the code type **sam build** in cmd
- To deploy type **sam deploy** (sam-deploy --guided for the first time)


## Lambda functionality

- The lambda function is written in typescript that builds into js.
- Appropriate typing has been achieved as much as possible.
- The lambda function is designed in a way that it gets triggers from API Gateway.
- It validates the event 
- It stores the raw webhook event in S3Bucket as .json
- It creates and notify SNS Topic
- Subscription for SNS Topic should be added from console. **Lambda function does not create subscription**  

