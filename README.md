# Full-Stack TypeScript-Fastify-VueJS3-Prisma Application

Full-Stack web app built with Typescript, Fastify, VueJS3, and Prisma.

## Getting Started

This guide will walk you through the process of setting up and running the application on your local environment or using Docker.

### Prerequisites

- For local setup, ensure you have Node.js and NPM installed.
  - Ensure you have a MySQL server operational on your machine.
  - Create a new MySQL database for the application.
- For Docker, ensure you have Docker installed.

### Configuration

For local setup, 
- navigate to `backend` directory and copy `.env.example` to `.env` and update the database connection 
string to your local MySQL server.

``
mysql://[username]:[password]@[host]:[port]/[database_name]
``


### Installation

1. Navigate to both `backend` and `frontend` directories and execute `npm install`.
2. Navigate to the `backend` directory, run `npm run prisma:gen` and `npm run prisma:migrate-dev` to set up the database schema.

### Running the Application

#### Local Environment

Execute `npm run dev` in both `backend` and `frontend` directories to start the application locally.

#### Using Docker

With Docker installed, execute the following commands in the root directory:

- `docker-compose build`
- `docker-compose up`

The frontend will be accessible at http://localhost:4173, and the backend at http://localhost:3000.

### API Testing with Postman

A Postman collection is included in the base path for testing backend APIs. Import this collection into Postman to explore the API endpoints.

---
