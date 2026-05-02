import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Stack,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    useTheme,
    Alert,
    SvgIcon,
    Tabs,
    Tab,
    Chip,
    IconButton,
    Tooltip,
    Fade,
    Grow,
    Skeleton,
    Badge
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { 
    Line, 
    XAxis, 
    YAxis,
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    PieChart, 
    Pie, 
    AreaChart, 
    Area,
    ComposedChart,
    Scatter,
    ScatterChart,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell,
    Legend
} from 'recharts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GrassIcon from '@mui/icons-material/Grass';
import TerrainIcon from '@mui/icons-material/Terrain';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import { mockDataService } from '../services/mockDataService';
import dashboardService from '../services/dashboardService';
import robotsService from '../services/robotsService';
import UserProfileCard from '../components/UserProfileCard';

interface StatCardProps {
    title: string;
    value: string;
    icon: typeof SvgIcon;
    color: string;
    subtitle?: string;
    progress?: number;
    trend?: string;
    status?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle, progress, trend, status }) => (
    <Grow in timeout={800}>
        <Card sx={{ 
            height: '100%', 
            position: 'relative', 
            overflow: 'visible',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
        }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                        backgroundColor: `${color}15`,
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                    }}
                >
                    <Icon sx={{ color, fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 0.5 }}>
                    {title}
                </Typography>
                    {status && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            {status}
                        </Typography>
                    )}
                </Box>
                {trend && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <TrendingUpIcon sx={{ fontSize: 20, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {trend}
                        </Typography>
                    </Box>
                )}
            </Box>
            
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                {value}
            </Typography>
            
            {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {subtitle}
                </Typography>
            )}
            
            {progress !== undefined && (
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Progreso {progress}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: `${color}20`,
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: color,
                                borderRadius: 4,
                            }
                        }} 
                    />
                </Box>
            )}
        </CardContent>
        </Card>
    </Grow>
);

const DashboardPage: React.FC = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: dayjs().subtract(7, 'day'),
        end: dayjs(),
    });
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [robots, setRobots] = useState<any[]>([]);
    const [tanques, setTanques] = useState<any[]>([]);
    const [malezas, setMalezas] = useState<any[]>([]);
    const [jornadas, setJornadas] = useState<any[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            try {
                // Intentar cargar datos reales de la API
                const start = dateRange.start?.format('YYYY-MM-DD') || '';
                const end = dateRange.end?.format('YYYY-MM-DD') || '';

                const [statsRes, activityRes, robotsRes] = await Promise.all([
                    dashboardService.getStats(start, end),
                    dashboardService.getActivityData(start, end),
                    robotsService.getAll()
                ]);
                
                if (statsRes.data) setStats(statsRes.data);
                if (robotsRes.data) {
                    setRobots(Array.isArray(robotsRes.data) ? robotsRes.data : (robotsRes.data as any).results || []);
                }
                if (activityRes.data) console.log('Actividad cargada:', activityRes.data);
                
                setTanques(mockDataService.getTanques());
                setMalezas(mockDataService.getMalezas());
                setJornadas(mockDataService.getJornadas());
                
                setLastUpdate(new Date());
                console.log('Datos reales de API cargados exitosamente');
            } catch (apiError) {
                console.log('Error de API, usando fallback mock:', apiError);
                // Fallback a datos mock si la API falla
                const mockStats = mockDataService.getDashboardStats();
                setStats(mockStats);
                setRobots(mockDataService.getRobots());
                setTanques(mockDataService.getTanques());
                setMalezas(mockDataService.getMalezas());
                setJornadas(mockDataService.getJornadas());
            }
        } catch (err: any) {
            console.error('Error al cargar datos del dashboard:', err);
            // Fallback final con datos mock básicos
            const mockStats = mockDataService.getDashboardStats();
            setStats(mockStats);
            setError(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData, dateRange.start, dateRange.end]);

    // Actualizar datos cada 30 segundos para reflejar cambios en tiempo real
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Actualizando datos del dashboard...');
            fetchDashboardData();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    // Función para forzar actualización manual
    const handleRefresh = () => {
        fetchDashboardData();
    };

    if (loading) {
        return (
            <Box>
                {/* Header Skeleton */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Skeleton variant="text" width={200} height={48} />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Skeleton variant="rectangular" width={150} height={56} />
                        <Skeleton variant="rectangular" width={150} height={56} />
                        <Skeleton variant="circular" width={48} height={48} />
                    </Box>
                </Box>

                {/* Profile and Stats Skeleton */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 4 }}>
                    <Box sx={{ flex: { lg: '0 0 400px' } }}>
                        <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                    </Box>
                    <Box sx={{ 
                        flex: 1,
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, 
                        gap: 3 
                    }}>
                        {[1, 2, 3, 4].map((item) => (
                            <Skeleton key={item} variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                        ))}
                    </Box>
                </Box>

                {/* Tabs Skeleton */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={140} height={48} sx={{ borderRadius: 1 }} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Header del Dashboard con fecha y última actualización */}
            <Fade in timeout={600}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', md: 'center' },
                    mb: 4,
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                            Dashboard de Control
                        </Typography>
                        {lastUpdate && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                📊 Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
                            </Typography>
                        )}
                    </Box>
                    
                    <Badge 
                        color="success" 
                        variant="dot" 
                        invisible={!lastUpdate}
                        sx={{
                            '& .MuiBadge-dot': {
                                animation: lastUpdate ? 'pulse 2s infinite' : 'none',
                                '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 }
                                }
                            }
                        }}
                    >
                        <Tooltip title="Actualizar datos">
                            <IconButton 
                                onClick={handleRefresh}
                                sx={{ 
                                    bgcolor: 'primary.main', 
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { 
                                        bgcolor: 'primary.dark',
                                        transform: 'rotate(180deg)'
                                    }
                                }}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Badge>
                </Box>
            </Fade>
                
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: 'center',
                gap: 2
            }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ minWidth: 150 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha inicial"
                                value={dateRange.start}
                                onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>
                        <Box sx={{ minWidth: 150 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha final"
                                value={dateRange.end}
                                onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Stack>
                
                <Tooltip title="Actualizar datos">
                    <IconButton 
                        onClick={fetchDashboardData}
                        sx={{ 
                            backgroundColor: 'success.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'success.dark',
                            }
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Perfil de Usuario y Estadísticas principales */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 4 }}>
                {/* Tarjeta de perfil de usuario */}
                <Box sx={{ flex: { lg: '0 0 400px' } }}>
                    <UserProfileCard />
                </Box>
                
                {/* Estadísticas principales */}
                <Box sx={{ 
                    flex: 1,
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, 
                    gap: 3 
                }}>
                    <StatCard
                        title="Robots Activos"
                        value={`${stats?.robots_activos || 0}/${stats?.total_robots || 0}`}
                        icon={SmartToyIcon}
                        color={theme.palette.primary.main}
                        subtitle={`${stats?.total_robots ? Math.round((stats.robots_activos / stats.total_robots) * 100) : 0}% eficiencia`}
                        progress={stats?.total_robots ? Math.round((stats.robots_activos / stats.total_robots) * 100) : 0}
                        status="En operación"
                        trend="+5%"
                    />

                    <StatCard
                        title="Tanques en Uso"
                        value={`${stats?.tanques_en_uso || 0}/${stats?.total_tanques || 0}`}
                        icon={WaterDropIcon}
                        color={theme.palette.info.main}
                        subtitle={`${stats?.total_tanques ? Math.round((stats.tanques_en_uso / stats.total_tanques) * 100) : 0}% ocupación`}
                        progress={stats?.total_tanques ? Math.round((stats.tanques_en_uso / stats.total_tanques) * 100) : 0}
                        status="Con herbicida"
                        trend="+8%"
                    />

                    <StatCard
                        title="Malezas Detectadas"
                        value={`${stats?.malezas_detectadas || 0}`}
                        icon={GrassIcon}
                        color={theme.palette.error.main}
                        subtitle="Requieren tratamiento"
                        status="Detectadas hoy"
                        trend="+12%"
                    />

                    <StatCard
                        title="Área Cubierta"
                        value={`${stats?.area_cubierta ? stats.area_cubierta.toFixed(1) : '0'} hectáreas`}
                        icon={TerrainIcon}
                        color={theme.palette.warning.main}
                        subtitle={`${stats?.herbicida_usado ? stats.herbicida_usado.toFixed(1) : '0'} L usado`}
                        status="+8% vs semana anterior"
                        trend="+8%"
                    />
                </Box>
            </Box>

            {/* Navegación por pestañas */}
            <Box sx={{ mb: 4 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48,
                        },
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: 1.5,
                        }
                    }}
                >
                    <Tab 
                        icon={<BarChartIcon />} 
                        label="RESUMEN" 
                        iconPosition="start"
                        sx={{ 
                            color: activeTab === 0 ? 'primary.main' : 'text.secondary',
                            '&.Mui-selected': { color: 'primary.main' }
                        }}
                    />
                    <Tab 
                        icon={<TimelineIcon />} 
                        label="GRÁFICOS" 
                        iconPosition="start"
                        sx={{ 
                            color: activeTab === 1 ? 'primary.main' : 'text.secondary',
                            '&.Mui-selected': { color: 'primary.main' }
                        }}
                    />
                    <Tab 
                        icon={<RefreshIcon />} 
                        label="TIEMPO REAL" 
                        iconPosition="start"
                        sx={{ 
                            color: activeTab === 2 ? 'primary.main' : 'text.secondary',
                            '&.Mui-selected': { color: 'primary.main' }
                        }}
                    />
                </Tabs>
            </Box>

            {/* Contenido de las pestañas */}
            {activeTab === 0 && (
                <>
                    {/* Tarjetas de eficiencia y rendimiento */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                        <Box>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Eficiencia General
                                        </Typography>
                                    </Box>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Robots
                                            </Typography>
                                            <Chip 
                                                label={`${stats?.total_robots ? Math.round((stats.robots_activos / stats.total_robots) * 100) : 0}%`} 
                                                color="error"
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Tanques
                                            </Typography>
                                            <Chip 
                                                label={`${stats?.total_tanques ? Math.round((stats.tanques_en_uso / stats.total_tanques) * 100) : 0}%`} 
                                                color="success"
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Herbicida
                                            </Typography>
                                            <Chip 
                                                label={`${stats?.area_cubierta && stats?.herbicida_usado ? (stats.area_cubierta / stats.herbicida_usado).toFixed(1) : '0'} m²/L`} 
                                                color="warning"
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Productividad
                                            </Typography>
                                            <Chip 
                                                label="65.0%" 
                                                color="warning"
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                        
                        <Box>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <WarningIcon sx={{ color: 'warning.main', mr: 1, fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Alertas
                                        </Typography>
                                    </Box>
                                    <Stack spacing={2}>
                                        <Chip 
                                            label="Alta detección de malezas" 
                                            color="info"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                        <Chip 
                                            label="Robot R-003 batería baja (15%)" 
                                            color="error"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                        <Chip 
                                            label="Tanque T-002 nivel crítico" 
                                            color="warning"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                        <Chip 
                                            label="Mantenimiento programado R-001" 
                                            color="default"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                        <Chip 
                                            label="Área sector 3 completada" 
                                            color="success"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                        
                        <Box>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <TrendingUpIcon sx={{ color: 'success.main', mr: 1, fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Rendimiento
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Resumen del período seleccionado
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Productividad
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                                +15%
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Eficiencia
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                                +8%
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Cobertura
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                                                +12%
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </>
            )}

            {activeTab === 1 && (
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <TimelineIcon sx={{ color: '#2e7d32', mr: 1, fontSize: 28 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                            Análisis Agropecuario
                        </Typography>
                    </Box>
                    
                    {/* Gráfico 1 - Actividad y Productividad */}
                    <Card sx={{ mb: 4, borderTop: '4px solid #2e7d32', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                <TerrainIcon sx={{ mr: 1, color: '#795548' }} />
                                Productividad del Campo
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={[
                                    { fecha: 'Lun', robots: robots.filter(r => r.estado === 'En Operación').length || 8, malezas: malezas.filter(m => m.estado === 'Detectada').length || 45, herbicida: tanques.reduce((sum, t) => sum + (t.nivel_actual || 0), 0) || 120, eficiencia: 85 },
                                    { fecha: 'Mar', robots: robots.length || 12, malezas: malezas.length || 67, herbicida: tanques.reduce((sum, t) => sum + (t.capacidad_total || 0), 0) / 10 || 180, eficiencia: 92 },
                                    { fecha: 'Mié', robots: Math.floor(robots.length * 0.8) || 10, malezas: Math.floor(malezas.length * 0.7) || 52, herbicida: 150, eficiencia: 88 },
                                    { fecha: 'Jue', robots: Math.max(robots.length, 15), malezas: Math.max(malezas.length, 78), herbicida: 220, eficiencia: 95 },
                                    { fecha: 'Vie', robots: Math.floor(robots.length * 0.9) || 11, malezas: Math.floor(malezas.length * 0.8) || 58, herbicida: 165, eficiencia: 90 },
                                    { fecha: 'Sáb', robots: Math.floor(robots.length * 0.7) || 9, malezas: Math.floor(malezas.length * 0.6) || 42, herbicida: 135, eficiencia: 87 },
                                    { fecha: 'Dom', robots: Math.floor(robots.length * 0.6) || 7, malezas: Math.floor(malezas.length * 0.5) || 35, herbicida: 110, eficiencia: 82 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                    <XAxis dataKey="fecha" stroke="#6b7280" axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" stroke="#6b7280" axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#6b7280" axisLine={false} tickLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ 
                                            backgroundColor: '#ffffff', 
                                            border: '1px solid #e5e7eb', 
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar yAxisId="left" dataKey="robots" fill="#f59e0b" name="Robots Activos" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Bar yAxisId="left" dataKey="malezas" fill="#ef4444" name="Malezas Detectadas" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    <Line 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="eficiencia" 
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        name="Eficiencia %"
                                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Area 
                                        yAxisId="right" 
                                        type="monotone" 
                                        dataKey="herbicida" 
                                        fill="#3b82f6" 
                                        fillOpacity={0.1}
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        name="Herbicida (L)"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
                        {/* Gráfico 2 - Estado de robots */}
                        <Card sx={{ borderTop: '4px solid #f59e0b', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <SmartToyIcon sx={{ mr: 1, color: '#f59e0b' }} />
                                    Estado de Flota de Robots
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart 
                                        data={[
                                            { estado: 'En Operación', cantidad: robots.filter(r => r.estado === 'En Operación').length, color: '#10b981' },
                                            { estado: 'Disponible', cantidad: robots.filter(r => r.estado === 'Disponible').length, color: '#3b82f6' },
                                            { estado: 'En Mantenimiento', cantidad: robots.filter(r => r.estado === 'En Mantenimiento').length, color: '#f59e0b' },
                                            { estado: 'Fuera de Servicio', cantidad: robots.filter(r => r.estado === 'Fuera de Servicio').length, color: '#ef4444' }
                                        ]}
                                        layout="vertical"
                                        margin={{ left: 30 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                                        <XAxis type="number" stroke="#6b7280" axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="estado" stroke="#6b7280" axisLine={false} tickLine={false} />
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="cantidad" 
                                            radius={[0, 4, 4, 0]}
                                            barSize={30}
                                        >
                                            {robots.length > 0 && [
                                                { estado: 'En Operación', color: '#10b981' },
                                                { estado: 'Disponible', color: '#3b82f6' },
                                                { estado: 'En Mantenimiento', color: '#f59e0b' },
                                                { estado: 'Fuera de Servicio', color: '#ef4444' }
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Gráfico 3 - Control de Malezas */}
                        <Card sx={{ borderTop: '4px solid #ef4444', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <GrassIcon sx={{ mr: 1, color: '#ef4444' }} />
                                    Control de Malezas
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Detectadas', value: malezas.filter(m => m.estado === 'Detectada').length || 15, color: '#ef4444' },
                                                { name: 'Tratadas', value: malezas.filter(m => m.estado === 'Tratada').length || 8, color: '#f59e0b' },
                                                { name: 'Eliminadas', value: malezas.filter(m => m.estado === 'Eliminada').length || 22, color: '#10b981' }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            labelLine={true}
                                        >
                                            {[
                                                { color: '#ef4444' },
                                                { color: '#f59e0b' },
                                                { color: '#10b981' }
                                            ].map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
                        {/* Gráfico 4 - Rendimiento por Sectores */}
                        <Card sx={{ borderTop: '4px solid #8b5cf6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <TerrainIcon sx={{ mr: 1, color: '#8b5cf6' }} />
                                    Rendimiento por Sectores
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis 
                                            type="number" 
                                            dataKey="x" 
                                            name="Herbicida Usado" 
                                            stroke="#6b7280"
                                            unit="L"
                                        />
                                        <YAxis 
                                            type="number" 
                                            dataKey="y" 
                                            name="Eficiencia" 
                                            stroke="#6b7280"
                                            unit="%"
                                        />
                                        <RechartsTooltip 
                                            cursor={{ strokeDasharray: '3 3' }}
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Scatter 
                                            name="Sectores" 
                                            data={[
                                                { sector: 'Sector A', x: 120, y: 85, z: 25, color: '#10b981' },
                                                { sector: 'Sector B', x: 180, y: 92, z: 30, color: '#3b82f6' },
                                                { sector: 'Sector C', x: 150, y: 78, z: 20, color: '#f59e0b' },
                                                { sector: 'Sector D', x: 200, y: 88, z: 35, color: '#ef4444' },
                                                { sector: 'Sector E', x: 90, y: 72, z: 18, color: '#8b5cf6' },
                                                { sector: 'Sector F', x: 165, y: 95, z: 28, color: '#ec4899' }
                                            ]}
                                        >
                                            {
                                                [
                                                    { color: '#10b981' }, { color: '#3b82f6' }, { color: '#f59e0b' },
                                                    { color: '#ef4444' }, { color: '#8b5cf6' }, { color: '#ec4899' }
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))
                                            }
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Gráfico 5 - Radar de Calidad */}
                        <Card sx={{ borderTop: '4px solid #14b8a6', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ mr: 1, color: '#14b8a6' }} />
                                    Métricas de Calidad
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart outerRadius={90} data={[
                                        { metric: 'Precisión', actual: Math.min(92, robots.filter(r => r.estado === 'En Operación').length * 10 || 92), objetivo: 95 },
                                        { metric: 'Cobertura', actual: Math.min(88, jornadas.filter(j => j.estado === 'Completada').length * 15 || 88), objetivo: 90 },
                                        { metric: 'Velocidad', actual: 85, objetivo: 85 },
                                        { metric: 'Eficiencia', actual: Math.min(91, (robots.length > 0 ? robots.filter(r => r.estado === 'En Operación').length / robots.length * 100 : 91)), objetivo: 93 },
                                        { metric: 'Autonomía', actual: Math.min(87, tanques.length > 0 ? tanques.reduce((sum, t) => sum + (t.nivel_actual || 0), 0) / tanques.length : 87), objetivo: 90 },
                                        { metric: 'Mantenimiento', actual: Math.min(94, robots.length > 0 ? (robots.length - robots.filter(r => r.estado === 'Mantenimiento').length) / robots.length * 100 : 94), objetivo: 95 }
                                    ]}>
                                        <PolarGrid stroke="#e0e0e0" />
                                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                        <Radar
                                            name="Rendimiento Actual"
                                            dataKey="actual"
                                            stroke="#14b8a6"
                                            fill="#14b8a6"
                                            fillOpacity={0.4}
                                        />
                                        <Radar
                                            name="Objetivo"
                                            dataKey="objetivo"
                                            stroke="#94a3b8"
                                            fill="#94a3b8"
                                            fillOpacity={0.2}
                                            strokeDasharray="5 5"
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
                        {/* Gráfico 6 - Nivel de tanques */}
                        <Card sx={{ borderTop: '4px solid #0ea5e9', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <WaterDropIcon sx={{ mr: 1, color: '#0ea5e9' }} />
                                    Capacidad de Tanques
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={tanques.map((tanque, index) => ({
                                        nombre: tanque.nombre || `Tanque ${index + 1}`,
                                        capacidad: tanque.capacidad_total || tanque.capacidad,
                                        actual: tanque.nivel_actual,
                                    }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                        <XAxis dataKey="nombre" stroke="#6b7280" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="capacidad"
                                            stroke="#bae6fd"
                                            fill="#bae6fd"
                                            name="Capacidad Total (L)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="actual"
                                            stroke="#0ea5e9"
                                            fill="#0ea5e9"
                                            name="Nivel Actual (L)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Gráfico 7 - Jornadas por estado */}
                        <Card sx={{ borderTop: '4px solid #6366f1', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, color: '#374151', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <TimelineIcon sx={{ mr: 1, color: '#6366f1' }} />
                                    Progreso de Jornadas
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={[
                                        { estado: 'Completadas', cantidad: jornadas.filter(j => j.estado === 'Completada').length, color: '#10b981' },
                                        { estado: 'En Progreso', cantidad: jornadas.filter(j => j.estado === 'En Progreso').length, color: '#3b82f6' },
                                        { estado: 'Pausadas', cantidad: jornadas.filter(j => j.estado === 'Pausada').length, color: '#f59e0b' },
                                        { estado: 'Programadas', cantidad: jornadas.filter(j => j.estado === 'Programada').length, color: '#6366f1' }
                                    ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                                        <XAxis dataKey="estado" stroke="#6b7280" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ 
                                                backgroundColor: '#ffffff', 
                                                border: '1px solid #e5e7eb', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="cantidad" radius={[4, 4, 0, 0]} maxBarSize={50}>
                                            {
                                                [
                                                    { color: '#10b981' }, { color: '#3b82f6' }, { color: '#f59e0b' }, { color: '#6366f1' }
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Estado en Tiempo Real
                    </Typography>
                    
                    {/* Robots en tiempo real */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <SmartToyIcon sx={{ mr: 1, color: 'primary.main' }} />
                                    Robots Activos
                                </Typography>
                                {robots.filter(r => r.estado === 'En Operación').map(robot => (
                                    <Box key={robot.id_robot} sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        py: 1,
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {robot.nombre}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {robot.ubicacion}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500 }}>
                                                {robot.bateria}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Batería
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <WaterDropIcon sx={{ mr: 1, color: 'info.main' }} />
                                    Estado de Tanques
                                </Typography>
                                {tanques.filter(t => t.activo).map(tanque => (
                                    <Box key={tanque.id_tanque} sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        py: 1,
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {tanque.nombre}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {tanque.tipo_herbicida}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="body2" sx={{ 
                                                color: tanque.estado === 'Lleno' ? 'success.main' : 
                                                       tanque.estado === 'Medio' ? 'warning.main' : 'error.main',
                                                fontWeight: 500 
                                            }}>
                                                {Math.round(((tanque.nivel_actual || 0) / (tanque.capacidad_total || tanque.capacidad || 1)) * 100)}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {tanque.estado}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Malezas recientes */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <GrassIcon sx={{ mr: 1, color: 'success.main' }} />
                                Detecciones Recientes de Malezas
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                                {malezas.slice(0, 6).map(maleza => (
                                    <Box key={maleza.id_maleza} sx={{ 
                                        p: 2, 
                                        border: '1px solid #e0e0e0', 
                                        borderRadius: 2,
                                        backgroundColor: maleza.estado === 'Detectada' ? '#fff3cd' : 
                                                        maleza.estado === 'Tratada' ? '#d1ecf1' : '#d4edda'
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                            {maleza.tipo.split('(')[0].trim()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Detectado por: {maleza.robot_detector}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Ubicación: ({maleza.ubicacion_x}, {maleza.ubicacion_y})
                                        </Typography>
                                        <Chip 
                                            label={maleza.estado} 
                                            size="small" 
                                            color={maleza.estado === 'Detectada' ? 'warning' : 
                                                  maleza.estado === 'Tratada' ? 'info' : 'success'}
                                            sx={{ mt: 1, fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}

        </Box>
    );
};

export default DashboardPage; 