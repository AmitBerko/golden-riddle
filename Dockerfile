FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8060

CMD ["node", "server/app.js"]