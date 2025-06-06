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
import DashboardStats from '../components/Dashboard/DashboardStats';
import RealTimeStatus from '../components/Dashboard/RealTimeStatus';
import ActivityCharts from '../components/Dashboard/ActivityCharts';
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
    const [stats, setStats] = useState<any>(null);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [robotStats, setRobotStats] = useState<any[]>([]);
    const [tankStats, setTankStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Actualizar datos en tiempo real cada 5 segundos
        const interval = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(interval);
    }, [dateRange.start, dateRange.end]);

    if (loading && !stats) {
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
        </Box>
    );
};

export default DashboardPage; 