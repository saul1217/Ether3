# Quick Start Guide

Guía rápida para empezar con Ether3 en 5 minutos.

## 🎯 Para Desarrollo Local (Sin Docker)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu configuración
# Mínimo necesario:
# JWT_SECRET=tu-clave-secreta-aqui
```

### 3. Ejecutar aplicación

```bash
# Desarrollo (con hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 4. Probar la API

```bash
# Health check
curl http://localhost:3000/health

# Endpoint de prueba
curl http://localhost:3000/auth/test
```

## 🐳 Para Desarrollo con Docker

### Opción Windows:

```batch
REM Setup inicial
scripts\setup.bat

REM Desarrollo
scripts\dev.bat
```

### Opción Linux/Mac:

```bash
# Dar permisos
chmod +x scripts/*.sh

# Setup inicial
./scripts/setup.sh

# Desarrollo
./scripts/dev.sh
```

## 🚀 Para Producción con Docker

### Windows:

```batch
# Setup y deploy
scripts\setup.bat
scripts\deploy.bat
```

### Linux/Mac:

```bash
# Setup y deploy
./scripts/setup.sh
./scripts/deploy.sh
```

## 🔐 Variables de Entorno Mínimas

```env
# Requeridas
JWT_SECRET=tu-clave-secreta-super-segura

# Opcionales (con valores por defecto)
PORT=3000
JWT_EXPIRES_IN=7d
ETH_RPC_URL=https://eth.llamarpc.com
```

## 📝 Probar Autenticación

### 1. Obtener challenge

```bash
curl -X POST http://localhost:3000/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{"address":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

### 2. Firmar el challenge con MetaMask

Copia el challenge de la respuesta anterior y úsalo en tu cliente React.

### 3. Verificar firma

```bash
curl -X POST http://localhost:3000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "signature":"0x...",
    "challenge":"Please sign..."
  }'
```

Recibirás un token JWT en la respuesta.

### 4. Usar token para acceder a endpoints protegidos

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## 🌐 Deploy Rápido a Render (Recomendado)

**Deployment en 5 minutos:**

1. **Preparar repositorio:**
   ```bash
   git add .
   git commit -m "Ready for Render"
   git push origin main
   ```

2. **Crear cuenta en [Render](https://render.com)** (gratis)

3. **Crear Web Service:**
   - Click en "New" → "Web Service"
   - Conecta tu repositorio
   - Render detectará automáticamente `render.yaml`

4. **Configurar JWT_SECRET:**
   - En "Environment", busca `JWT_SECRET`
   - Click en "Generate Value" (recomendado)
   - O genera manualmente: `openssl rand -base64 32`

5. **Deploy automático:**
   - Click en "Create Web Service"
   - Render construirá y desplegará automáticamente

**Guía completa**: Ver [RENDER_DEPLOY.md](RENDER_DEPLOY.md)

## 🔗 Otras Opciones de Deploy

### Railway

1. Instalar Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login y deploy:
```bash
railway login
railway init
railway variables set JWT_SECRET=tu-clave-secreta
railway up
```

## 📚 Próximos Pasos

- Ver [README.md](README.md) para documentación completa
- Ver [DEPLOYMENT.md](DEPLOYMENT.md) para más opciones de deployment
- Ver [examples/react-auth-example.tsx](examples/react-auth-example.tsx) para integración React

## 🐛 Problemas Comunes

### Puerto en uso

```bash
# Cambiar puerto en .env
PORT=3001
```

### Docker no inicia

```bash
# Verificar que Docker está corriendo
docker info

# Ver logs
docker-compose logs
```

### Error de JWT_SECRET

```bash
# Generar un secreto seguro
openssl rand -base64 32
```

## 💡 Tips

- Usa `npm run start:dev` para desarrollo con hot-reload
- Los challenges expiran en 5 minutos
- ENS solo funciona en Ethereum Mainnet
- Siempre usa HTTPS en producción

¿Listo? 🎉 Tu API está corriendo en `http://localhost:3000`
