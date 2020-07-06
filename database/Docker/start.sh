#!/bin/bash
set -e
. /app/prismaconfig.sh
/app/prerun_hook.sh
/app/bin/prisma-local