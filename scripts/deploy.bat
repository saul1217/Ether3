@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting deployment...

set APP_NAME=ether3-api
set DOCKER_COMPOSE_FILE=docker-compose.yml
set ENV_FILE=.env

REM Check if .env file exists
if not exist "%ENV_FILE%" (
    echo ❌ Error: .env file not found!
    echo Please create a .env file based on .env.example
    exit /b 1
)

REM Stop existing containers
echo ⏹️  Stopping existing containers...
docker-compose -f %DOCKER_COMPOSE_FILE% down

REM Remove old images
echo 🧹 Cleaning up old images...
docker system prune -f

REM Build new image
echo 🔨 Building Docker image...
docker-compose -f %DOCKER_COMPOSE_FILE% build --no-cache

REM Start containers
echo ▶️  Starting containers...
docker-compose -f %DOCKER_COMPOSE_FILE% up -d

REM Wait for health check
echo ⏳ Waiting for application to be ready...
timeout /t 10 /nobreak >nul

REM Check health (requires curl)
echo 📋 Checking health...
curl -f http://localhost:3000/health

REM Show logs
echo 📋 Recent logs:
docker-compose -f %DOCKER_COMPOSE_FILE% logs --tail=50

echo ✅ Deployment completed successfully!
echo 🌐 Application is running at http://localhost:3000
