# Cloudformation templates

## Before Deploy
- Configure AWS CLI
- Create an AWS KMS Key
- Create a Certificate in AWS Certificate Manager
- Create a EC2 KeyPair

## Deploy

aws cloudformation package --template-file root-stack.yml --output-template packed-nested-stacks.yml --s3-bucket ibexcm-templates --profile <PROFILE NAME>

aws cloudformation deploy --template-file <RESULT PREVIOUS COMMAND> --stack-name <YOUR STACK NAME> --profile <PROFILE NAME>

## After Deploy
- Build and upload your prisma image to ECR
- Create a RDS database and modify ENDPOINT in Route 53. Select the correct Security Group.
- KMS
    - test-prisma-taskrole
    - test-webclient
    - test-adminclient
    - test-graphql
- Run prisma deploy and seed. 
    - Create SSH Tunnel
    - Install yarn and node
    - Start Prisma ECS Service
    - Exec

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

    Restart prisma service

- Run CICD Pipelines (Create a PR)
- Enable Graphservice

## TODO
- Pruebas Graphql
- Ultima AMI
- Creacion DB