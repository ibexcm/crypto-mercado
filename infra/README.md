# Cloudformation templates

## Before Install
- Configure AWS CLI
- Create an AWS KMS Key
- Create a Certificate in AWS Certificate Manager
- Create a EC2 KeyPair

## Install

aws cloudformation package --template-file root-stack.yml --output-template packed-nested-stacks.yml --s3-bucket ibexcm-templates --profile <PROFILE NAME>

aws cloudformation deploy --template-file <RESULT PREVIOUS COMMAND> --stack-name <YOUR STACK NAME> --profile <PROFILE NAME>

## After Install
- Upload pisma image to ECR
- Create a RDS database
- Run prisma deploy and seed. 
- Run CICD Pipelines (Create a PR)