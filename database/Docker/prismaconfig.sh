#/bin/bash

# Setting prisma variables
echo "Setting prisma variables"
sed -i "s/__MANAGEMENT_API_SECRET__/$(_R=$(echo $SECRET | ./jq -r '.PRISMA_MANAGEMENT_API_SECRET'); [ $_R == null ] || [ -z $_R ] && echo $PRISMA_MANAGEMENT_API_SECRET || echo $_R)/g" prismaconfig.yml
sed -i "s/__PORT__/$(_R=$(echo $SECRET | ./jq -r '.PRISMA_PORT'); [ $_R == null ] || [ -z $_R ] && echo $PRISMA_PORT || echo $_R)/g" prismaconfig.yml
sed -i "s/__DATABASE_CONNECTOR__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_CONNECTOR'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_CONNECTOR || echo $_R)/g" prismaconfig.yml 
sed -i "s/__ENABLE_DB_MIGRATIONS__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_MIGRATION'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_MIGRATION || echo $_R)/g" prismaconfig.yml 
sed -i "s/__DATABASE_HOST__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_HOST'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_HOST || echo $_R)/g" prismaconfig.yml
sed -i "s/__DATABASE_PORT__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_PORT'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_PORT || echo $_R)/g" prismaconfig.yml
sed -i "s/__DATABASE_USER__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_USER'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_USER || echo $_R)/g" prismaconfig.yml
sed -i "s/__DATABASE_PASSWORD__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_PASSWORD'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_PASSWORD || echo $_R)/g" prismaconfig.yml 
sed -i "s/__DATABASE_NAME__/$(_R=$(echo $SECRET | ./jq -r '.DATABASE_NAME'); [ $_R == null ] || [ -z $_R ] && echo $DATABASE_NAME || echo $_R)/g" prismaconfig.yml 

# Set enviroment variable
echo "Setting PRISMA_CONFIG"
export PRISMA_CONFIG=$(cat prismaconfig.yml)
