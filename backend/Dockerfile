# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the source
COPY . .

EXPOSE 4000

# ----- Dev target -----
FROM base AS dev
CMD ["npm", "run", "dev" ]

# ----- Prod target (optional) -----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN sudo npm ci
COPY . .
# Generate Prisma client, build TS to dist
RUN sudo npx prisma generate && npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN sudo npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/index.js"]
