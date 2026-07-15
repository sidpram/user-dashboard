FROM node:22-alpine
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN mkdir -p /app/logs
EXPOSE 3000
CMD ["node", "server.js"]
