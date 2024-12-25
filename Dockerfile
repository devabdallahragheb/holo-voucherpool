# Use an official Node.js runtime as a parent image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache for dependency installation
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to access the application
EXPOSE 3000

# Run the application in development mode (if using npm run start:dev)
CMD ["npm", "run", "start"]
