# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application with placeholder values that will be replaced at runtime
ENV VITE_API_URL=__VITE_API_URL__
ENV VITE_API_VERSION=__VITE_API_VERSION__
RUN npm run build

# Production image, copy all the files and run the app
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Install gettext for envsubst (environment variable substitution)
RUN apk add --no-cache gettext

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built application from builder stage
COPY --from=builder /app/dist .

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create entrypoint script
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'echo "Replacing environment variables..."' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|__VITE_API_URL__|${VITE_API_URL:-http://localhost:3000}|g" {} \;' >> /docker-entrypoint.sh && \
    echo 'find /usr/share/nginx/html -name "*.js" -type f -exec sed -i "s|__VITE_API_VERSION__|${VITE_API_VERSION:-v1}|g" {} \;' >> /docker-entrypoint.sh && \
    echo 'echo "Starting nginx..."' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]