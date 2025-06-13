# Stage 1: Build
FROM node:20.17.0 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the source code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the built app
FROM nginx:stable-alpine

# Copy built files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# 🔥 Add this line to copy your custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
