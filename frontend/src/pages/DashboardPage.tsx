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
    SvgIcon,
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
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import TerrainIcon from '@mui/icons-material/Terrain';
import PageHeader from '../components/PageHeader';
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
}

interface ActivityData {
    fecha: string;
    robots: number;
    malezas: number;
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

const DashboardPage: React.FC = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: dayjs().subtract(7, 'day'),
        end: dayjs(),
    });
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activityData, setActivityData] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Asegurarse de que las fechas estén en el formato correcto
            const startDate = dateRange.start ? dateRange.start.format('YYYY-MM-DD') : dayjs().subtract(7, 'day').format('YYYY-MM-DD');
            const endDate = dateRange.end ? dateRange.end.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');

            const [statsResponse, activityResponse] = await Promise.all([
                dashboardService.getStats(startDate, endDate),
                dashboardService.getActivityData(startDate, endDate)
            ]);

            setStats(statsResponse.data);
            setActivityData(activityResponse.data);
        } catch (err: any) {
            console.error('Error al cargar datos del dashboard:', err);
            setError(err.response?.data?.error || 'Error al cargar los datos del dashboard. Por favor, intente nuevamente.');
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
            <PageHeader title="Dashboard" />
            
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Filtros de tiempo */}
            <Box sx={{ mb: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                </Stack>
            </Box>

            {/* Estadísticas principales */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
                <Box>
                    <StatCard
                        title="Robots Activos"
                        value={`${stats?.robots_activos || 0}/${stats?.total_robots || 0}`}
                        icon={SmartToyIcon}
                        color={theme.palette.primary.main}
                        subtitle="Robots en operación"
                    />
                </Box>
                <Box>
                    <StatCard
                        title="Tanques en Uso"
                        value={`${stats?.tanques_en_uso || 0}/${stats?.total_tanques || 0}`}
                        icon={WaterDropIcon}
                        color={theme.palette.info.main}
                        subtitle="Tanques activos"
                    />
                </Box>
                <Box>
                    <StatCard
                        title="Malezas Detectadas"
                        value={stats?.malezas_detectadas?.toString() || '0'}
                        icon={GrassIcon}
                        color={theme.palette.success.main}
                        subtitle="En el período seleccionado"
                    />
                </Box>
                <Box>
                    <StatCard
                        title="Área Cubierta"
                        value={`${stats?.area_cubierta?.toFixed(2) || '0'} m²`}
                        icon={TerrainIcon}
                        color={theme.palette.warning.main}
                        subtitle={`${stats?.herbicida_usado?.toFixed(2) || '0'} L de herbicida usado`}
                    />
                </Box>
            </Box>

            {/* Gráficos de actividad */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Actividad del Período
                </Typography>
                <Card>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="robots"
                                    stroke={theme.palette.primary.main}
                                    name="Robots Activos"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="malezas"
                                    stroke={theme.palette.success.main}
                                    name="Malezas Detectadas"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default DashboardPage; 