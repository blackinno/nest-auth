FROM node:14.15.4-alpine3.10 AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

RUN npm cache clear --force 
RUN npm install --silent


COPY . .
RUN npm run build


FROM node:14.15.4-alpine3.10
WORKDIR /app
COPY package*.json ./
RUN npm cache clear --force 
RUN npm install --silent --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/environments ./environments
EXPOSE 3001

CMD ["npm","run","start:prod"]