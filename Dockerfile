# Etapa 1: Construcción de la aplicación Angular
FROM node:18 AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y package-lock.json (o yarn.lock) para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código del proyecto al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build --prod

# Etapa 2: Servir la aplicación con un servidor HTTP
FROM nginx:alpine

# Copia los archivos de producción generados en el contenedor nginx
COPY --from=build /app/dist/historial-medico /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
