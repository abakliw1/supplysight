# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install deps first for better caching
COPY package*.json ./
RUN npm ci

# Copy the rest
COPY . .

EXPOSE 5173

# ----- Dev target -----
FROM base as dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ----- Prod target (optional: nginx) -----
FROM base AS build
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
