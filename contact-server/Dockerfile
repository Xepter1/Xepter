# Winziger Kontakt-Dienst: Node + nodemailer, lauscht auf 8080 (nur über Caddy erreichbar).
FROM node:20-alpine
WORKDIR /app

# Nur Manifeste zuerst → Dependency-Layer wird gecacht
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

COPY server.js ./

ENV NODE_ENV=production
EXPOSE 8080
USER node
CMD ["node", "server.js"]
