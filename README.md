# Aspersax API

Sistema de gestión de aspersores inteligentes para agricultura de precisión.

## Estructura del Proyecto

```
Aspersax_api-main/
├── backend/          # API Django REST Framework
├── frontend/         # Aplicación React + TypeScript
└── package.json      # Scripts principales del proyecto
```

## Tecnologías

### Backend
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT Authentication

### Frontend
- React 19
- TypeScript
- Material-UI
- Vite
- React Router

## Instalación

### Requisitos Previos
- Node.js 18+
- Python 3.8+
- PostgreSQL

### Instalación Completa
```bash
npm run install:all
```

### Instalación por Separado

#### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

#### Frontend
```bash
cd frontend
npm install
```

## Ejecución

### Desarrollo (Frontend + Backend)
```bash
npm run dev
```

### Solo Backend
```bash
npm run dev:backend
```

### Solo Frontend
```bash
npm run dev:frontend
```

### Producción
```bash
npm run build
npm start
```

## Características

- **Gestión de Robots**: Control y monitoreo de robots aspersores
- **Gestión de Tanques**: Control de niveles y tipos de herbicidas
- **Detección de Malezas**: Sistema de identificación automática
- **Reportes**: Generación de informes de operaciones
- **Dashboard**: Panel de control en tiempo real
- **Jornadas**: Programación de tareas de aspersión

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
