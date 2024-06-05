FROM node:16-alpine

RUN apk add --no-cache \
        libstdc++ \
    && apk add --no-cache --virtual .build-deps-full \
        binutils-gold \
        g++ \
        gcc \
        gnupg \
        libgcc \
        linux-headers \
        make \
        python3 \
    && apk add git

COPY . .
RUN npm install
RUN npm run generate

EXPOSE 3000

CMD npm run start:all