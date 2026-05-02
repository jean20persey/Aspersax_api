# Aspersax API

Sistema para la gestión de robots aspersores de herbicida. Proyecto desarrollado para la materia de Sistemas de Información.

## ¿Qué es Aspersax?

Aspersax es una plataforma web que permite controlar y monitorear robots que aplican herbicida de forma autónoma en cultivos. El sistema incluye:

- Registro y seguimiento de robots aspersores
- Control de tanques de herbicida
- Registro de malezas detectadas
- Programación de jornadas de trabajo
- Generación de reportes
- Dashboard con estadísticas

## Tecnologías usadas

**Backend:**
- Python con Django y Django REST Framework
- PostgreSQL como base de datos
- Autenticación con JWT (SimpleJWT)

**Frontend:**
- React con TypeScript
- Material UI para los componentes
- Vite como bundler
- Axios para las peticiones HTTP

## Requisitos

- Python 3.8 o superior
- Node.js 18 o superior
- PostgreSQL
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jean20persey/Aspersax_api.git
cd Aspersax_api
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # En Windows
# source .venv/bin/activate   # En Linux/Mac

pip install -r requirements.txt
```

Crear el archivo `.env` en la carpeta `backend/` con las siguientes variables:

```
SECRET_KEY=tu_clave_secreta
DEBUG=True
DB_NAME=aspersax_db
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
```

Luego correr las migraciones:

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 3. Frontend

```bash
cd frontend
npm install
```

## Cómo ejecutar

Abrir dos terminales:

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend corre en `http://localhost:3000` y el backend en `http://localhost:8000`.

## Estructura del proyecto

```
Aspersax_api/
├── backend/
│   ├── aspersax_api/        # Configuración de Django
│   ├── authentication/      # Login, registro, JWT
│   ├── robots/              # CRUD de robots
│   ├── tanques/             # CRUD de tanques
│   ├── malezas/             # CRUD de malezas
│   ├── jornadas/            # CRUD de jornadas
│   ├── reportes/            # Generación de reportes
│   ├── dashboard/           # Estadísticas
│   ├── emails/              # Envío de correos
│   └── stats/               # Métricas
├── frontend/
│   └── src/
│       ├── components/      # Componentes reutilizables
│       ├── pages/           # Páginas de la app
│       ├── services/        # Llamadas a la API
│       └── interfaces/      # Tipos de TypeScript
└── README.md
```

## Endpoints principales de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/token/` | Obtener token JWT |
| POST | `/api/token/refresh/` | Refrescar token |
| GET | `/api/robots/` | Listar robots |
| POST | `/api/robots/crear/` | Crear robot |
| PATCH | `/api/robots/{id}/actualizar/` | Actualizar robot |
| DELETE | `/api/robots/{id}/eliminar/` | Eliminar robot |
| GET | `/api/tanques/` | Listar tanques |
| POST | `/api/tanques/` | Crear tanque |
| PATCH | `/api/tanques/{id}/` | Actualizar tanque |
| DELETE | `/api/tanques/{id}/` | Eliminar tanque |
| GET | `/api/malezas/` | Listar malezas |
| POST | `/api/malezas/` | Crear maleza |
| PATCH | `/api/malezas/{id}/` | Actualizar maleza |
| GET | `/api/jornadas/` | Listar jornadas |
| POST | `/api/jornadas/crear/` | Crear jornada |
| PATCH | `/api/jornadas/{id}/actualizar/` | Actualizar jornada |
| DELETE | `/api/jornadas/{id}/eliminar/` | Eliminar jornada |
| GET | `/api/dashboard/stats/` | Estadísticas del dashboard |
| GET | `/api/reportes/` | Listar reportes |

## Autores

Proyecto desarrollado como parte de la materia Sistemas de Información - Sexto Semestre.
