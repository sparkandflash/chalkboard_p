# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final stage
FROM nginx:alpine

# Copy the template to a neutral location
COPY nginx.conf.template /nginx.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

# Explicitly replace $PORT and start nginx
CMD ["/bin/sh" , "-c" , "envsubst '${PORT}' < /nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
