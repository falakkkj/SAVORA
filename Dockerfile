FROM node:18-alpine

WORKDIR /app

# Copy root & backend manifests
COPY package.json ./
COPY backend/package.json backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy all source files
COPY . .

# Expose server port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

# Start backend server
CMD ["node", "backend/server.js"]
