#!/bin/bash
set -e
. /app/prismaconfig.sh
echo "$PRISMA_CONFIG"
/app/prerun_hook.sh
/app/bin/prisma-local