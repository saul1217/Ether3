#!/bin/bash

set -e

echo "⚙️  Setting up Ether3 project..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env and add your configuration!${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

# Build application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${GREEN}🚀 Run 'npm run start:dev' to start development server${NC}"
