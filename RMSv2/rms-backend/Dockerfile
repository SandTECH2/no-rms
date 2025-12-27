FROM node:20

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 4000
CMD ["sh", "-c", "until npx prisma db push; do echo 'Waiting for database...'; sleep 2; done && npm run seed && node dist/server.js"]
