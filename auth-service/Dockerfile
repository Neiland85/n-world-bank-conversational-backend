# Usar una imagen base de Node.js
FROM node:18

# Configuración del directorio de trabajo
WORKDIR /usr/src/app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código restante
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar el servicio
CMD ["npm", "start"]

