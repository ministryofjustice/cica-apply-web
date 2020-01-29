# lets start from an image that already has nodejs installed
FROM node:10.13.0

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
# required for the `postinstall` npm script.
COPY webpack.config*.js ./
COPY src/js/ ./src/js/
COPY src/modules/ ./src/modules/

# Defult to production. npm will ignore devDependencies in production mode
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# RUN npm install
# If you are building your code for production
RUN npm install

# Bundle app source
COPY . .

# Expose port 4000 inside the container to the outside world
# so that http://localhost:3000 routes the network traffic to
# the container
EXPOSE 3000

USER 1015
# the command line to run when the container is started
CMD [ "npm", "start" ]
