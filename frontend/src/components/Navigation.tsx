import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GrassIcon from '@mui/icons-material/Grass';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import authService from '../services/authService';
import { useState, useEffect } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import NotificationSystem from './NotificationSystem';

const drawerWidth = 240;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [perfilUsuario, setPerfilUsuario] = useState<any>(null);
  const userRole = usePermissions();

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfil = await authService.obtenerPerfil();
        setPerfilUsuario(perfil);
      } catch (error) {
        console.error('Error cargando perfil:', error);
      }
    };
    cargarPerfil();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      { 
        text: 'Dashboard', 
        icon: <DashboardIcon />, 
        path: '/dashboard',
        permission: 'canViewDashboard' as const
      },
    ];

    const userItems = [
      { 
        text: 'Robots', 
        icon: <SmartToyIcon />, 
        path: '/robots',
        permission: 'canControlRobots' as const
      },
      { 
        text: 'Tanques', 
        icon: <WaterDropIcon />, 
        path: '/tanques',
        permission: 'canManageTanques' as const
      },
      { 
        text: 'Jornadas', 
        icon: <CalendarTodayIcon />, 
        path: '/jornadas',
        permission: 'canCreateJornadas' as const
      },
      { 
        text: 'Malezas', 
        icon: <GrassIcon />, 
        path: '/malezas',
        permission: 'canManageMalezas' as const
      },
      { 
        text: 'Reportes', 
        icon: <AssessmentIcon />, 
        path: '/reportes',
        permission: 'canViewReports' as const
      },
    ];

    const adminItems = [
      { 
        text: 'Usuarios', 
        icon: <PeopleIcon />, 
        path: '/usuarios',
        permission: 'canManageUsers' as const
      },
    ];

    return [...baseItems, ...userItems, ...adminItems];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(135deg, #1a9f0b 0%, #0f6b08 100%)',
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        pointerEvents: 'none'
      }
    }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <GrassIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: 'white',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 800,
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          ASPERSAX
        </Typography>
      </Box>
      <List sx={{ py: 2, pb: 12 }}>
        {menuItems.map((item) => {
          // Verificar permisos - Debug mejorado
          if (item.permission && userRole) {
            console.log(`Verificando permiso ${item.permission} para ${item.text}:`, userRole.permissions[item.permission]);
            if (!userRole.permissions[item.permission]) {
              console.log(`Ocultando ${item.text} - sin permiso ${item.permission}`);
              return null;
            }
          }

          const isSelected = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                color: 'white',
                mx: 2,
                mb: 1,
                borderRadius: '12px',
                background: isSelected 
                  ? 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                  : 'transparent',
                '&:hover': {
                  background: isSelected 
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)'
                    : 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  transform: 'translateX(4px)',
                  '& .MuiListItemIcon-root': {
                    transform: 'scale(1.1)',
                    color: isSelected ? 'white' : '#2DFFF5'
                  }
                },
                py: 1.5,
                px: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isSelected ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
              }}
            >
              <ListItemIcon sx={{ 
                color: isSelected ? 'white' : '#e8f5e8', 
                minWidth: 48,
                transition: 'all 0.3s ease',
                '& svg': {
                  fontSize: 24,
                  filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: 'white',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '15px',
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '0.5px',
                    textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Área de perfil y logout - posición fija en la parte inferior */}
      <Box sx={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 1.5, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        background: 'linear-gradient(135deg, #1a9f0b 0%, #0f6b08 100%)',
        zIndex: 10
      }}>
        {/* Fila superior: Notificaciones */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <NotificationSystem />
        </Box>
        
        {/* Fila inferior: Info del usuario y logout */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {/* Info del usuario expandida - clickeable para ir al perfil */}
          {perfilUsuario && (
            <Box 
              onClick={() => navigate('/perfil')}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: 1,
                minWidth: 0,
                p: 1,
                borderRadius: 2,
                background: userRole?.isAdmin 
                  ? 'rgba(255, 193, 7, 0.12)'
                  : 'rgba(33, 150, 243, 0.12)',
                border: `1px solid ${userRole?.isAdmin ? 'rgba(255, 193, 7, 0.2)' : 'rgba(33, 150, 243, 0.2)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: userRole?.isAdmin 
                    ? 'rgba(255, 193, 7, 0.2)'
                    : 'rgba(33, 150, 243, 0.2)',
                  transform: 'scale(1.02)',
                }
              }}>
              {userRole?.isAdmin ? (
                <AdminPanelSettingsIcon sx={{ color: '#ffc107', fontSize: 18 }} />
              ) : (
                <PersonIcon sx={{ color: '#2196f3', fontSize: 18 }} />
              )}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: '11px',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2
                }}>
                  {perfilUsuario ? (perfilUsuario.first_name || perfilUsuario.username).substring(0, 12) : ''}
                </Typography>
                <Typography sx={{ 
                  color: userRole?.isAdmin ? '#ffc107' : '#2196f3', 
                  fontSize: '9px',
                  fontWeight: 500,
                  lineHeight: 1.2
                }}>
                  {userRole?.isAdmin ? 'Administrador' : 'Usuario'}
                </Typography>
              </Box>
            </Box>
          )}
          
          {/* Botón de logout mejorado */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: 'white',
              '&:hover': {
                background: 'rgba(255,68,68,0.2)',
                transform: 'scale(1.05)',
                '& .MuiSvgIcon-root': {
                  color: '#ff4444'
                }
              },
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: '12px',
              p: 1,
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          border: 'none',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  );
};

export default Navigation; 