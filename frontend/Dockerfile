# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final stage
FROM nginx:alpine

# Use envsubst to replace $PORT in nginx.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Nginx image's default entrypoint will handle envsubst for templates in /etc/nginx/templates/
CMD ["nginx", "-g", "daemon off;"]
