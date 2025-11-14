# ---- Base Storage ---
# Node Image
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS development
COPY package*.json ./
# Install prod dependencies
RUN npm isntall
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ---- Build Storage ----
FROM base AS build
COPY package*.json ./
# Install all dependencies (including devDependencies)
RUN npm install
# Copy all code
COPY . .
# Build app
RUN npm run build

# ---- Production Stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
# Copy package.json
COPY package*.json ./
# Install only prod dependencies
RUN npm ci --only=production
# Copy build app from 'Build Stage'
COPY --from=build /usr/src/app/dist ./dist
# Expose the NestJS default port
EXPOSE 3000

# Run App command
CMD ["node", "dist/main"]
