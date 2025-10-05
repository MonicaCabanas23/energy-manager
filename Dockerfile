FROM node:22-alpine AS base

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
FROM base AS deps
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

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Crear usuario no root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Cambiar propiedad de los archivos
RUN chown -R nextjs:nodejs /app

# Cambiar al usuario no root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]