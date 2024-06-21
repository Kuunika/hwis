# Use the official Node.js image as the base image
FROM node:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Install serve to serve the application
RUN npm install -g serve

# Use a lightweight Node.js image for the final stage
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 3000

# Serve the Next.js application
CMD ["serve", "-s", "out", "-l", "3000"]
