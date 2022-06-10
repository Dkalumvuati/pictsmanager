FROM node:16.14-alpine

WORKDIR /api

COPY package*.json ./

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --only=production; \
    else npm install; \
    fi

EXPOSE 3000

COPY . ./

ADD script.sh /usr/local/bin/script.sh

RUN chmod 0777 /usr/local/bin/script.sh

CMD /bin/bash

CMD /usr/local/bin/script.sh

# TODO - to uncomment for production
# TODO - to execute npm run dev from Script file.sh
#CMD ["yarn", "start"]
