# Stage 1: Build
FROM node:20.9.0-alpine as builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY tsconfig.json ./
COPY src ./src/

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:20.9.0-alpine

WORKDIR /usr/src/app

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma/

ARG DATABASE_URL

# Expose the port the app runs on
EXPOSE 3000

# Copy the start script
COPY start.sh ./
RUN chmod +x ./start.sh

# Start the application
CMD ["./start.sh"]
