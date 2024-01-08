#!/bin/sh
# start.sh

echo "DATABASE_URL: $DATABASE_URL"

# Run Prisma migrations
npm run prisma:migrate-dev

# Start the main process
exec npm start
