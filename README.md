# Ether3 - MetaMask Authentication API

API REST para autenticación usando MetaMask con soporte para ENS (Ethereum Name Service).

## Características

- ✅ Autenticación con MetaMask mediante firma de mensajes
- ✅ Resolución de nombres ENS y avatares
- ✅ Generación de tokens JWT para sesiones
- ✅ Validación de firmas Ethereum
- ✅ Estructura modular siguiendo mejores prácticas de NestJS
- ✅ Dockerizado y listo para producción
- ✅ CI/CD con GitHub Actions
- ✅ Health checks y monitoreo

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env y configurar JWT_SECRET y otros valores
```

## Configuración

Edita el archivo `.env` con tus configuraciones:

```env
PORT=3000
JWT_SECRET=tu-clave-secreta-aqui
JWT_EXPIRES_IN=7d
ETH_RPC_URL=https://eth.llamarpc.com
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints de la API

### 1. Solicitar Challenge

**POST** `/auth/challenge`

Solicita un mensaje challenge para que el usuario lo firme con MetaMask.

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "challenge": "Please sign this message to authenticate.\n\nAddress: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\nNonce: ...\nTimestamp: ..."
}
```

### 2. Verificar Firma y Autenticar

**POST** `/auth/verify`

Verifica la firma del challenge y retorna un token JWT junto con los datos del usuario (incluyendo ENS).

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x...",
  "challenge": "Please sign this message..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "ensName": "example.eth",
    "ensAvatar": "https://..."
  }
}
```

### 3. Obtener Perfil del Usuario Autenticado

**GET** `/auth/me`

Requiere autenticación JWT (header: `Authorization: Bearer <token>`).

**Response:**
```json
{
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
  "ensName": "example.eth",
  "ensAvatar": "https://..."
}
```

### 4. Obtener Perfil ENS de una Dirección

**GET** `/auth/ens/:address`

Obtiene el perfil ENS (nombre y avatar) de cualquier dirección Ethereum.

**Response:**
```json
{
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
  "ensName": "example.eth",
  "ensAvatar": "https://..."
}
```

### 5. Test Endpoint

**GET** `/auth/test`

Endpoint de prueba para verificar que el módulo funciona.

## Ejemplo de Uso con React

Ver `examples/react-auth-example.tsx` para un ejemplo completo de integración.

## 🚀 Deployment

### Opción 1: Docker (Recomendado)

```bash
# Windows
scripts\setup.bat
scripts\deploy.bat

# Linux/Mac
chmod +x scripts/*.sh
./scripts/setup.sh
./scripts/deploy.sh
```

### Opción 2: Development con Docker

```bash
# Windows
scripts\dev.bat

# Linux/Mac
./scripts/dev.sh
```

### Opción 3: Deploy a Render (Recomendado)

**Deployment rápido a Render:**

1. **Preparar repositorio en GitHub/GitLab**
2. **Crear cuenta en [Render](https://render.com)**
3. **Conectar repositorio y crear Web Service**
4. **Configurar JWT_SECRET** (Render puede generarlo automáticamente)
5. **Deploy automático** - Render detectará `render.yaml`

**Guía completa**: Ver [RENDER_DEPLOY.md](RENDER_DEPLOY.md)

**Otras opciones**:
- **Railway** - Ver [DEPLOYMENT.md](DEPLOYMENT.md)
- **Heroku** - Ver [DEPLOYMENT.md](DEPLOYMENT.md)
- **DigitalOcean** - Ver [DEPLOYMENT.md](DEPLOYMENT.md)
- **AWS/GCP** - Ver [DEPLOYMENT.md](DEPLOYMENT.md)

### Health Check

```bash
curl http://localhost:3000/health
```

## Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

## Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── controllers/        # Controladores REST
│   ├── services/           # Lógica de negocio
│   ├── dto/                # Data Transfer Objects
│   ├── guards/             # Guards de autenticación
│   ├── strategies/         # Estrategias Passport
│   └── auth.module.ts
├── common/                 # Módulo común
│   ├── config/            # Configuraciones
│   └── types/             # Tipos compartidos
└── main.ts                # Punto de entrada
```

## Tecnologías Utilizadas

- **NestJS** - Framework Node.js
- **ethers.js** - Interacción con Ethereum
- **JWT** - Autenticación basada en tokens
- **Passport** - Middleware de autenticación
- **TypeScript** - Lenguaje de programación
- **Docker** - Contenedorización
- **GitHub Actions** - CI/CD

## Notas Importantes

- Los challenges expiran después de 5 minutos
- La resolución de ENS solo funciona en Ethereum Mainnet (chainId: 1)
- Las direcciones Ethereum se normalizan a minúsculas
- El JWT_SECRET debe ser cambiado en producción
