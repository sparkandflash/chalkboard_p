# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final stage
FROM nginx:alpine

# FIX: Force Nginx to use only 1 worker process instead of checking host CPU cores
RUN sed -i 's/worker_processes.*/worker_processes 1;/' /etc/nginx/nginx.conf

# Official Nginx image supports templates in /etc/nginx/templates/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# ONLY replace the PORT variable to avoid breaking nginx variables like $uri
ENV NGINX_ENVSUBST_FILTER=PORT

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]