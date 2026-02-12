FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install
COPY . .


RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]
