# Cloudformation templates

aws cloudformation package --template-file root-stack.yml --output-template packed-nested-stacks.yml --s3-bucket ibexcm-templates --profile <PROFILE NAME>

aws cloudformation deploy --template-file <RESULT PREVIOUS COMMAND> --stack-name <YOUR STACK NAME>

## TODO
- Build. Cambio de endpoint clientes
- Build. Variables de entorno Graph y prisma
- Cloudformation. Get variables al momento de crear prisma