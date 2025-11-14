# ---- Base Storage ---
# Node Image
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS dependencies
# Only copy dependencies files
COPY package*.json ./
# Install prod dependencies
RUN npm ci --only=production

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
# Copy dependencies from 'Dependencies Stage'
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy build app from 'Build Stage'
COPY --from=build /usr/src/app/dist ./dist
# Copy package.json
COPY package*.json ./

# Expose the NestJS default port
EXPOSE 3000

# Run App command
CMD ["node", "dist/main"]
