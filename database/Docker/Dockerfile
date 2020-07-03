# docker build -t ibex/prisma:1.34 -f Dockerfile .
# docker run -it --entrypoint="" ibex/prisma:1.34 /bin/bash

# PUSH IMAGE to ECR
# aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 797409686075.dkr.ecr.us-east-1.amazonaws.com
# docker tag ibex/prisma:1.34 797409686075.dkr.ecr.us-east-1.amazonaws.com/test/ibex/prisma:1.34
# docker push 797409686075.dkr.ecr.us-east-1.amazonaws.com/test/ibex/prisma:1.34

FROM prismagraphql/prisma:1.34
LABEL maintainer="jguzman <jguzman@datum.com.gt>"

COPY prismaconfig.yml /app/
COPY prismaconfig.sh /app/
COPY start.sh /app/

WORKDIR /app/

ENV SECRET="" \
    MANAGEMENT_API_SECRET="" \
    PRISMA_PORT=80 \
    CONNECTOR="postgres" \
    MIGRATION="true" \
    DATABASE_HOST="localhost" \
    DATABASE_PORT=5432 \
    DATABASE_USER="postgres" \
    DATABASE_PASSWORD="" \
    DATABASE_NAME="postgres" \
    JAVA_OPTS="-Xmx750m"

RUN wget https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
    mv jq-linux64 jq && \
    chmod +x jq && \
    chmod +x *.sh
