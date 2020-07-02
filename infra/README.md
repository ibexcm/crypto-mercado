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
- Run prisma deploy and seed. 
- Run CICD Pipelines (Create a PR)