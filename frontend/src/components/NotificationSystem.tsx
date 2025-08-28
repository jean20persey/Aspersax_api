import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';
import { notificacionesService } from '../services/api';

interface Notification {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  leida: boolean;
  fecha_creacion: string;
  para_admin: boolean;
  para_usuario: boolean;
}

const NotificationSystem: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const userRole = usePermissions();

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const response = await notificacionesService.getAll();
      const notificacionesFiltradas = response.data.filter((notif: Notification) => {
        if (userRole?.isAdmin) {
          return notif.para_admin || notif.para_usuario;
        }
        return notif.para_usuario;
      });
      setNotifications(notificacionesFiltradas);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const marcarComoLeida = async (id: number) => {
    try {
      await notificacionesService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      await notificacionesService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      );
    } catch (error) {
      console.error('Error marcando todas las notificaciones como leídas:', error);
    }
  };

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case 'warning': return <WarningIcon color="warning" fontSize="small" />;
      case 'error': return <ErrorIcon color="error" fontSize="small" />;
      case 'success': return <SuccessIcon color="success" fontSize="small" />;
      default: return <InfoIcon color="info" fontSize="small" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.leida).length;
  const open = Boolean(anchorEl);

  // Notificaciones simuladas para demostración
  const notificacionesDemo: Notification[] = [
    {
      id: 1,
      titulo: 'Sistema Actualizado',
      mensaje: 'El sistema ha sido actualizado con nuevas funcionalidades',
      tipo: 'success',
      leida: false,
      fecha_creacion: new Date().toISOString(),
      para_admin: true,
      para_usuario: true
    },
    {
      id: 2,
      titulo: 'Mantenimiento Programado',
      mensaje: 'Mantenimiento del sistema programado para mañana a las 2:00 AM',
      tipo: 'warning',
      leida: false,
      fecha_creacion: new Date(Date.now() - 3600000).toISOString(),
      para_admin: true,
      para_usuario: true
    },
    {
      id: 3,
      titulo: 'Nuevo Usuario Registrado',
      mensaje: 'Un nuevo usuario se ha registrado y requiere aprobación',
      tipo: 'info',
      leida: true,
      fecha_creacion: new Date(Date.now() - 7200000).toISOString(),
      para_admin: true,
      para_usuario: false
    }
  ];

  const notificacionesParaMostrar = notifications.length > 0 ? notifications : notificacionesDemo;
  const notificacionesFiltradas = notificacionesParaMostrar.filter(notif => {
    if (userRole?.isAdmin) {
      return notif.para_admin || notif.para_usuario;
    }
    return notif.para_usuario;
  });

  const unreadCountFinal = notificacionesFiltradas.filter(n => !n.leida).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ color: 'white' }}
      >
        <Badge badgeContent={unreadCountFinal} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Notificaciones
            </Typography>
            <Chip 
              icon={userRole?.isAdmin ? <AdminIcon /> : <UserIcon />}
              label={userRole?.isAdmin ? 'Admin' : 'Usuario'}
              size="small"
              color={userRole?.isAdmin ? 'warning' : 'primary'}
            />
          </Box>
          {unreadCountFinal > 0 && (
            <Button 
              size="small" 
              onClick={marcarTodasComoLeidas}
              sx={{ mt: 1 }}
            >
              Marcar todas como leídas
            </Button>
          )}
        </Box>

        {notificacionesFiltradas.length === 0 ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No hay notificaciones
            </Typography>
          </MenuItem>
        ) : (
          <List sx={{ p: 0 }}>
            {notificacionesFiltradas.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  onClick={() => !notification.leida && marcarComoLeida(notification.id)}
                  sx={{
                    cursor: notification.leida ? 'default' : 'pointer',
                    backgroundColor: notification.leida ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
                    '&:hover': {
                      backgroundColor: notification.leida ? 'rgba(0, 0, 0, 0.04)' : 'rgba(25, 118, 210, 0.08)'
                    }
                  }}
                >
                  <ListItemIcon>
                    {getIconForType(notification.tipo)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.leida ? 400 : 600,
                            flex: 1
                          }}
                        >
                          {notification.titulo}
                        </Typography>
                        {!notification.leida && (
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              ml: 1,
                              flexShrink: 0
                            }} 
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.mensaje}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.fecha_creacion).toLocaleString()}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {notification.para_admin && (
                            <Chip 
                              label="Admin" 
                              size="small" 
                              variant="outlined"
                              color="warning"
                              sx={{ mr: 0.5, fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                          {notification.para_usuario && (
                            <Chip 
                              label="Usuario" 
                              size="small" 
                              variant="outlined"
                              color="primary"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notificacionesFiltradas.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}

        {notificacionesFiltradas.length > 0 && (
          <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
            <Button size="small" onClick={handleClose}>
              Ver todas las notificaciones
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationSystem;
