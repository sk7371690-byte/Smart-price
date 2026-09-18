# Multi-stage Dockerfile for SmartPrice Client

# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies definitions
COPY package*.json ./
RUN npm ci

# Copy client source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx files
RUN rm -rf ./*

# Copy built dist files from Stage 1
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
