import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  useTheme,
  SvgIcon,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import TerrainIcon from '@mui/icons-material/Terrain';

interface StatCardProps {
  title: string;
  value: string;
  icon: typeof SvgIcon;
  color: string;
  subtitle?: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle, progress }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          <Icon sx={{ color }} />
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" gutterBottom>
        {value}
      </Typography>
      {progress !== undefined && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: `${color}20`,
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
          />
        </Box>
      )}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  stats: {
    total_robots: number;
    robots_activos: number;
    total_tanques: number;
    tanques_en_uso: number;
    total_malezas: number;
    malezas_detectadas: number;
    area_cubierta: number;
    herbicida_usado: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          title="Robots Activos"
          value={`${stats.robots_activos}/${stats.total_robots}`}
          icon={SmartToyIcon}
          color={theme.palette.primary.main}
          subtitle="Robots en operación"
          progress={(stats.robots_activos / stats.total_robots) * 100}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          title="Tanques en Uso"
          value={`${stats.tanques_en_uso}/${stats.total_tanques}`}
          icon={WaterDropIcon}
          color={theme.palette.info.main}
          subtitle="Tanques activos"
          progress={(stats.tanques_en_uso / stats.total_tanques) * 100}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          title="Malezas Detectadas"
          value={stats.malezas_detectadas.toString()}
          icon={GrassIcon}
          color={theme.palette.success.main}
          subtitle={`Total histórico: ${stats.total_malezas}`}
        />
      </Grid>
      <Grid xs={12} sm={6} md={3}>
        <StatCard
          title="Área Cubierta"
          value={`${stats.area_cubierta} m²`}
          icon={TerrainIcon}
          color={theme.palette.warning.main}
          subtitle={`Herbicida usado: ${stats.herbicida_usado}L`}
        />
      </Grid>
    </Grid>
  );
};

export default DashboardStats; 