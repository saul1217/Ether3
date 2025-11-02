# Guía de Deployment

Esta guía te ayudará a desplegar la API Ether3 en diferentes entornos.

## 📋 Requisitos Previos

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 20.x (para desarrollo local)
- Variables de entorno configuradas

## 🚀 Opciones de Deployment

### 1. Desarrollo Local con Docker

```bash
# Opción 1: Usando docker-compose
docker-compose -f docker-compose.dev.yml up --build

# Opción 2: Usando script
chmod +x scripts/dev.sh
./scripts/dev.sh
```

### 2. Producción con Docker

```bash
# Crear archivo .env con tus configuraciones
cp .env.example .env

# Ejecutar deployment
docker-compose up -d --build

# O usando el script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 3. Development Local (sin Docker)

```bash
# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env

# Ejecutar en desarrollo
npm run start:dev

# Build y ejecutar producción
npm run build
npm run start:prod
```

## 🔧 Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=production

# JWT
JWT_SECRET=tu-clave-secreta-super-segura-aqui
JWT_EXPIRES_IN=7d

# Ethereum
ETH_RPC_URL=https://eth.llamarpc.com
```

**⚠️ IMPORTANTE**: Cambia `JWT_SECRET` por una clave segura y aleatoria en producción.

## 🌐 Deployment en Cloud

### Railway

1. Instala [Railway CLI](https://docs.railway.app/develop/cli):
   ```bash
   npm i -g @railway/cli
   ```

2. Inicia sesión:
   ```bash
   railway login
   ```

3. Crea un nuevo proyecto:
   ```bash
   railway init
   ```

4. Agrega variables de entorno:
   ```bash
   railway variables set JWT_SECRET=tu-clave-secreta
   ```

5. Deploy:
   ```bash
   railway up
   ```

### Render (Recomendado para este proyecto)

Render es una excelente opción para desplegar NestJS. Tiene dos métodos:

#### Método 1: Configuración Automática con render.yaml (Más Fácil)

El proyecto incluye `render.yaml` para configuración automática:

1. **Crea una cuenta en [Render](https://render.com)** (gratis)
   - Conecta tu cuenta de GitHub/GitLab

2. **Conecta tu repositorio**
   - Click en "New" → "Web Service"
   - Selecciona tu repositorio
   - Render detectará automáticamente el `render.yaml`

3. **Configura las variables de entorno**
   En el dashboard de Render, ve a "Environment" y agrega:
   ```
   JWT_SECRET=tu-clave-secreta-muy-segura-aqui
   ```
   
   **⚠️ IMPORTANTE**: Genera un secreto seguro:
   ```bash
   # En tu terminal
   openssl rand -base64 32
   ```
   
   También puedes usar el generador de Render haciendo clic en "Generate Value" junto a JWT_SECRET.

4. **Deploy automático**
   - Render construirá y desplegará automáticamente
   - El health check se configurará en `/health`
   - Cada push a `main` desplegará automáticamente (autoDeploy: true)

#### Método 2: Configuración Manual

Si prefieres configurar manualmente:

1. **Crea una cuenta en [Render](https://render.com)**

2. **Crea un nuevo Web Service**
   - Click en "New" → "Web Service"
   - Selecciona tu repositorio

3. **Configura el servicio:**
   - **Name**: `ether3-api` (o el que prefieras)
   - **Environment**: `Node`
   - **Region**: Elige la más cercana (ej: `Oregon (US West)`)
   - **Branch**: `main` (o tu rama principal)
   - **Root Directory**: `.` (raíz del proyecto)
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm run start:prod
     ```
   - **Plan**: `Starter` (gratis) o `Standard` (recomendado para producción)

4. **Variables de entorno (Environment Variables)**
   
   Click en "Environment" y agrega:
   ```
   NODE_ENV = production
   PORT = 10000 (Render lo configura automáticamente)
   JWT_SECRET = [genera uno seguro con openssl rand -base64 32]
   JWT_EXPIRES_IN = 7d
   ETH_RPC_URL = https://eth.llamarpc.com
   ```
   
   **Nota**: Render asigna el `PORT` automáticamente, no necesitas configurarlo.

5. **Health Check (Opcional pero recomendado)**
   - **Health Check Path**: `/health`
   - Render verificará automáticamente que tu app esté funcionando

6. **Deploy**
   - Click en "Create Web Service"
   - Render construirá y desplegará tu aplicación
   - Verás los logs en tiempo real
   - Tu URL será: `https://ether3-api.onrender.com` (o el nombre que hayas elegido)

#### Verificación Post-Deploy

Una vez desplegado, verifica:

```bash
# Health check
curl https://tu-app.onrender.com/health

# Test endpoint
curl https://tu-app.onrender.com/auth/test
```

**Respuesta esperada**:
```json
{"status": "ok", "timestamp": "2024-01-01T00:00:00.000Z"}
```

#### Actualizar Variables de Entorno

1. Ve a tu servicio en Render Dashboard
2. Click en "Environment"
3. Agrega o modifica variables
4. Click en "Save Changes"
5. Render reiniciará automáticamente con las nuevas variables

#### Logs y Monitoreo

- **Logs en tiempo real**: Render Dashboard → Tu servicio → Logs
- **Métricas**: Disponibles en el plan Standard+
- **Alertas**: Configura alertas en Settings → Notifications

#### Troubleshooting Render

**Build fails:**
- Verifica los logs en el dashboard
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que `npm run build` funcione localmente

**App no inicia:**
- Verifica que `PORT` no esté hardcodeado (Render lo asigna)
- Revisa logs para errores de JWT_SECRET
- Verifica que todas las variables de entorno estén configuradas

**Health check fails:**
- Verifica que `/health` endpoint esté funcionando
- Revisa logs para errores de inicio

#### Costos

- **Starter Plan**: Gratis (con limitaciones de sleep después de inactividad)
- **Standard Plan**: $7/mes (sin sleep, mejor para producción)
- **Pro Plan**: $25/mes (más recursos)

**Recomendación**: Usa Starter para pruebas, Standard para producción.

### Heroku

1. Instala [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. Crea una app:
   ```bash
   heroku create tu-app-name
   ```

3. Configura variables:
   ```bash
   heroku config:set JWT_SECRET=tu-clave-secreta
   heroku config:set NODE_ENV=production
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. Conecta tu repositorio en el dashboard
2. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **HTTP Port**: 3000
3. Agrega variables de entorno
4. Deploy automático

### AWS EC2 con Docker

```bash
# SSH a tu servidor
ssh user@your-server

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clonar repositorio
git clone https://github.com/tu-usuario/ether3.git
cd ether3

# Configurar .env
nano .env

# Deploy
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### Google Cloud Run

1. Instala [gcloud CLI](https://cloud.google.com/sdk/docs/install)
2. Autentica:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```
3. Build y deploy:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ether3
   gcloud run deploy ether3 \
     --image gcr.io/YOUR_PROJECT_ID/ether3 \
     --platform managed \
     --region us-central1 \
     --set-env-vars JWT_SECRET=tu-clave-secreta
   ```

## 🔍 Health Checks

El endpoint de health check está disponible en:

```
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Monitoreo

### Logs de Docker

```bash
# Ver logs
docker-compose logs -f

# Ver logs de última hora
docker-compose logs --since 1h

# Ver logs de un servicio específico
docker-compose logs app
```

### Métricas

Considera integrar:
- **Prometheus** para métricas
- **Grafana** para visualización
- **Sentry** para error tracking
- **New Relic** para APM

## 🔒 Seguridad en Producción

1. **JWT Secret**: Usa una clave fuerte y aleatoria
   ```bash
   openssl rand -base64 32
   ```

2. **HTTPS**: Configura SSL/TLS
   - Usa Let's Encrypt
   - O un load balancer con SSL termination

3. **Rate Limiting**: Implementa límites de rate
   ```bash
   npm install @nestjs/throttler
   ```

4. **Firewall**: Configura reglas de firewall adecuadas

5. **Variables**: Nunca commitees `.env` con secretos

## 🔄 CI/CD con GitHub Actions

Los workflows incluyen:

- **CI**: Lint, tests y build en cada PR
- **Docker Build**: Build automático de imagen Docker
- **Push**: Push a GitHub Container Registry

Configura secrets en tu repositorio si usas deployment automático.

## 🐳 Actualización

Para actualizar la aplicación:

```bash
# Pull latest code
git pull

# Rebuild y restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🆘 Troubleshooting

### Puerto ya en uso
```bash
# Verificar qué está usando el puerto
lsof -i :3000
# O en Windows
netstat -ano | findstr :3000

# Cambiar puerto en docker-compose.yml
```

### Errores de permisos
```bash
# Linux/Mac
chmod +x scripts/*.sh
```

### Out of memory
```bash
# Verificar recursos Docker
docker stats

# Limitar recursos en docker-compose.yml
services:
  app:
    mem_limit: 512m
```

### Build failures
```bash
# Clean rebuild
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
```

## 📞 Soporte

Para más información, consulta:
- [README.md](README.md) - Documentación general
- [Issues](https://github.com/tu-repo/issues) - Reportar problemas
