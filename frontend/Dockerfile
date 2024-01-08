FROM node:20.9.0-alpine

WORKDIR /usr/src/app/frontend
COPY package.json ./
COPY tsconfig.json ./
COPY . .
ARG VITE_APP_API_URL
ARG VITE_APP_API_UPLOAD_URL

ENV VITE_APP_API_URL=$VITE_APP_API_URL
ENV VITE_APP_API_UPLOAD_URL=$VITE_APP_API_UPLOAD_URL
RUN npm install
RUN npm run build

EXPOSE 4173
CMD [ "npm", "run", "preview" ]