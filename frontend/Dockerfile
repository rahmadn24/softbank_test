FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache build-base python3

# Copy only package.json and lock file from src
COPY src/package*.json ./src/

# Set working directory to /app/src
WORKDIR /app/src

# Install dependencies
RUN npm install

# Copy the entire src folder
COPY src/ .

# Build the app
RUN npm run build

# Expose desired port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
