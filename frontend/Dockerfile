FROM registry.suse.com/bci/nodejs:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM registry.hangar-bay.lab.geeko.me/application-collection/containers/nginx:1.28.0
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
