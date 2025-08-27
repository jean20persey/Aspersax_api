# 🌱 Aspersax API

<div align="center">

![Aspersax Logo](https://img.shields.io/badge/ASPERSAX-Sistema%20Agr%C3%ADcola%20Inteligente-1a9f0b?style=for-the-badge&logo=agriculture)

**Sistema de gestión de aspersores inteligentes para agricultura de precisión**

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=flat&logo=django)](https://djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-007FFF?style=flat&logo=mui)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📋 Tabla de Contenidos

- [🚀 Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [⚙️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [🔧 Configuración](#-configuración)
- [▶️ Ejecución](#️-ejecución)
- [📚 API Endpoints](#-api-endpoints)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

---

## 🚀 Características

### 🤖 **Gestión de Robots**
- Control y monitoreo en tiempo real de robots aspersores
- Seguimiento de estado de batería y ubicación
- Programación de rutas automáticas

### 🪣 **Gestión de Tanques**
- Control de niveles de herbicidas y fertilizantes
- Monitoreo de capacidad y tipos de químicos
- Alertas de reabastecimiento automático

### 🌿 **Detección de Malezas**
- Sistema de identificación automática con IA
- Base de datos de especies de malezas
- Mapeo de áreas afectadas

### 📊 **Reportes y Analytics**
- Generación de informes detallados de operaciones
- Exportación a PDF y Excel
- Envío automático por email
- Análisis de eficiencia y productividad

### 📈 **Dashboard Inteligente**
- Panel de control en tiempo real
- Métricas y KPIs agrícolas
- Visualización de datos interactiva

### 📅 **Gestión de Jornadas**
- Programación de tareas de aspersión
- Calendario de actividades agrícolas
- Asignación de recursos optimizada

---

## 🏗️ Arquitectura

```
Aspersax_api-main/
├── 🔧 backend/                    # API Django REST Framework
│   ├── aspersax_api/             # Configuración principal
│   ├── authentication/           # Sistema de autenticación JWT
│   ├── robots/                   # Gestión de robots aspersores
│   ├── tanques/                  # Control de tanques
│   ├── malezas/                  # Detección de malezas
│   ├── jornadas/                 # Programación de tareas
│   ├── reportes/                 # Generación de reportes
│   ├── emails/                   # Sistema de notificaciones
│   ├── dashboard/                # Métricas y estadísticas
│   └── stats/                    # Analytics avanzados
├── 🎨 frontend/                   # Aplicación React + TypeScript
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   ├── pages/               # Páginas de la aplicación
│   │   ├── services/            # Servicios API
│   │   └── interfaces/          # Tipos TypeScript
│   └── public/                  # Recursos estáticos
├── 📦 package.json              # Scripts principales
├── 🔒 .gitignore               # Archivos ignorados
└── 📖 README.md                # Documentación
```

---

## ⚙️ Tecnologías

### 🔧 **Backend**
- **Django 5.2** - Framework web robusto
- **Django REST Framework** - API REST potente
- **SQLite** - Base de datos ligera para desarrollo
- **JWT Authentication** - Autenticación segura
- **CORS Headers** - Comunicación cross-origin
- **Email Backend** - Sistema de notificaciones

### 🎨 **Frontend**
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - JavaScript tipado
- **Material-UI (MUI)** - Componentes de diseño
- **Vite** - Build tool rápido
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP

### 🛠️ **Herramientas de Desarrollo**
- **Concurrently** - Ejecución paralela de procesos
- **ESLint** - Linting de código
- **Git** - Control de versiones

---

## 📦 Instalación

### 📋 **Requisitos Previos**
- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Python** 3.8+ ([Descargar](https://python.org/))
- **Git** ([Descargar](https://git-scm.com/))

### ⚡ **Instalación Rápida**

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/jean20persey/Aspersax_api.git
   cd Aspersax_api
   ```

2. **Instalación automática de todas las dependencias**
   ```bash
   npm run install:all
   ```

### 🔧 **Instalación Manual**

#### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Crear usuario administrador
```

#### Frontend (React)
```bash
cd frontend
npm install
```

---

## 🔧 Configuración

### 🌐 **Variables de Entorno**

#### Backend (`backend/.env`)
```env
SECRET_KEY=tu_clave_secreta_aqui
DEBUG=True
EMAIL_HOST_USER=aspersaxapi@gmail.com
EMAIL_HOST_PASSWORD=tu_app_password_gmail
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

### 📧 **Configuración de Email**
El sistema está configurado para enviar emails usando Gmail:
- **Email:** aspersaxapi@gmail.com
- **Configuración SMTP** ya incluida
- Genera un **App Password** en tu cuenta Gmail para mayor seguridad

---

## ▶️ Ejecución

### 🚀 **Desarrollo (Recomendado)**
```bash
# Ejecutar frontend y backend simultáneamente
npm run dev
```

**URLs de acceso:**
- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:8000
- **Admin Django:** http://localhost:8000/admin

### 🔧 **Ejecución Individual**

#### Solo Backend
```bash
npm run dev:backend
# o
cd backend && python manage.py runserver
```

#### Solo Frontend
```bash
npm run dev:frontend
# o
cd frontend && npm run dev
```

### 🏭 **Producción**
```bash
npm run build    # Construir frontend
npm start        # Ejecutar backend
```

---

## 📚 API Endpoints

### 🔐 **Autenticación**
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/register/` - Registrar usuario
- `POST /api/auth/refresh/` - Renovar token

### 🤖 **Robots**
- `GET /api/robots/` - Listar robots
- `POST /api/robots/` - Crear robot
- `PUT /api/robots/{id}/` - Actualizar robot
- `DELETE /api/robots/{id}/` - Eliminar robot

### 🪣 **Tanques**
- `GET /api/tanques/` - Listar tanques
- `POST /api/tanques/` - Crear tanque
- `PUT /api/tanques/{id}/` - Actualizar tanque

### 🌿 **Malezas**
- `GET /api/malezas/` - Listar malezas detectadas
- `POST /api/malezas/` - Registrar detección

### 📊 **Reportes**
- `GET /api/reportes/` - Listar reportes
- `POST /api/reportes/generar/` - Generar reporte
- `POST /api/emails/enviar/` - Enviar reporte por email

### 📈 **Dashboard**
- `GET /api/dashboard/stats/` - Estadísticas generales
- `GET /api/stats/` - Métricas avanzadas

---

## 🎯 **Funcionalidades Destacadas**

### ✨ **Sistema de Autenticación**
- Login/registro con validación
- Protección de rutas con JWT
- Recuperación de contraseña

### 📊 **Dashboard Interactivo**
- Métricas en tiempo real
- Gráficos y visualizaciones
- Resumen de operaciones

### 📧 **Sistema de Notificaciones**
- Envío automático de reportes
- Notificaciones por email
- Alertas de sistema

### 📱 **Interfaz Responsive**
- Diseño adaptable a móviles
- Componentes Material-UI
- Experiencia de usuario optimizada

---

## 🤝 Contribución

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo de Desarrollo

**Aspersax Team** - *Desarrollo inicial*

---

## 📞 Soporte

¿Tienes preguntas o necesitas ayuda?

- 📧 **Email:** aspersaxapi@gmail.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/jean20persey/Aspersax_api/issues)
- 📖 **Wiki:** [Documentación completa](https://github.com/jean20persey/Aspersax_api/wiki)

---




