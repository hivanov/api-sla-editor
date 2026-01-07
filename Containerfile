# Stage 1: Build the Vue.js application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production

# Copy Nginx configuration (optional, but good practice for customization)
# If you have a custom nginx.conf, uncomment and copy it:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built application from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"]
