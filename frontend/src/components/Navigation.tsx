import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
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
  const theme = useTheme();

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
    <Box sx={{ height: '100%', bgcolor: theme.palette.primary.main, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/assets/favicon.svg" alt="Logo" style={{ width: 40, height: 40 }} />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: 'white',
            fontFamily: 'Arial Black, Arial Bold, Gadget, sans-serif',
            fontWeight: 900,
            letterSpacing: '0.5px'
          }}
        >
          ASPERSAX
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: '#45b939',
                },
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: '#45b939',
                },
              },
              color: 'white',
              borderRadius: 1,
              mx: 1,
              width: 'calc(100% - 16px)',
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? '#45b939' : '#45b939',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  color: 'white',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.08)',
            },
            borderRadius: 1,
            mx: 1,
            width: 'calc(100% - 16px)',
            mb: 2,
          }}
        >
          <ListItemIcon sx={{ color: '#ff4444', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar Sesión"
            sx={{
              '& .MuiListItemText-primary': {
                color: 'white',
              },
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  );
};

export default Navigation; 