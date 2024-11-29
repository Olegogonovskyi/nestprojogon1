FROM node:20-alpine

MAINTAINER Some Dev

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json /app

RUN npm i

#FROM node:20-alpine
#
## Створення робочої директорії
#WORKDIR /app
#
## Копіювання package.json та встановлення залежностей
#COPY backend/package.json /app/
#RUN npm install
#
## Копіювання коду додатку
#COPY backend /app
#
## Відкриття порту
#EXPOSE 3002
#
## Запуск додатку
#CMD ["node", "dist/src/main.js"]

#FROM node:20-alpine

## Встановлення системних залежностей
#RUN apk add --no-cache python3 make g++ build-base
#
#WORKDIR /app
#
## Копіювання файлів проекту
#COPY ./backend/package*.json ./
#
## Очищення кеша npm перед встановленням
#RUN npm cache clean --force
#
## Встановлення залежностей
#RUN npm install --legacy-peer-deps
#
## Копіювання решти файлів
#COPY ./backend .
#
## Збирання проекту
#RUN npm run build
#
## Команда запуску
#CMD ["node", "dist/src/main.js"]