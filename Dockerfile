FROM node:7

EXPOSE 8080
CMD [ "npm", "start" ]

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install -g bower gulp && npm install

# Bundle app source
COPY . /tmp/app
RUN mkdir ./config && \
    chmod -R ug+rwx /.config && \
    chmod -R ug+rwx /tmp/app && \
    cp -rpT /tmp/app /usr/src/app && \
    rm -rf /tmp/app

RUN gulp --production

RUN \
  apt-get -y update && \
  apt-get -y install postgresql-client-9.4 && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
