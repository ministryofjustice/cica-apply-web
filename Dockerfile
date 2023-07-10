# lets start from an image that already has nodejs installed
# https://snyk.io/blog/choosing-the-best-node-js-docker-image/
FROM node:18.16.1-bullseye-slim as base
RUN groupadd -g 1014 dc_user \
    && useradd -rm -d /usr/src/app -u 1015 -g dc_user dc_user
USER dc_user

# Essentially running mkdir <name> inside the current working
# directory, and then cd <name>
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

EXPOSE 3000

ARG NODE_ENV=production
# Defult to production. npm will ignore devDependencies in production mode
FROM base as production

ENV NODE_ENV=production
# RUN npm install --production

# RUN npm install
# If you are building your code for production
# RUN npm ci
RUN npm ci --omit=dev
# Bundle app source
COPY . .

USER 1015
# the command line to run when the container is started
CMD [ "npm", "start" ]


# Dev build runs npm ci without the --production flag
# and runs the start:dev script
FROM base as dev

ENV NODE_ENV=development

# RUN npm install
# If you are building your code for production
#USER root
RUN npm ci

# Bundle app source
COPY . .

USER 1015
# the command line to run when the container is started
CMD [ "npm", "start" ]
