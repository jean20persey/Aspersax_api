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
import authService from '../services/authService';

const drawerWidth = 240;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Robots', icon: <SmartToyIcon />, path: '/robots' },
    { text: 'Tanques', icon: <WaterDropIcon />, path: '/tanques' },
    { text: 'Jornadas', icon: <CalendarTodayIcon />, path: '/jornadas' },
    { text: 'Malezas', icon: <GrassIcon />, path: '/malezas' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
  ];

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
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
          return (
            <ListItemButton
              key={item.text}
              onClick={() => navigate(item.path === '/' ? '/dashboard' : item.path)}
              selected={isSelected}
              sx={{
                '&.Mui-selected': {
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
                  color: 'white',
                  borderLeft: '4px solid #45b939',
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '& .MuiListItemIcon-root': {
                    color: '#45b939',
                    transform: 'scale(1.1)',
                  },
                  '&:hover': {
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 100%)',
                    transform: 'translateX(6px)',
                  },
                },
                '&:hover': {
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                  color: 'white',
                  transform: 'translateX(2px)',
                  '& .MuiListItemIcon-root': {
                    color: '#45b939',
                    transform: 'scale(1.05)',
                  },
                },
                color: 'rgba(255,255,255,0.9)',
                borderRadius: '0 25px 25px 0',
                mx: 0,
                my: 0.5,
                mr: 2,
                py: 1.5,
                px: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: isSelected ? '60%' : '0%',
                  background: '#45b939',
                  borderRadius: '0 3px 3px 0',
                  transition: 'height 0.3s ease'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: isSelected ? '#45b939' : 'rgba(255,255,255,0.7)',
                  minWidth: 48,
                  transition: 'all 0.3s ease',
                  '& svg': {
                    fontSize: 24,
                    filter: isSelected ? 'drop-shadow(0 2px 4px rgba(69,185,57,0.3))' : 'none'
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'white' : 'rgba(255,255,255,0.9)',
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
      <Box sx={{ 
        mt: 'auto',
        p: 2,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.1)'
      }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(90deg, rgba(255,68,68,0.2) 0%, rgba(255,68,68,0.1) 100%)',
              transform: 'translateX(2px)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
                color: '#ff6b6b'
              }
            },
            borderRadius: '12px',
            py: 1.5,
            px: 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255, 68, 68, 0.3)'
          }}
        >
          <ListItemIcon sx={{ 
            color: '#ff4444', 
            minWidth: 48,
            transition: 'all 0.3s ease',
            '& svg': {
              fontSize: 22
            }
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar Sesión"
            sx={{
              '& .MuiListItemText-primary': {
                color: 'white',
                fontWeight: 500,
                fontSize: '15px',
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '0.5px'
              },
            }}
          />
        </ListItemButton>
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