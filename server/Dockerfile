# -------- BUILD / RUNTIME STAGE --------
FROM node:24.12-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose backend port
ENV PORT=3001
EXPOSE $PORT

# Start the server
CMD ["node", "index.js"]
