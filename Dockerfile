FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 3000