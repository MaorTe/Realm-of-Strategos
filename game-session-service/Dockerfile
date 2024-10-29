# Base image
FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copy the common module and other service files
COPY . .
# COPY common /usr/src/app/common
COPY common common

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]