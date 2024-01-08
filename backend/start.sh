#!/bin/sh
# start.sh

./wait-for-it.sh fastify-vuejs-mysqldb:3306 -- echo "MySQL is up"

# Run Prisma migrations
npm run prisma:migrate-dev

# Start the main process
exec npm start
