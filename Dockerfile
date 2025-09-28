# Step 1: Build the Vite React app
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy pnpm lockfile and package.json first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy all source files
COPY . .

# Build the Vite app for production
RUN pnpm build

# Step 2: Serve with Caddy
FROM caddy:2.9.1-alpine

# Set working directory
WORKDIR /srv

# Copy Caddyfile if you have custom settings
COPY Caddyfile /etc/caddy/Caddyfile

# Copy built app from previous stage
COPY --from=builder /app/dist /srv

# Expose port 80 (default for Caddy)
EXPOSE 80

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
