import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { 
    LineChart, 
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
    Cell, 
    AreaChart, 
    Area 
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
import { robotsService, tanquesService, malezasService, jornadasService } from '../services/api';
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
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
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
);

const DashboardPage: React.FC = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: dayjs().subtract(7, 'day'),
        end: dayjs(),
    });
    const [stats, setStats] = useState<any>(null);
    const [activityData, setActivityData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(0);
    const [robots, setRobots] = useState<any[]>([]);
    const [tanques, setTanques] = useState<any[]>([]);
    const [malezas, setMalezas] = useState<any[]>([]);
    const [jornadas, setJornadas] = useState<any[]>([]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const startDate = dateRange.start ? dateRange.start.format('YYYY-MM-DD') : dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const endDate = dateRange.end ? dateRange.end.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
            
            // Cargar datos reales de todos los componentes
            console.log('Cargando datos reales del dashboard...');
            
            try {
                const [robotsResponse, tanquesResponse, malezasResponse, jornadasResponse] = await Promise.all([
                    robotsService.getAll(),
                    tanquesService.getAll(),
                    malezasService.getAll(),
                    jornadasService.getAll()
                ]);
                
                const robotsData = robotsResponse?.data || [];
                const tanquesData = tanquesResponse?.data || [];
                const malezasData = malezasResponse?.data || [];
                const jornadasData = jornadasResponse?.data || [];
                
                setRobots(robotsData);
                setTanques(tanquesData);
                setMalezas(malezasData);
                setJornadas(jornadasData);
                
                // Calcular estadísticas basadas en datos reales
                const realStats = {
                    robots_activos: robotsData.filter((r: any) => r.estado === 'En Operación').length,
                    total_robots: robotsData.length,
                    tanques_en_uso: tanquesData.filter((t: any) => t.activo).length,
                    total_tanques: tanquesData.length,
                    malezas_detectadas: malezasData.filter((m: any) => m.estado === 'Detectada').length,
                    total_malezas: malezasData.length,
                    area_cubierta: jornadasData.filter((j: any) => j.estado === 'Completada').length * 10
                };
                
                setStats(realStats);
                setActivityData({ actividad_reciente: [] });
                
                console.log('Datos reales cargados:', { robotsData, tanquesData, malezasData, jornadasData, realStats });
            } catch (apiError) {
                console.log('Error al cargar datos reales, usando fallback mock:', apiError);
                // Fallback a datos mock si la API falla
                const mockStats = mockDataService.getDashboardStats();
                const mockActivity = mockDataService.getActivityData(startDate, endDate);
                setStats(mockStats);
                setActivityData(mockActivity);
                setRobots(mockDataService.getRobots());
                setTanques(mockDataService.getTanques());
                setMalezas(mockDataService.getMalezas());
                setJornadas(mockDataService.getJornadas());
            }
            
            // Comentar temporalmente la llamada a la API para usar solo datos mock
            /*
            try {
                // Intentar cargar datos de la API
                const [statsResponse, activityResponse] = await Promise.all([
                    dashboardService.getStats(startDate, endDate),
                    dashboardService.getActivityData(startDate, endDate)
                ]);
                
                // Si la API responde correctamente, usar esos datos
                if (statsResponse && statsResponse.data && activityResponse && activityResponse.data) {
                    setStats(statsResponse.data);
                    setActivityData(activityResponse.data);
                    console.log('Datos de API cargados exitosamente');
                } else {
                    console.log('Usando datos mock calculados - respuesta de API inválida');
                }
            } catch (apiError) {
                console.log('Usando datos mock calculados - Error de API:', apiError);
            }
            */
        } catch (err: any) {
            console.error('Error al cargar datos del dashboard:', err);
            // Fallback final con datos mock básicos
            const fallbackStartDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const fallbackEndDate = dayjs().format('YYYY-MM-DD');
            const mockStats = mockDataService.getDashboardStats();
            const mockActivity = mockDataService.getActivityData(fallbackStartDate, fallbackEndDate);
            setStats(mockStats);
            setActivityData(mockActivity);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange.start, dateRange.end]);

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
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
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', md: 'center' },
                mb: 4,
                gap: 2
            }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    Dashboard
                </Typography>
                
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
                <Box>
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
                </Box>
                <Box>
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
                </Box>
                <Box>
                    <StatCard
                        title="Malezas Detectadas"
                        value={`${stats?.malezas_detectadas || 0}`}
                        icon={GrassIcon}
                        color={theme.palette.success.main}
                        subtitle="+12% vs semana anterior"
                        status="En el período"
                        trend="+12%"
                    />
                </Box>
                <Box>
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
                <Typography variant="h6" gutterBottom>
                    Gráficos y Análisis
                </Typography>
                
                {/* Gráfico de líneas - Actividad del período */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Actividad del Período</Typography>
                        {activityData && activityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fecha" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <RechartsTooltip />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="robots"
                                        stroke={theme.palette.primary.main}
                                        name="Robots Activos"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="malezas"
                                        stroke={theme.palette.success.main}
                                        name="Malezas Detectadas"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1" color="text.secondary">
                                    No hay datos de actividad para el período seleccionado
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Grid de gráficos adicionales */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    {/* Gráfico de barras - Estado de robots */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Estado de Robots</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={[
                                    { estado: 'En Operación', cantidad: robots.filter(r => r.estado === 'En Operación').length },
                                    { estado: 'Mantenimiento', cantidad: robots.filter(r => r.estado === 'Mantenimiento').length },
                                    { estado: 'Inactivo', cantidad: robots.filter(r => r.estado === 'Inactivo').length }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="estado" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="cantidad" fill={theme.palette.primary.main} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Gráfico de pastel - Distribución de malezas */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Distribución de Malezas por Estado</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Detectadas', value: malezas.filter(m => m.estado === 'Detectada').length, color: '#f59e0b' },
                                            { name: 'En Tratamiento', value: malezas.filter(m => m.estado === 'En Tratamiento').length, color: '#3b82f6' },
                                            { name: 'Eliminadas', value: malezas.filter(m => m.estado === 'Eliminada').length, color: '#22c55e' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {[
                                            { name: 'Detectadas', value: malezas.filter(m => m.estado === 'Detectada').length, color: '#f59e0b' },
                                            { name: 'En Tratamiento', value: malezas.filter(m => m.estado === 'En Tratamiento').length, color: '#3b82f6' },
                                            { name: 'Eliminadas', value: malezas.filter(m => m.estado === 'Eliminada').length, color: '#22c55e' }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Box>

                {/* Gráfico de área - Nivel de tanques */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Capacidad de Tanques</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={tanques.map((tanque, index) => ({
                                nombre: tanque.nombre || `Tanque ${index + 1}`,
                                capacidad: tanque.capacidad_total || tanque.capacidad,
                                actual: tanque.nivel_actual,
                                porcentaje: ((tanque.nivel_actual || 0) / (tanque.capacidad_total || tanque.capacidad || 1)) * 100
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" />
                                <YAxis />
                                <RechartsTooltip formatter={(value, name) => {
                                    if (name === 'capacidad') return [`${value} L`, 'Capacidad Total'];
                                    if (name === 'actual') return [`${value} L`, 'Nivel Actual'];
                                    return [value, name];
                                }} />
                                <Area
                                    type="monotone"
                                    dataKey="capacidad"
                                    stackId="1"
                                    stroke={theme.palette.info.main}
                                    fill={`${theme.palette.info.main}30`}
                                    name="capacidad"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stackId="2"
                                    stroke={theme.palette.success.main}
                                    fill={theme.palette.success.main}
                                    name="actual"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Gráfico de barras - Jornadas por estado */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>Progreso de Jornadas</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { estado: 'Completadas', cantidad: jornadas.filter(j => j.estado === 'Completada').length },
                                { estado: 'En Progreso', cantidad: jornadas.filter(j => j.estado === 'En Progreso').length },
                                { estado: 'Programadas', cantidad: jornadas.filter(j => j.estado === 'Programada').length }
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="cantidad" fill={theme.palette.warning.main} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
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