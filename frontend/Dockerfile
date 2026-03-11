# Build stage
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL_USER
ARG VITE_API_URL_VEHICLE
ENV VITE_API_URL_USER=$VITE_API_URL_USER
ENV VITE_API_URL_VEHICLE=$VITE_API_URL_VEHICLE

RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]