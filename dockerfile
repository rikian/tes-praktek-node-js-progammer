FROM node:16.14.0

WORKDIR /rikian/project-test-nodejs

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9091

CMD ["node", "index.js"]