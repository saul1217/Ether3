# ✅ Checklist de Deployment en Render

Usa esta checklist para asegurarte de que todo esté configurado correctamente.

## 📋 Pre-Deployment

- [ ] Código está en GitHub/GitLab/Bitbucket
- [ ] Repositorio es público o Render tiene acceso
- [ ] `render.yaml` está en la raíz del repositorio
- [ ] `package.json` tiene todos los scripts necesarios
- [ ] `.env` está en `.gitignore` (no commiteado)

## 🔧 Configuración en Render

### Paso 1: Crear Servicio

- [ ] Cuenta creada en [Render.com](https://render.com)
- [ ] Repositorio conectado a Render
- [ ] Web Service creado
- [ ] `render.yaml` detectado automáticamente

### Paso 2: Variables de Entorno

- [ ] `JWT_SECRET` configurado (usa "Generate Value" en Render)
  ```bash
  # O genera manualmente:
  openssl rand -base64 32
  ```
- [ ] `NODE_ENV=production` (puede estar en render.yaml)
- [ ] `JWT_EXPIRES_IN=7d` (opcional, por defecto 7d)
- [ ] `ETH_RPC_URL` configurado si necesitas uno diferente

**Nota**: `PORT` es asignado automáticamente por Render, NO lo configures.

### Paso 3: Verificar Configuración

- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm run start:prod`
- [ ] **Health Check Path**: `/health`
- [ ] **Auto-Deploy**: Habilitado (recomendado)

## 🚀 Deployment

- [ ] Click en "Create Web Service"
- [ ] Build completado exitosamente
- [ ] Servicio iniciado correctamente
- [ ] Health check pasa (`/health` responde)

## ✅ Post-Deployment

### Verificación de Endpoints

- [ ] **Health Check** funciona:
  ```bash
  curl https://tu-app.onrender.com/health
  ```
  Esperado: `{"status":"ok","timestamp":"..."}`

- [ ] **Test Endpoint** funciona:
  ```bash
  curl https://tu-app.onrender.com/auth/test
  ```
  Esperado: `{"status":"ok","message":"Auth module is working"}`

- [ ] **Challenge Endpoint** funciona:
  ```bash
  curl -X POST https://tu-app.onrender.com/auth/challenge \
    -H "Content-Type: application/json" \
    -d '{"address":"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
  ```
  Esperado: `{"challenge":"Please sign..."}`

### Integración con Frontend

- [ ] Actualizar URL de API en frontend:
  ```typescript
  const API_URL = 'https://tu-app.onrender.com';
  ```

- [ ] Probar autenticación completa:
  - [ ] Solicitar challenge
  - [ ] Firmar con MetaMask
  - [ ] Verificar firma y obtener token
  - [ ] Acceder a endpoint protegido con token

## 🔍 Troubleshooting

Si algo falla, verifica:

- [ ] **Build falla**: Revisa logs, verifica que `npm run build` funcione localmente
- [ ] **App no inicia**: Verifica variables de entorno, especialmente `JWT_SECRET`
- [ ] **Health check falla**: Revisa logs para errores de inicio
- [ ] **404 en endpoints**: Verifica que la app esté corriendo (revisa logs)

## 📊 Monitoreo

- [ ] Logs accesibles en Render Dashboard
- [ ] Health check configurado y funcionando
- [ ] Alertas configuradas (opcional, plan Standard+)

## 🔒 Seguridad

- [ ] `JWT_SECRET` es fuerte y único
- [ ] Variables sensibles NO están commiteadas
- [ ] HTTPS funciona automáticamente (Render lo proporciona)

## 🎉 ¡Listo!

Tu API está desplegada y funcionando en:
```
https://tu-app.onrender.com
```

**Próximos pasos opcionales:**
- [ ] Configurar dominio personalizado
- [ ] Upgrade a plan Standard ($7/mes) para evitar sleep
- [ ] Configurar alertas y monitoreo
- [ ] Setup CI/CD para auto-deploy
