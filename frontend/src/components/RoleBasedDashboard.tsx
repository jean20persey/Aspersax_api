import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Alert } from '@mui/material';
import { 
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Security as SecurityIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';
import ProtectedComponent from './ProtectedComponent';

const AdminDashboard: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Alert severity="info" icon={<AdminIcon />}>
      <Typography variant="h6" gutterBottom>
        Panel de Administrador
      </Typography>
      <Typography variant="body2">
        Tienes acceso completo al sistema. Puedes gestionar usuarios, configurar robots y supervisar todas las operaciones.
      </Typography>
    </Alert>
    
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Card sx={{ 
        flex: 1,
        minWidth: 300,
        background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
        color: 'white'
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Permisos Administrativos</Typography>
          </Box>
          <Typography variant="body2">
            • Gestión completa de usuarios<br/>
            • Control de robots y tanques<br/>
            • Configuración del sistema<br/>
            • Acceso a logs y auditoría
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Chip 
              label="Crear Nueva Jornada" 
              color="primary" 
              clickable 
              size="small"
            />
            <Chip 
              label="Gestionar Usuarios" 
              color="secondary" 
              clickable 
              size="small"
            />
            <Chip 
              label="Configurar Robots" 
              color="info" 
              clickable 
              size="small"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Alertas del Sistema
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Alert severity="warning">
              3 usuarios pendientes de aprobación
            </Alert>
            <Alert severity="success">
              Todos los robots operativos
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

const UserDashboard: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Alert severity="info" icon={<UserIcon />}>
      <Typography variant="h6" gutterBottom>
        Panel de Usuario
      </Typography>
      <Typography variant="body2">
        Bienvenido al sistema Aspersax. Puedes consultar información y generar reportes de tu actividad.
      </Typography>
    </Alert>
    
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ViewIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Tus Permisos</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            • Visualizar robots y tanques<br/>
            • Consultar jornadas asignadas<br/>
            • Ver detección de malezas<br/>
            • Generar reportes básicos<br/>
            • Editar tu perfil personal
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actividad Reciente
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SuccessIcon color="success" fontSize="small" />
              <Typography variant="body2">
                Jornada completada - Sector A
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" fontSize="small" />
              <Typography variant="body2">
                Maleza detectada - Sector B
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>

    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Información Importante
        </Typography>
        <Alert severity="info">
          Para solicitar permisos adicionales o reportar problemas, contacta a tu administrador.
        </Alert>
      </CardContent>
    </Card>
  </Box>
);

const RoleBasedDashboard: React.FC = () => {
  const userRole = usePermissions();

  if (!userRole) {
    return <Typography>Cargando permisos...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard - {userRole.isAdmin ? 'Administrador' : 'Usuario'}
      </Typography>
      
      <ProtectedComponent requiredRole="admin" showFallback={false}>
        <AdminDashboard />
      </ProtectedComponent>
      
      <ProtectedComponent requiredRole="viewer" showFallback={false}>
        <UserDashboard />
      </ProtectedComponent>
    </Box>
  );
};

export default RoleBasedDashboard;
