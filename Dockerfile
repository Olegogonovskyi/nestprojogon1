#FROM node:20
#
#MAINTAINER Some Dev
#
#RUN mkdir /app
#WORKDIR /app
#
#COPY ./backend/package.json /app
#
#RUN npm i

# Використовуємо офіційний образ Node.js
FROM node:20

RUN mkdir /app

# Встановлюємо робочу директорію для контейнера
WORKDIR /app

# Копіюємо package.json та package-lock.json з каталогу backend
COPY backend/package.json backend/package-lock.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь код з каталогу backend
COPY backend/ ./

# Збираємо проект
RUN npm run build

# Запускаємо додаток
CMD ["node", "/app/dist/src/main.js"]





