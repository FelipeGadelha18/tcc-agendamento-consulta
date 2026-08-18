# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# Cacheia npm ci enquanto o package-lock não muda
COPY package*.json ./
RUN npm ci

COPY . .
# Build de produção (default configuration do angular.json)
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Config com fallback de SPA para o Angular Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# O builder "application" do Angular 19 gera a saída em dist/<projeto>/browser
COPY --from=build /app/dist/efichaapp/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
