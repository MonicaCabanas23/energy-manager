FROM node:22-alpine AS base

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias
FROM base AS deps

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Construir la aplicación
FROM base AS builder
WORKDIR /app

# Definir argumentos para variables de entorno en tiempo de compilación
ARG APP_BASE_URL
ARG AUTH0_SECRET
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG PRISMA_ENERGY_MANAGER_DB_POSTGRES_URL
ARG PRISMA_ENERGY_MANAGER_DB_PRISMA_DATABASE_URL
ARG MQTT_URI
ARG MQTT_USERNAME
ARG MQTT_PASSWORD
ARG MQTT_TOPICS

# Establecer variables de entorno para el proceso de compilación
ENV APP_BASE_URL=${APP_BASE_URL}
ENV AUTH0_SECRET=${AUTH0_SECRET}
ENV AUTH0_DOMAIN=${AUTH0_DOMAIN}
ENV AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
ENV AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV PRISMA_ENERGY_MANAGER_DB_POSTGRES_URL=${PRISMA_ENERGY_MANAGER_DB_POSTGRES_URL}
ENV PRISMA_ENERGY_MANAGER_DB_PRISMA_DATABASE_URL=${PRISMA_ENERGY_MANAGER_DB_PRISMA_DATABASE_URL}
ENV MQTT_URI=${MQTT_URI}
ENV MQTT_USERNAME=${MQTT_USERNAME}
ENV MQTT_PASSWORD=${MQTT_PASSWORD}
ENV MQTT_TOPICS=${MQTT_TOPICS}

# Copiar archivos de dependencias y configuración primero
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY package.json package-lock.json* ./
COPY next.config.ts postcss.config.mjs tsconfig.json eslint.config.mjs ./

# Generar Prisma Client (esto solo se regenerará si los archivos de prisma cambian)
RUN npx prisma generate

# Ahora copiar el código fuente (que cambia con más frecuencia)
COPY public ./public
COPY src ./src

# Construir la aplicación
RUN npm run build

# Producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]