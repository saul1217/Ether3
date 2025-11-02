# 🚀 Guía de Deployment en Render

Guía paso a paso específica para desplegar Ether3 en Render.

## 📋 Pre-requisitos

- Cuenta en [Render](https://render.com) (gratis)
- Repositorio en GitHub/GitLab/Bitbucket
- Proyecto Ether3 listo (este proyecto)

## 🎯 Deployment Rápido (5 minutos)

### Paso 1: Preparar el Repositorio

Asegúrate de que tu código esté en GitHub:

```bash
# Si aún no has hecho commit
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Paso 2: Crear Servicio en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **"New"** → **"Web Service"**
3. Conecta tu repositorio (GitHub/GitLab/Bitbucket)
4. Selecciona el repositorio `Ether3`

### Paso 3: Configuración Automática

Render detectará automáticamente el archivo `render.yaml` y configurará:
- ✅ Build command
- ✅ Start command
- ✅ Variables de entorno básicas
- ✅ Health check path

### Paso 4: Configurar JWT_SECRET

1. En la sección **"Environment"** del servicio
2. Busca `JWT_SECRET`
3. Genera un valor seguro:
   - Click en **"Generate Value"** (recomendado)
   - O genera manualmente:
     ```bash
     openssl rand -base64 32
     ```
4. Pega el valor generado

### Paso 5: Deploy

1. Click en **"Create Web Service"**
2. Render comenzará a construir tu aplicación
3. Observa los logs en tiempo real
4. Cuando termine, tu API estará disponible en:
   ```
   https://tu-app.onrender.com
   ```

## ✅ Verificación

### Test 1: Health Check

```bash
curl https://tu-app.onrender.com/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 2: Auth Test

```bash
curl https://tu-app.onrender.com/auth/test
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "message": "Auth module is working"
}
```

### Test 3: Challenge Endpoint

```bash
curl -X POST https://tu-app.onrender.com/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{"address":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

## 🔧 Configuración Manual (Opcional)

Si prefieres configurar manualmente en lugar de usar `render.yaml`:

### Configuración del Servicio

| Campo | Valor |
|-------|-------|
| **Name** | `ether3-api` |
| **Environment** | `Node` |
| **Region** | `Oregon (US West)` (o el más cercano) |
| **Branch** | `main` |
| **Root Directory** | `.` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Plan** | `Starter` (free) o `Standard` ($7/mes) |

### Variables de Entorno

Configura estas variables en **Environment** → **Environment Variables**:

| Key | Value | Notas |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `PORT` | _(auto)_ | Render lo asigna automáticamente |
| `JWT_SECRET` | `[genera uno seguro]` | **Requerido** - Usa Generate Value |
| `JWT_EXPIRES_IN` | `7d` | Opcional |
| `ETH_RPC_URL` | `https://eth.llamarpc.com` | Opcional |

### Health Check

En **Settings** → **Health Check Path**:
```
/health
```

## 🔄 Actualización Continua (CI/CD)

Con `autoDeploy: true` en `render.yaml`:
- ✅ Cada push a `main` desplegará automáticamente
- ✅ Puedes ver el estado del deploy en el dashboard
- ✅ Rollback automático si el deploy falla

Para desactivar auto-deploy:
1. Ve a **Settings** → **Build & Deploy**
2. Desactiva **"Auto-Deploy"**

## 📊 Monitoreo

### Ver Logs

1. En Render Dashboard, selecciona tu servicio
2. Click en **"Logs"**
3. Verás logs en tiempo real

### Métricas

En el plan **Standard+**:
- CPU usage
- Memory usage
- Request metrics
- Response times

## 🐛 Troubleshooting

### Error: "Build failed"

**Causa común**: Dependencias no instaladas o errores de build

**Solución**:
1. Verifica logs del build
2. Prueba localmente:
   ```bash
   npm install
   npm run build
   ```
3. Asegúrate de que todas las dependencias estén en `package.json`

### Error: "Service failed to start"

**Causa común**: Variables de entorno faltantes o incorrectas

**Solución**:
1. Verifica que `JWT_SECRET` esté configurado
2. Revisa logs para errores específicos
3. Verifica que `PORT` no esté hardcodeado

### Error: "Health check failed"

**Causa común**: App no responde en `/health`

**Solución**:
1. Verifica que el endpoint `/health` esté funcionando
2. Revisa logs para errores de inicio
3. Asegúrate de que la app esté escuchando en el puerto correcto

### App se "duerme" después de inactividad

**Causa**: Plan Starter tiene sleep automático

**Solución**:
- Upgrade a plan Standard ($7/mes)
- O usa un servicio de "ping" para mantener activo (no recomendado)

## 💰 Planes y Costos

### Starter (Gratis)
- ✅ Perfecto para desarrollo/testing
- ⚠️ Se "duerme" después de 15 minutos de inactividad
- ⚠️ Despierta en ~30 segundos al primer request
- ✅ 512 MB RAM
- ✅ 0.5 CPU

### Standard ($7/mes)
- ✅ Sin sleep - siempre activo
- ✅ Recomendado para producción
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Métricas avanzadas

### Pro ($25/mes)
- ✅ Más recursos (2 GB RAM, 1 CPU)
- ✅ Para aplicaciones de alto tráfico

**Recomendación**: Usa Starter para pruebas, Standard para producción.

## 🔒 Seguridad

### Variables Sensibles

- ✅ **NUNCA** commitees `.env` con secretos
- ✅ Usa **"Generate Value"** para JWT_SECRET en Render
- ✅ Rotate JWT_SECRET periódicamente en producción

### HTTPS

- ✅ Render proporciona HTTPS automáticamente
- ✅ Certificados SSL gestionados automáticamente
- ✅ Sin configuración adicional necesaria

## 📝 Ejemplo de Uso Post-Deploy

Una vez desplegado, actualiza tu cliente React:

```typescript
// En tu archivo .env de React
REACT_APP_API_URL=https://tu-app.onrender.com

// O hardcodeado (no recomendado)
const API_URL = 'https://tu-app.onrender.com';
```

### Ejemplo de Autenticación

```typescript
const { login, user } = useEther3Auth();

// La API está en Render
const response = await fetch('https://tu-app.onrender.com/auth/challenge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: userAddress }),
});
```

## 🎉 ¡Listo!

Tu API está desplegada y lista para usar. 

**URL de tu API**: `https://tu-app.onrender.com`

**Próximos pasos**:
1. Prueba los endpoints con curl o Postman
2. Integra con tu frontend React
3. Configura dominio personalizado (opcional)
4. Upgrade a plan Standard para producción

## 📞 Soporte

- [Render Docs](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Issues del Proyecto](https://github.com/tu-repo/issues)
