FROM node:20-alpine3.19 

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . .

CMD ["sh", "-c", "npm run build && npm start"]
