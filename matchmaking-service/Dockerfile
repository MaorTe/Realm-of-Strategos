# Base image
FROM node:16-buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002 9229

# Use Node.js debugging mode with source maps
# CMD ["node", "--inspect=0.0.0.0:9229", "dist/src/index.js"]