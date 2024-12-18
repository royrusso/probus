FROM node:23.0.0-alpine

WORKDIR /frontend

# Copy package.json and package-lock.json to install dependencies
COPY /frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY /frontend/. .

# Build the application for production
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start", "--", "--host"]