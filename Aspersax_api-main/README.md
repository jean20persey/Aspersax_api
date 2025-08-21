# Aspersax API

API para la gestión y monitoreo de robots agrícolas, tanques, malezas y reportes en tiempo real.

## Descripción
Esta API permite administrar y consultar información sobre robots, tanques, malezas, jornadas y reportes, facilitando la automatización y el análisis de datos en sistemas agrícolas.

## Características principales
- Gestión de robots: estado, batería, actividad y mantenimiento.
- Monitoreo de tanques: niveles, capacidad y estado.
- Detección y registro de malezas.
- Panel de control en tiempo real.
- Reportes y estadísticas de uso.

## Estructura del proyecto
```
Aspersax_api-main/
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt
│   ├── ...
│   ├── authentication/
│   ├── dashboard/
│   ├── jornadas/
│   ├── malezas/
│   ├── reportes/
│   ├── robots/
│   ├── stats/
│   └── tanques/
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
├── README.md
└── ...
```

## Instalación

### Backend
1. Ve al directorio `backend`.
2. Instala dependencias:
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecuta migraciones:
   ```bash
   python manage.py migrate
   ```
4. Inicia el servidor:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Ve al directorio `frontend`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm run dev
   ```

## Uso
- Accede al panel web en `http://localhost:5173`.
- La API estará disponible en `http://localhost:8000`.

## Endpoints principales
- `/api/robots/` - Gestión y consulta de robots.
- `/api/tanques/` - Información de tanques.
- `/api/malezas/` - Registro de malezas.
- `/api/jornadas/` - Jornadas y actividades.
- `/api/reportes/` - Reportes y estadísticas.
- `/api/dashboard/` - Datos para el panel principal.

## Documentación de la API

### Robots
- **GET /api/robots/**
  - Obtiene la lista de robots registrados.
  - Respuesta:
    ```json
    [
      {
        "id_robot": 1,
        "nombre": "RoboFumigator 1000",
        "estado": "En Mantenimiento",
        "bateria": 75,
        "ultima_actividad": "2025-08-17T20:45:00Z"
      },
      ...
    ]
    ```
- **POST /api/robots/**
  - Crea un nuevo robot.
  - Parámetros: `nombre`, `estado`, `bateria`

### Tanques
- **GET /api/tanques/**
  - Obtiene la lista de tanques.
  - Respuesta:
    ```json
    [
      {
        "id_tanque": 1,
        "nombre": "Tanque Principal",
        "nivel_actual": 850,
        "capacidad": 1000,
        "estado": "Lleno"
      },
      ...
    ]
    ```
- **POST /api/tanques/**
  - Crea un nuevo tanque.
  - Parámetros: `nombre`, `nivel_actual`, `capacidad`, `estado`

### Malezas
- **GET /api/malezas/**
  - Lista de malezas detectadas.
  - Respuesta:
    ```json
    [
      {
        "id": 1,
        "tipo": "Hierba mala",
        "ubicacion": "Sector A",
        "fecha_detectada": "2025-08-17"
      },
      ...
    ]
    ```
- **POST /api/malezas/**
  - Registrar nueva maleza.
  - Parámetros: `tipo`, `ubicacion`, `fecha_detectada`

### Jornadas
- **GET /api/jornadas/**
  - Lista de jornadas y actividades realizadas.
- **POST /api/jornadas/**
  - Registrar nueva jornada.

### Reportes
- **GET /api/reportes/**
  - Obtiene reportes y estadísticas generales.

### Dashboard
- **GET /api/dashboard/**
  - Devuelve datos agregados para el panel principal.

---

Para más detalles sobre los parámetros y respuestas, consulta la documentación interna de cada módulo en el backend.

## Tecnologías utilizadas
- Backend: Django, Django REST Framework, SQLite
- Frontend: React, TypeScript, Material UI, Vite

