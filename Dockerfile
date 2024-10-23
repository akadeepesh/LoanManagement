# Base stage (common for both development and production)
FROM node:lts-alpine AS base

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (better layer caching)
COPY package*.json ./

# Install dependencies using npm ci
RUN npm ci

# Copy the rest of the application code
COPY . .

# Development stage
FROM base AS dev

# Expose the port for development
EXPOSE 3000

# Start the Next.js app in development mode
CMD ["npm", "run", "dev"]

# Build stage (for production)
FROM base AS builder

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:lts-alpine AS runner

WORKDIR /usr/src/app

# Install only production dependencies
COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --omit=dev

# Copy the built app from the build stage
COPY --from=builder /usr/src/app/.next ./.next
# COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.mjs ./
COPY --from=builder /usr/src/app/vercel.json ./ 
COPY --from=builder /usr/src/app/.env ./.env 

# Set the environment variable to production
ENV NODE_ENV=production

# Expose the port for production
EXPOSE 3000

# Run the Next.js app in standalone production mode
CMD ["npm", "run", "start"]
