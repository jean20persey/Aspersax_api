import React from 'react';
import {
<<<<<<< HEAD
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
=======
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Chip,
    useTheme,
    Tooltip,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Speed,
    BatteryChargingFull,
    BatteryAlert,
    WaterDrop,
    Grass,
    Terrain,
    SmartToy,
    Warning,
} from '@mui/icons-material';

interface DashboardStats {
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    total_robots: number;
    robots_activos: number;
    total_tanques: number;
    tanques_en_uso: number;
    total_malezas: number;
    malezas_detectadas: number;
    area_cubierta: number;
    herbicida_usado: number;
<<<<<<< HEAD
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
=======
    eficiencia_robots?: number;
    eficiencia_tanques?: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    progress?: number;
    status?: 'success' | 'warning' | 'error' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color,
    trend,
    trendValue,
    progress,
    status = 'info',
}) => {
    const theme = useTheme();

    const getStatusColor = () => {
        switch (status) {
            case 'success': return theme.palette.success.main;
            case 'warning': return theme.palette.warning.main;
            case 'error': return theme.palette.error.main;
            default: return theme.palette.info.main;
        }
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} />;
        if (trend === 'down') return <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 16 }} />;
        return null;
    };

    return (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                        sx={{
                            backgroundColor: `${color}15`,
                            borderRadius: 2,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box sx={{ color }}>{icon}</Box>
                    </Box>
                    {trend && (
                        <Tooltip title={`${trend === 'up' ? 'Incremento' : 'Decremento'} ${trendValue}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getTrendIcon()}
                                <Typography variant="caption" color="text.secondary">
                                    {trendValue}
                                </Typography>
                            </Box>
                        </Tooltip>
                    )}
                </Box>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {value}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>

                {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}

                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Progreso
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {progress}%
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: `${color}20`,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: color,
                                    borderRadius: 3,
                                },
                            }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

const DashboardStats: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
    const theme = useTheme();

    // Usar los valores de eficiencia del backend si están disponibles, sino calcularlos
    const robotEfficiency = stats.eficiencia_robots || (stats.total_robots > 0 ? (stats.robots_activos / stats.total_robots) * 100 : 0);
    const tankEfficiency = stats.eficiencia_tanques || (stats.total_tanques > 0 ? (stats.tanques_en_uso / stats.total_tanques) * 100 : 0);
    const herbicidaEfficiency = stats.eficiencia_herbicida || 0;
    const productividadGeneral = stats.productividad_general || ((robotEfficiency + tankEfficiency) / 2);

    return (
        <Grid container spacing={3}>
            {/* Robots */}
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Robots Activos"
                    value={`${stats.robots_activos}/${stats.total_robots}`}
                    subtitle="En operación"
                    icon={<SmartToy />}
                    color={theme.palette.primary.main}
                    progress={robotEfficiency}
                    status={robotEfficiency > 80 ? 'success' : robotEfficiency > 50 ? 'warning' : 'error'}
                    trend={robotEfficiency > 70 ? 'up' : 'down'}
                    trendValue={`${robotEfficiency.toFixed(1)}% eficiencia`}
                />
            </Grid>

            {/* Tanques */}
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Tanques en Uso"
                    value={`${stats.tanques_en_uso}/${stats.total_tanques}`}
                    subtitle="Con herbicida"
                    icon={<WaterDrop />}
                    color={theme.palette.info.main}
                    progress={tankEfficiency}
                    status={tankEfficiency > 60 ? 'success' : tankEfficiency > 30 ? 'warning' : 'error'}
                    trend={tankEfficiency > 50 ? 'up' : 'down'}
                    trendValue={`${tankEfficiency.toFixed(1)}% ocupación`}
                />
            </Grid>

            {/* Malezas */}
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Malezas Detectadas"
                    value={stats.malezas_detectadas}
                    subtitle="En el período"
                    icon={<Grass />}
                    color={theme.palette.success.main}
                    status="success"
                    trend="up"
                    trendValue="+12% vs semana anterior"
                />
            </Grid>

            {/* Área */}
            <Grid item xs={12} sm={6} lg={3}>
                <StatCard
                    title="Área Cubierta"
                    value={`${stats.area_cubierta.toFixed(1)} m²`}
                    subtitle={`${stats.herbicida_usado.toFixed(1)} L usado`}
                    icon={<Terrain />}
                    color={theme.palette.warning.main}
                    status="info"
                    trend="up"
                    trendValue="+8% vs semana anterior"
                />
            </Grid>

            {/* Métricas adicionales */}
            <Grid item xs={12} sm={6} lg={4}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Speed sx={{ color: theme.palette.primary.main, mr: 1 }} />
                            <Typography variant="h6">Eficiencia General</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2">Robots</Typography>
                            <Chip
                                label={`${robotEfficiency.toFixed(1)}%`}
                                color={robotEfficiency > 80 ? 'success' : robotEfficiency > 50 ? 'warning' : 'error'}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2">Tanques</Typography>
                            <Chip
                                label={`${tankEfficiency.toFixed(1)}%`}
                                color={tankEfficiency > 60 ? 'success' : tankEfficiency > 30 ? 'warning' : 'error'}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2">Herbicida</Typography>
                            <Chip
                                label={`${herbicidaEfficiency.toFixed(1)} m²/L`}
                                color={herbicidaEfficiency > 10 ? 'success' : herbicidaEfficiency > 5 ? 'warning' : 'error'}
                                size="small"
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">Productividad</Typography>
                            <Chip
                                label={`${productividadGeneral.toFixed(1)}%`}
                                color={productividadGeneral > 70 ? 'success' : productividadGeneral > 40 ? 'warning' : 'error'}
                                size="small"
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Alertas rápidas */}
            <Grid item xs={12} sm={6} lg={4}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Warning sx={{ color: theme.palette.warning.main, mr: 1 }} />
                            <Typography variant="h6">Alertas</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {robotEfficiency < 50 && (
                                <Chip
                                    icon={<BatteryAlert />}
                                    label="Baja eficiencia de robots"
                                    color="warning"
                                    size="small"
                                />
                            )}
                            {tankEfficiency < 30 && (
                                <Chip
                                    icon={<WaterDrop />}
                                    label="Tanques con bajo nivel"
                                    color="error"
                                    size="small"
                                />
                            )}
                            {stats.malezas_detectadas > 100 && (
                                <Chip
                                    icon={<Grass />}
                                    label="Alta detección de malezas"
                                    color="info"
                                    size="small"
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Resumen de rendimiento */}
            <Grid item xs={12} lg={4}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TrendingUp sx={{ color: theme.palette.success.main, mr: 1 }} />
                            <Typography variant="h6">Rendimiento</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Resumen del período seleccionado
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Productividad</Typography>
                                <Typography variant="body2" color="success.main">
                                    +15%
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Eficiencia</Typography>
                                <Typography variant="body2" color="primary.main">
                                    +8%
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Cobertura</Typography>
                                <Typography variant="body2" color="warning.main">
                                    +12%
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DashboardStats;
>>>>>>> 30311b5 (Primer commit: API Aspersax)
