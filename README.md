# Aspersax API

Sistema para la gestión de robots aspersores de herbicida.

## ¿Qué es Aspersax?

Aspersax es una plataforma que permite controlar y monitorear robots que aplican herbicida de forma autónoma, diseñada específicamente para el control de la maleza **Romaza (*Rumex crispus*)** en la **Finca La Riverita**. El sistema incluye:

- Registro y seguimiento de robots aspersores asignados a la finca
- Control de tanques de herbicida e inventario
- Monitoreo de áreas/lotes con presencia de Romaza
- Programación de jornadas de trabajo por sectores
- Generación de reportes de aspersión y control
- Dashboard con estadísticas de operabilidad y efectividad
- **Landing Page informativa**: Presentación profesional del proyecto y su historia
- **Chatbot Asistente IA**: Integración con Gemini Flash para soporte técnico y consultas sobre el proyecto y la Finca La Riverita

## Objetivos del Proyecto

**Objetivo General:**
Desarrollar un sistema de información web integral para la gestión, control y monitoreo eficiente de robots aspersores de herbicida autónomos enfocados en la erradicación de la maleza Romaza (*Rumex crispus*) en la Finca La Riverita, optimizando los procesos agrícolas.

**Objetivos Específicos:**
- Implementar un módulo de control de inventario y estado para los robots y tanques de herbicida operativos en la finca.
- Desarrollar un sistema de registro por áreas/lotes para identificar zonas críticas de intervención de Romaza.
- Automatizar la programación y seguimiento de jornadas de aspersión específicas por sectores.
- Generar reportes y métricas estadísticas en tiempo real sobre la efectividad del control de maleza que faciliten la toma de decisiones.

## Tecnologías y Herramientas por Etapa del Ciclo de Vida

Para dar cumplimiento a las fases metodológicas del desarrollo del proyecto (compuesto por 8 módulos funcionales), se utilizaron las siguientes herramientas:

| Etapa del Ciclo de Vida | Herramientas y Tecnologías Utilizadas |
| :--- | :--- |
| **1. Planificación y Requisitos** | GitHub Projects, Notion (historias de usuario y requerimientos). |
| **2. Diseño (UI/UX y Datos)** | Figma (prototipado de interfaces), Draw.io (diagramas de BD). |
| **3. Desarrollo (Backend)** | Python, Django, Django REST Framework, SimpleJWT. |
| **4. Desarrollo (Frontend)** | React, TypeScript, Material UI, Vite, Axios, ExcelJS, JSPDF. |
| **5. Inteligencia Artificial** | Google AI Studio (Gemini Flash API). |
| **6. Base de Datos** | PostgreSQL. |
| **6. Pruebas (Testing)** | Postman (pruebas de API), React / Chrome DevTools. |
| **7. Control de Versiones** | Git, GitHub (evidencia de mejora continua en los commits). |

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

Para el funcionamiento del Chatbot, asegúrate de configurar la API Key de Gemini en `frontend/src/components/Chatbot.tsx` o mediante variables de entorno.

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

```text
Aspersax_api/
├── backend/
│   ├── aspersax_api/        # Configuración de Django
│   ├── authentication/      # Login, registro, JWT
│   ├── robots/              # CRUD de robots
│   ├── tanques/             # CRUD de tanques
│   ├── malezas/             # CRUD de áreas/lotes y Romaza
│   ├── jornadas/            # CRUD de jornadas
│   ├── reportes/            # Generación de reportes
│   ├── dashboard/           # Estadísticas
│   ├── emails/              # Envío de correos
│   └── stats/               # Métricas
├── frontend/
│   ├── public/
│   │   └── ai-landing/      # Landing page estática (HTML/CSS/JS)
│   └── src/
│       ├── components/      # Componentes reutilizables (incluye Chatbot)
│       ├── constants/       # Constantes y variables globales
│       ├── hooks/           # Custom hooks de React
│       ├── interfaces/      # Tipos de TypeScript
│       ├── pages/           # Páginas de la app (incluye LandingPage principal)
│       ├── services/        # Llamadas a la API
│       └── tests/           # Pruebas automatizadas
├── install.bat              # Script de instalación rápida (Windows)
├── install.sh               # Script de instalación rápida (Linux/Mac)
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
| GET | `/api/malezas/` | Listar áreas/lotes |
| POST | `/api/malezas/` | Registrar área/lote |
| PATCH | `/api/malezas/{id}/` | Actualizar área/lote |
| GET | `/api/jornadas/` | Listar jornadas |
| POST | `/api/jornadas/crear/` | Crear jornada |
| PATCH | `/api/jornadas/{id}/actualizar/` | Actualizar jornada |
| DELETE | `/api/jornadas/{id}/eliminar/` | Eliminar jornada |
| GET | `/api/dashboard/stats/` | Estadísticas del dashboard |
## Actividad Académica: Chatbot Multilingüe

Este proyecto incluye una implementación avanzada de un chatbot de Inteligencia Artificial como parte de la formación en Gestión del Conocimiento.

### 1. Integración de IA
Se ha integrado la API de **Gemini Flash** de Google para proporcionar asistencia técnica en tiempo real. El chatbot está configurado con un "System Prompt" que limita su conocimiento al dominio de Aspersax y la Finca La Riverita.

### 2. Bilingüismo (Español/Inglés)
El chatbot es capaz de procesar y responder consultas en ambos idiomas de forma fluida. Detecta automáticamente el idioma del usuario para mantener la coherencia en la conversación.

### 3. Declaración Persona Transhumana
Siguiendo los lineamientos institucionales, el chatbot integra la filosofía de la "Persona Transhumana":
*"Soy LIBRE, AUTÓNOMO Y RESPONSABLE a través del diálogo y la construcción, como ideal regulativo; me dirijo, controlo y dicto mis propias leyes."*

Esta declaración se encuentra presente en:
- El mensaje de bienvenida inicial.
- El marco ético de respuestas del modelo.

### 4. Tecnologías Utilizadas
- **Frontend:** React, Material UI.
- **IA:** Google Generative AI (Gemini Flash API).
- **Idioma:** TypeScript.
- **Despliegue:** Integrado en el Dashboard de Aspersax.

