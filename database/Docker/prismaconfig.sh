#/bin/bash

# Setting prisma variables
sed -i "s/__MANAGEMENT_API_SECRET__/$MANAGEMENT_API_SECRET/g" prismaconfig.yml
sed -i "s/__PORT__/$PRISMA_PORT/g" prismaconfig.yml
sed -i "s/__DATABASE_CONNECTOR__/$CONNECTOR/g" prismaconfig.yml 
sed -i "s/__ENABLE_DB_MIGRATIONS__/$MIGRATION/g" prismaconfig.yml 
sed -i "s/__DATABASE_HOST__/$DATABASE_HOST/g" prismaconfig.yml
sed -i "s/__DATABASE_PORT__/$DATABASE_PORT/g" prismaconfig.yml
sed -i "s/__DATABASE_USER__/$DATABASE_USER/g" prismaconfig.yml
sed -i "s/__DATABASE_PASSWORD__/$DATABASE_PASSWORD/g" prismaconfig.yml 
sed -i "s/__DATABASE_NAME__/$DATABASE_NAME/g" prismaconfig.yml 

# Set enviroment variable
export PRISMA_CONFIG=$(cat prismaconfig.yml)
