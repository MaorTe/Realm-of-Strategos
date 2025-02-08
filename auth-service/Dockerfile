# FROM node:lts-alpine
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# COPY . .
# EXPOSE 3000
# RUN chown -R node /usr/src/app
# USER node
# CMD ["node", "index.js"]

# Base image
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# CMD ["node", "dist/index.js"]

# # Use an official Node.js runtime as a parent image
# FROM node:18-alpine

# # Set the working directory inside the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies (npm ci is faster and cleaner for Docker environments)
# RUN npm ci --only=production

# # Copy the rest of the application code
# COPY . .

# # Build the TypeScript code
# RUN npm run build

# # Expose port 3000 for the service
# EXPOSE 3000

# # Command to start the service
# CMD ["npm", "start"]