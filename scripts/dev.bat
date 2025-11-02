@echo off
echo 🔧 Starting development environment...

REM Configuration
set DOCKER_COMPOSE_FILE=docker-compose.dev.yml

REM Build and start containers
echo 🔨 Building and starting containers...
docker-compose -f %DOCKER_COMPOSE_FILE% up --build

echo ✅ Development environment is ready!
