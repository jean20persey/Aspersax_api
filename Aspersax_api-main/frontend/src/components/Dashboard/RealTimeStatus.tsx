import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

interface RobotStatus {
  id: number;
  nombre: string;
  bateria: number;
  estado: string;
}

interface TankStatus {
  id: number;
  nombre: string;
  nivel: number;
  estado: string;
}

interface RealTimeStatusProps {
  robots: RobotStatus[];
  tanks: TankStatus[];
}

const getStatusColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'activo':
    case 'en_uso':
      return 'success';
    case 'inactivo':
    case 'disponible':
      return 'warning';
    case 'cargando':
    case 'mantenimiento':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusText = (estado: string) => {
  return estado.replace('_', ' ').charAt(0).toUpperCase() + estado.slice(1);
};

const RealTimeStatus: React.FC<RealTimeStatusProps> = ({ robots, tanks }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {/* Robots Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estado de Robots
            </Typography>
            <Box sx={{ mt: 2 }}>
              {robots.map((robot) => (
                <Box
                  key={robot.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">{robot.nombre}</Typography>
                    <Chip
                      label={getStatusText(robot.estado)}
                      color={getStatusColor(robot.estado)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BatteryFullIcon
                      sx={{
                        mr: 1,
                        color:
                          robot.bateria > 60
                            ? theme.palette.success.main
                            : robot.bateria > 20
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={robot.bateria}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                              robot.bateria > 60
                                ? theme.palette.success.main
                                : robot.bateria > 20
                                ? theme.palette.warning.main
                                : theme.palette.error.main,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {robot.bateria}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Tanks Status */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estado de Tanques
            </Typography>
            <Box sx={{ mt: 2 }}>
              {tanks.map((tank) => (
                <Box
                  key={tank.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">{tank.nombre}</Typography>
                    <Chip
                      label={getStatusText(tank.estado)}
                      color={getStatusColor(tank.estado)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WaterDropIcon
                      sx={{
                        mr: 1,
                        color:
                          tank.nivel > 60
                            ? theme.palette.info.main
                            : tank.nivel > 20
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={tank.nivel}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor:
                              tank.nivel > 60
                                ? theme.palette.info.main
                                : tank.nivel > 20
                                ? theme.palette.warning.main
                                : theme.palette.error.main,
                          },
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {tank.nivel}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default RealTimeStatus; 