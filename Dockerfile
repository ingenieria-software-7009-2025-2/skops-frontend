# skops-frontend/Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm install react-leaflet leaflet

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
