# Production Dockerfile for SmartPrice Server
FROM node:20-alpine AS base

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy package definitions
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy server application code
COPY . .

# Use non-root node user for security
USER node

EXPOSE 5000

# Health check to ensure API is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
