FROM node:24.12-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# -------- RUNTIME STAGE --------
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Set environment variables and expose port
ENV PORT=80
EXPOSE $PORT/tcp

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
