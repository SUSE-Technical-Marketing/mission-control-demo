FROM registry.rigel.lab.geeko.me/application-collection/containers/nodejs:20-dev as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM registry.rigel.lab.geeko.me/application-collection/containers/nginx:1.26.3
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
