FROM registry.rigel.lab.geeko.me/application-collection/containers/nodejs:20-dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]
EXPOSE 3000
