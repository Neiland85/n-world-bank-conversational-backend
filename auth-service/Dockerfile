FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm rebuild bcrypt --build-from-source
COPY . .
EXPOSE 3000

