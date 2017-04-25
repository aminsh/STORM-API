FROM node:7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install -g gulp
RUN npm install

RUN gulp --production

# Bundle app source
COPY . /usr/src/app
RUN chmod -R ug+rwx /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
