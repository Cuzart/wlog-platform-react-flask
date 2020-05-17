# Docker Image which is used as foundation
FROM node:14-alpine

# A directory within the virtualized Docker environment
WORKDIR /usr/src/app

# Copies package.json and package-lock.json to Docker environment
# and installs all node packages
COPY package*.json ./
RUN npm install

# Copies everything over to Docker environment
#COPY . .

# Finally runs the application
CMD [ "npm", "start" ]
