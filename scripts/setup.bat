@echo off
echo ⚙️  Setting up Ether3 project...

REM Check if .env exists
if not exist ".env" (
    echo 📝 Creating .env file from .env.example...
    copy /Y .env.example .env
    echo ⚠️  Please edit .env and add your configuration!
) else (
    echo ✓ .env file already exists
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build application
echo 🔨 Building application...
call npm run build

echo ✅ Setup completed successfully!
echo 🚀 Run 'npm run start:dev' to start development server
