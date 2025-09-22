# Stage 1: Build React app
FROM node:22 AS build
 
WORKDIR /app
 
# Install dependencies
COPY package*.json ./
RUN npm install --force
 
# Copy source and build
COPY . .
RUN npm run build
 
# Stage 2: Serve with nginx
FROM nginx:stable-alpine
 
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
 
# Copy build output from React
COPY --from=build /app/build /usr/share/nginx/html
 
# Copy custom nginx config (optional, see below)
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 4000
 
CMD ["nginx", "-g", "daemon off;"]