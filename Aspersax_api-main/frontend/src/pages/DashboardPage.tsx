import React, { useState, useEffect } from 'react';
import {
    Box,
    Stack,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    useTheme,
    Alert,
<<<<<<< HEAD
    SvgIcon,
=======
    Tabs,
    Tab,
    Fab,
    Tooltip,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
<<<<<<< HEAD
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import TerrainIcon from '@mui/icons-material/Terrain';
import PageHeader from '../components/PageHeader';
import DashboardStats from '../components/Dashboard/DashboardStats';
import RealTimeStatus from '../components/Dashboard/RealTimeStatus';
import ActivityCharts from '../components/Dashboard/ActivityCharts';
=======
import { Refresh, TrendingUp, Analytics, Settings } from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ActivityCharts from '../components/Dashboard/ActivityCharts';
import RealTimeStatus from '../components/Dashboard/RealTimeStatus';
import DataManager from '../components/Dashboard/DataManager';
>>>>>>> 30311b5 (Primer commit: API Aspersax)
import dashboardService from '../services/dashboardService';

interface DashboardStats {
    total_robots: number;
    robots_activos: number;
    total_tanques: number;
    tanques_en_uso: number;
    total_malezas: number;
    malezas_detectadas: number;
    area_cubierta: number;
    herbicida_usado: number;
<<<<<<< HEAD
=======
    eficiencia_robots?: number;
    eficiencia_tanques?: number;
    eficiencia_herbicida?: number;
    productividad_general?: number;
>>>>>>> 30311b5 (Primer commit: API Aspersax)
}

interface ActivityData {
    fecha: string;
    robots: number;
    malezas: number;
<<<<<<< HEAD
}

interface StatCardProps {
    title: string;
    value: string;
    icon: typeof SvgIcon;
    color: string;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => (
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
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);
=======
    area_cubierta: number;
    herbicida_usado: number;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}
>>>>>>> 30311b5 (Primer commit: API Aspersax)

const DashboardPage: React.FC = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: dayjs().subtract(7, 'day'),
        end: dayjs(),
    });
<<<<<<< HEAD
    const [stats, setStats] = useState<any>(null);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [robotStats, setRobotStats] = useState<any[]>([]);
    const [tankStats, setTankStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
=======
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activityData, setActivityData] = useState<ActivityData[]>([]);
    const [robotStats, setRobotStats] = useState<any[]>([]);
    const [tankStats, setTankStats] = useState<any[]>([]);
    const [weedStats, setWeedStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [lastRefresh, setLastRefresh] = useState(new Date());
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

<<<<<<< HEAD
            const startDate = dateRange.start ? dateRange.start.format('YYYY-MM-DD') : dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const endDate = dateRange.end ? dateRange.end.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

            const [statsResponse, activityResponse, robotsResponse, tanksResponse] = await Promise.all([
                dashboardService.getStats(startDate, endDate),
                dashboardService.getActivityData(startDate, endDate),
                dashboardService.getRobotStats(),
                dashboardService.getTankStats(),
            ]);

            setStats(statsResponse.data);
            setActivityData(activityResponse.data);
            setRobotStats(robotsResponse.data);
            setTankStats(tanksResponse.data);
        } catch (err: any) {
            console.error('Error al cargar datos del dashboard:', err);
            setError(err.response?.data?.error || 'Error al cargar los datos del dashboard');
=======
            // Asegurarse de que las fechas estén en el formato correcto
            const startDate = dateRange.start ? dateRange.start.format('YYYY-MM-DD') : dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const endDate = dateRange.end ? dateRange.end.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

            console.log('🔄 Cargando datos del dashboard...');
            console.log('📅 Rango de fechas:', startDate, 'a', endDate);

            // Primero probar la conexión
            try {
                const testResponse = await dashboardService.testConnection();
                console.log('✅ Conexión exitosa:', testResponse.data);
            } catch (testErr) {
                console.warn('⚠️ Error en test de conexión:', testErr);
            }

            const [
                statsResponse, 
                activityResponse, 
                robotResponse, 
                tankResponse, 
                weedResponse
            ] = await Promise.all([
                dashboardService.getEnhancedStats(startDate, endDate),
                dashboardService.getActivityData(startDate, endDate),
                dashboardService.getRobotStats(),
                dashboardService.getTankStats(),
                dashboardService.getWeedStats()
            ]);

            console.log('📊 Datos recibidos:');
            console.log('  - Stats:', statsResponse.data);
            console.log('  - Activity:', activityResponse.data);
            console.log('  - Robots:', robotResponse.data);
            console.log('  - Tanks:', tankResponse.data);
            console.log('  - Weeds:', weedResponse.data);

            setStats(statsResponse.data);
            setActivityData(activityResponse.data);
            // Transformar robots: { id_robot, nombre, bateria } -> { name, value }
            setRobotStats(
                Array.isArray(robotResponse.data)
                    ? robotResponse.data.map((r: any) => ({
                        id_robot: r.id_robot,
                        nombre: r.nombre,
                        bateria: r.bateria,
                        estado: r.estado,
                    }))
                    : []
            );
            // Transformar tanques: { id_tanque, nombre, nivel_actual, capacidad } -> { name, nivel }
            setTankStats(
                Array.isArray(tankResponse.data)
                    ? tankResponse.data.map((t: any) => ({
                        id_tanque: t.id_tanque,
                        nombre: t.nombre,
                        nivel_actual: t.nivel_actual,
                        capacidad: t.capacidad,
                        estado: t.estado,
                        nivel: t.nivel_actual, // para compatibilidad con componentes que usen "nivel"
                    }))
                    : []
            );
            // Malezas ya viene en formato correcto
            setWeedStats(Array.isArray(weedResponse.data) ? weedResponse.data : []);
            setLastRefresh(new Date());
        } catch (err: any) {
            console.error('❌ Error al cargar datos del dashboard:', err);
            console.error('  - Response:', err.response);
            console.error('  - Status:', err.response?.status);
            console.error('  - Data:', err.response?.data);
            
            let errorMessage = 'Error al cargar los datos del dashboard.';
            
            if (err.response?.status === 404) {
                errorMessage = 'No se encontraron los endpoints del dashboard. Verifica que el backend esté ejecutándose.';
            } else if (err.response?.status === 500) {
                errorMessage = 'Error interno del servidor. Verifica los logs del backend.';
            } else if (err.code === 'ECONNREFUSED') {
                errorMessage = 'No se pudo conectar al servidor. Asegúrate de que el backend esté ejecutándose en http://127.0.0.1:8000';
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            }
            
            setError(errorMessage);
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    useEffect(() => {
        fetchDashboardData();
        // Actualizar datos en tiempo real cada 5 segundos
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, [dateRange.start, dateRange.end]);

    if (loading && !stats) {
=======
    const handleRefresh = () => {
        fetchDashboardData();
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange.start, dateRange.end]);

    if (loading) {
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box>
            <PageHeader title="Dashboard" />
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

<<<<<<< HEAD
            {/* Filtros de tiempo */}
            <Box sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
=======
            {/* Filtros de tiempo y controles */}
            <Box sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
>>>>>>> 30311b5 (Primer commit: API Aspersax)
                    <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha inicial"
                                value={dateRange.start}
                                onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha final"
                                value={dateRange.end}
                                onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                    </Box>
<<<<<<< HEAD
                </Stack>
            </Box>

            {/* Estadísticas principales */}
            <Box sx={{ mb: 4 }}>
                {stats && <DashboardStats stats={stats} />}
            </Box>

            {/* Estado en tiempo real */}
            <Box sx={{ mb: 4 }}>
                <RealTimeStatus robots={robotStats} tanks={tankStats} />
            </Box>

            {/* Gráficos de actividad */}
            <Box>
                <ActivityCharts data={activityData} />
            </Box>
=======
                    <Typography variant="caption" color="text.secondary">
                        Última actualización: {lastRefresh.toLocaleTimeString()}
                    </Typography>
                </Stack>
            </Box>

            {/* Tabs para diferentes vistas */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                    <Tab label="Resumen" icon={<Analytics />} iconPosition="start" />
                    <Tab label="Gráficos" icon={<TrendingUp />} iconPosition="start" />
                    <Tab label="Tiempo Real" icon={<Refresh />} iconPosition="start" />
                    <Tab label="Gestionar Datos" icon={<Settings />} iconPosition="start" />
                </Tabs>
            </Box>

            {/* Tab Panel - Resumen */}
            <TabPanel value={tabValue} index={0}>
                {stats && <DashboardStats stats={stats} />}
            </TabPanel>

            {/* Tab Panel - Gráficos */}
            <TabPanel value={tabValue} index={1}>
                <ActivityCharts
                    activityData={activityData}
                    batteryStats={robotStats.map(r => ({ name: r.nombre, value: r.bateria }))}
                    tankStats={tankStats}
                />
            </TabPanel>

            {/* Tab Panel - Tiempo Real */}
            <TabPanel value={tabValue} index={2}>
                <RealTimeStatus
                    robotStats={robotStats.map(r => ({
                        id: r.id_robot ?? r.id ?? Math.random(),
                        nombre: r.name || r.nombre,
                        estado: r.estado,
                        bateria: r.value ?? r.bateria ?? 0,
                        ultima_actividad: r.ultima_actividad && !isNaN(Date.parse(r.ultima_actividad))
                            ? r.ultima_actividad
                            : new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(), // fecha aleatoria entre hoy y hace 3 días
                    }))}
                    tankStats={tankStats.map(t => ({
                        id_tanque: t.id_tanque ?? Math.random(),
                        nombre: t.name || t.nombre,
                        nivel_actual: t.nivel_actual ?? t.nivel ?? 0,
                        capacidad: t.capacidad ?? 100,
                        estado: t.estado || 'Desconocido'
                    }))}
                />
            </TabPanel>

            {/* Tab Panel - Gestión de Datos */}
            <TabPanel value={tabValue} index={3}>
                <DataManager
                    robotStats={robotStats}
                    tankStats={tankStats}
                    weedStats={weedStats}
                    onDataUpdate={fetchDashboardData}
                />
            </TabPanel>

            {/* Botón flotante de actualización */}
            <Tooltip title="Actualizar datos">
                <Fab
                    color="primary"
                    aria-label="refresh"
                    onClick={handleRefresh}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <Refresh />
                </Fab>
            </Tooltip>
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        </Box>
    );
};

<<<<<<< HEAD
export default DashboardPage; 
=======
export default DashboardPage;
>>>>>>> 30311b5 (Primer commit: API Aspersax)
