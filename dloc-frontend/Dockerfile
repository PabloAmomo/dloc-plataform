FROM node:16 AS build
ENV NODE_ENV build

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
RUN yarn global add serve

COPY . .

RUN yarn build
  
# Expose port
EXPOSE 3000

# Start the app
CMD [ "serve", "-s", "build" ]
