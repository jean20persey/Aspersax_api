// Re-exportar robotsService desde api.ts para mantener compatibilidad
// con archivos que importan de este módulo (RobotsPageEnhanced, DashboardPage)
import { robotsService } from './api';

export default robotsService;