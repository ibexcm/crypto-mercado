# Cloudformation templates

## Before Deploy

- Configure AWS CLI
- Create an AWS KMS Key
- Create a Certificate in AWS Certificate Manager
- Create a EC2 KeyPair
- Configure Github personal access token. 
    https://docs.aws.amazon.com/codepipeline/latest/userguide/GitHub-create-personal-token-CLI.html

## Deployment

### Root stack

aws cloudformation package --template-file root-stack.yml --output-template packed-nested-stacks.yml --s3-bucket ibexcm-templates

### Aurora database stack

Upload aurora-database-stack.yml to cloudformation, fill in the required params and create.

Next `cd database/Docker` and execute the following commands to push the image to ECR:

```
docker build -t ibex/prisma:1.34 -f Dockerfile .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
docker tag ibex/prisma:1.34 <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/<STACK_ENVIRONMENT_TAG>/ibex/prisma:1.34
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/<STACK_ENVIRONMENT_TAG>/ibex/prisma:1.34
```

## After Deploy

- Build and upload your prisma image to ECR
- Create Database using aurora-database-stack.yml
- Modify KMS Key and add the following roles.
  - test-prisma-taskrole
  - test-webclient
  - test-adminclient
  - test-graphql
- Run prisma deploy.
  - Start Prisma ECS Service
  - Execute prisma deploy.
  - Restart prisma ECS service

```
yarn
yarn bootstrap
npm i -g prisma
npm i -g ts-node
npm i -g typescript
cd database/
export NODE_PATH=$(npm root --quiet -g)
export PRISMA_ENDPOINT="http://prisma.test.ibexcm.internal"
export PRISMA_SECRET='###'
export PRISMA_MANAGEMENT_API_SECRET='###'
prisma deploy
```

- Run CICD Pipelines (Create a PR)
- Enable Graphservice
- Update DNS Records for API, webclient y adminclient
