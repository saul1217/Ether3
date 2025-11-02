#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ether3-api"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    exit 1
fi

# Stop existing containers
echo -e "${YELLOW}⏹️  Stopping existing containers...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE down

# Remove old images
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker system prune -f

# Build new image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache

# Start containers
echo -e "${YELLOW}▶️  Starting containers...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Wait for health check
echo -e "${YELLOW}⏳ Waiting for application to be ready...${NC}"
sleep 10

# Check health
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is healthy!${NC}"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Error: Application failed to start!${NC}"
    docker-compose -f $DOCKER_COMPOSE_FILE logs
    exit 1
fi

# Show logs
echo -e "${GREEN}📋 Recent logs:${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=50

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application is running at http://localhost:3000${NC}"
