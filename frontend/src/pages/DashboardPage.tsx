import React, { useState, useEffect } from 'react';
import {
    Box,
    Stack,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    LinearProgress,
    useTheme,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    BarChart,
    Bar,
} from 'recharts';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/PageHeader';
import robotsService from '../services/robotsService';

// Datos de ejemplo para los gráficos
const activityData = [
    { name: 'Lun', robots: 4, malezas: 35 },
    { name: 'Mar', robots: 3, malezas: 28 },
    { name: 'Mie', robots: 5, malezas: 42 },
    { name: 'Jue', robots: 6, malezas: 45 },
    { name: 'Vie', robots: 4, malezas: 38 },
    { name: 'Sab', robots: 3, malezas: 30 },
    { name: 'Dom', robots: 5, malezas: 40 },
];

const jornadas = [
    { id: 1, titulo: 'Fumigación Sector A', fecha: '2024-03-20', estado: 'Pendiente' },
    { id: 2, titulo: 'Mantenimiento Robots', fecha: '2024-03-21', estado: 'Completado' },
    { id: 3, titulo: 'Inspección Sector B', fecha: '2024-03-22', estado: 'En Progreso' },
];

interface Robot {
    id: string;
    nombre: string;
    estado: string;
    bateria: number;
    ultima_actividad: string;
}

const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {value}
                    </Typography>
                </Box>
                <Box>
                    <IconButton size="small">
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        backgroundColor: `${color}20`,
                        color: color,
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const ProgressCard = ({ title, value, max, color }: { title: string; value: number; max: number; color: string }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
                {title}
            </Typography>
            <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress
                    variant="determinate"
                    value={(value / max) * 100}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: `${color}20`,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: color,
                            borderRadius: 4,
                        },
                    }}
                />
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
                {value} de {max} {title.toLowerCase()}
            </Typography>
        </CardContent>
    </Card>
);

const DashboardPage: React.FC = () => {
    const theme = useTheme();
    const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({
        start: dayjs().subtract(7, 'day'),
        end: dayjs(),
    });
    const [openRobotDialog, setOpenRobotDialog] = useState(false);
    const [newRobot, setNewRobot] = useState({
        nombre: '',
        estado: 'Disponible',
    });
    const [robots, setRobots] = useState<Robot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRobots();
    }, []);

    const fetchRobots = async () => {
        try {
            const response = await robotsService.getAll();
            setRobots(response.data);
        } catch (error) {
            console.error('Error al cargar robots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRobot = async () => {
        try {
            await robotsService.create(newRobot);
            setOpenRobotDialog(false);
            setNewRobot({ nombre: '', estado: 'Disponible' });
            fetchRobots(); // Recargar la lista de robots
        } catch (error) {
            console.error('Error al agregar robot:', error);
        }
    };

    const handleDeleteRobot = async (id: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este robot?')) {
            try {
                await robotsService.delete(id);
                fetchRobots(); // Recargar la lista de robots
            } catch (error) {
                console.error('Error al eliminar robot:', error);
            }
        }
    };

    return (
        <Box>
            <PageHeader title="Dashboard" />
            
            {/* Filtros de tiempo */}
            <Box sx={{ mb: 3 }}>
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
            <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
                <Box>
                    <StatCard
                        title="Robots Activos"
                        value="8"
                        icon={<SmartToyIcon />}
                        color={theme.palette.primary.main}
                    />
                </Box>
                <Box>
                    <StatCard
                        title="Tanques en Uso"
                        value="12"
                        icon={<WaterDropIcon />}
                        color={theme.palette.info.main}
                    />
                </Box>
                <Box>
                    <StatCard
                        title="Malezas Detectadas"
                        value="156"
                        icon={<GrassIcon />}
                        color={theme.palette.success.main}
                    />
                </Box>
                <Box>
                    <StatCard
                        title="Jornadas Hoy"
                        value="5"
                        icon={<CalendarTodayIcon />}
                        color={theme.palette.warning.main}
                    />
                </Box>
            </Box>

            {/* Gráficos de tendencias */}
            <Box sx={{ mt: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <Box>
                    <Card sx={{ height: '100%', minHeight: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Actividad de Robots
                            </Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="robots" stroke={theme.palette.primary.main} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Box>
                <Box>
                    <Card sx={{ height: '100%', minHeight: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Malezas Detectadas
                            </Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={activityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="malezas" fill={theme.palette.success.main} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Calendario de Jornadas */}
            <Box sx={{ mt: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Próximas Jornadas
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="small"
                            >
                                Nueva Jornada
                            </Button>
                        </Box>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
                            {jornadas.map((jornada) => (
                                <Card key={jornada.id} variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            {jornada.titulo}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Fecha: {new Date(jornada.fecha).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Estado: {jornada.estado}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Gestión de Robots */}
            <Box sx={{ mt: 3 }}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Gestión de Robots
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setOpenRobotDialog(true)}
                            >
                                Agregar Robot
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Batería</TableCell>
                                        <TableCell>Última Actividad</TableCell>
                                        <TableCell>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {robots.map((robot) => (
                                        <TableRow key={robot.id}>
                                            <TableCell>{robot.id}</TableCell>
                                            <TableCell>{robot.nombre}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        bgcolor: 
                                                            robot.estado === 'Disponible' ? 'success.light' :
                                                            robot.estado === 'En Operación' ? 'info.light' :
                                                            'warning.light',
                                                        color: 
                                                            robot.estado === 'Disponible' ? 'success.dark' :
                                                            robot.estado === 'En Operación' ? 'info.dark' :
                                                            'warning.dark',
                                                    }}
                                                >
                                                    {robot.estado}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={robot.bateria}
                                                        sx={{
                                                            width: 100,
                                                            mr: 1,
                                                            height: 8,
                                                            borderRadius: 4,
                                                        }}
                                                    />
                                                    {robot.bateria}%
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(robot.ultima_actividad).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteRobot(robot.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>

            {/* Dialog para agregar robot */}
            <Dialog open={openRobotDialog} onClose={() => setOpenRobotDialog(false)}>
                <DialogTitle>Agregar Nuevo Robot</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Nombre del Robot"
                            fullWidth
                            value={newRobot.nombre}
                            onChange={(e) => setNewRobot({ ...newRobot, nombre: e.target.value })}
                        />
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={newRobot.estado}
                                label="Estado"
                                onChange={(e) => setNewRobot({ ...newRobot, estado: e.target.value })}
                            >
                                <MenuItem value="Disponible">Disponible</MenuItem>
                                <MenuItem value="En Mantenimiento">En Mantenimiento</MenuItem>
                                <MenuItem value="En Operación">En Operación</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRobotDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAddRobot} variant="contained">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardPage; 