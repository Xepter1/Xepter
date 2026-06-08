# --- Stage 1: Build ---
FROM node:20-alpine AS build
WORKDIR /app

# Nur Manifeste kopieren → Layer-Cache für Dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Restlichen Code kopieren und bauen → /app/dist
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine
# SPA-fähige nginx-Config (Fallback auf index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Statisches Build-Ergebnis ausliefern
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
