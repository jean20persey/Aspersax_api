import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Tooltip,
    CircularProgress,
    Skeleton
} from '@mui/material';
import {
    SmartToy as RobotIcon,
    Settings as SettingsIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Visibility as ViewIcon,
    Battery3Bar as BatteryIcon,
    LocationOn as LocationIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Timeline as TimelineIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';
import ProtectedComponent from '../components/ProtectedComponent';
import { ConditionalButton, ConditionalIconButton } from '../components/ConditionalButton';
import { robotsService } from '../services/api';

interface Robot {
    id: number;
    nombre: string;
    modelo: string;
    estado: 'En Operación' | 'Mantenimiento' | 'Inactivo';
    bateria: number;
    ubicacion_x: number;
    ubicacion_y: number;
    fecha_ultimo_mantenimiento: string;
}

const RobotsPageEnhanced: React.FC = () => {
    const [robots, setRobots] = useState<Robot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
    const [openControlDialog, setOpenControlDialog] = useState(false);
    const [openConfigDialog, setOpenConfigDialog] = useState(false);
    const userRole = usePermissions();

    if (!userRole) {
        return <Typography>Cargando permisos...</Typography>;
    }

    useEffect(() => {
        cargarRobots();
    }, []);

    const cargarRobots = async () => {
        try {
            const response = await robotsService.getAll();
            setRobots(response.data || []);
        } catch (error) {
            console.error('Error al cargar robots:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleControlRobot = (robot: Robot, accion: 'iniciar' | 'detener') => {
        console.log(`${accion} robot:`, robot.nombre);
        // Aquí iría la lógica de control real
        setOpenControlDialog(false);
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'En Operación': return 'success';
            case 'Mantenimiento': return 'warning';
            case 'Inactivo': return 'error';
            default: return 'default';
        }
    };

    const getBateriaColor = (bateria: number) => {
        if (bateria > 60) return 'success';
        if (bateria > 30) return 'warning';
        return 'error';
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <RobotIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                                Gestión de Robots
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Cargando información de robots...
                            </Typography>
                        </Box>
                    </Box>
                    <CircularProgress />
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Box key={item} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Skeleton variant="text" width={120} height={32} />
                                            <Skeleton variant="text" width={100} height={24} />
                                        </Box>
                                        <Skeleton variant="circular" width={32} height={32} />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Skeleton variant="rounded" width={80} height={24} />
                                        <Skeleton variant="rounded" width={60} height={24} />
                                    </Box>
                                    <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 1 }} />
                                    <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 2 }} />
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Skeleton variant="circular" width={32} height={32} />
                                        <Skeleton variant="circular" width={32} height={32} />
                                        <Skeleton variant="circular" width={32} height={32} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <RobotIcon sx={{ mr: 2, fontSize: '2rem', color: 'primary.main' }} />
                        Gestión de Robots
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {robots.length} robot{robots.length !== 1 ? 's' : ''} registrado{robots.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Actualizar lista">
                        <IconButton onClick={cargarRobots} color="primary">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    
                    <ProtectedComponent permission="canControlRobots">
                        <ConditionalButton
                            permission="canControlRobots"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => console.log('Agregar robot')}
                        >
                            Agregar Robot
                        </ConditionalButton>
                    </ProtectedComponent>
                </Box>
            </Box>

            {/* Vista para Administradores */}
            <ProtectedComponent permission="canControlRobots" showFallback={false}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Modo Administrador - Control Completo
                    </Typography>
                    <Typography variant="body2">
                        Puedes controlar, configurar y gestionar todos los robots del sistema.
                    </Typography>
                </Alert>
            </ProtectedComponent>

            {/* Vista para Usuarios Normales - mostrar solo si NO es admin */}
            {!userRole.isAdmin && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Modo Visualización
                    </Typography>
                    <Typography variant="body2">
                        Puedes consultar el estado y ubicación de los robots, pero no controlarlos.
                    </Typography>
                </Alert>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {robots.map((robot) => (
                    <Box key={`robot-${robot.id}`} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }}>
                        <Card sx={{ 
                            height: '100%',
                            border: robot.estado === 'En Operación' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                            boxShadow: robot.estado === 'En Operación' ? '0 4px 20px rgba(76, 175, 80, 0.3)' : 2,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: robot.estado === 'En Operación' ? '0 8px 25px rgba(76, 175, 80, 0.4)' : 4
                            }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                            {robot.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                            <SpeedIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                                            {robot.modelo}
                                        </Typography>
                                    </Box>
                                    <RobotIcon 
                                        sx={{ 
                                            color: robot.estado === 'En Operación' ? 'success.main' : 'primary.main',
                                            fontSize: '2rem',
                                            animation: robot.estado === 'En Operación' ? 'pulse 2s infinite' : 'none',
                                            '@keyframes pulse': {
                                                '0%': { opacity: 1 },
                                                '50%': { opacity: 0.7 },
                                                '100%': { opacity: 1 }
                                            }
                                        }} 
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={robot.estado}
                                        color={getEstadoColor(robot.estado) as any}
                                        size="small"
                                        sx={{ mb: 1, mr: 1 }}
                                    />
                                    <Chip
                                        icon={<BatteryIcon />}
                                        label={`${robot.bateria}%`}
                                        color={getBateriaColor(robot.bateria) as any}
                                        size="small"
                                        sx={{ mb: 1 }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <LocationIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Posición: ({robot.ubicacion_x}, {robot.ubicacion_y})
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <TimelineIcon fontSize="small" color="info" sx={{ mr: 1 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                        Último mantenimiento: {new Date(robot.fecha_ultimo_mantenimiento).toLocaleDateString('es-ES')}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    {/* Botón de ver - todos pueden verlo */}
                                    <Tooltip title="Ver detalles">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => setSelectedRobot(robot)}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>

                                    {/* Botones de control - solo administradores */}
                                    <ConditionalIconButton
                                        permission="canControlRobots"
                                        size="small"
                                        onClick={() => {
                                            setSelectedRobot(robot);
                                            setOpenControlDialog(true);
                                        }}
                                        disabledTooltip="Solo administradores pueden controlar robots"
                                    >
                                        {robot.estado === 'En Operación' ? <StopIcon /> : <StartIcon />}
                                    </ConditionalIconButton>

                                    <ConditionalIconButton
                                        permission="canControlRobots"
                                        size="small"
                                        onClick={() => {
                                            setSelectedRobot(robot);
                                            setOpenConfigDialog(true);
                                        }}
                                        disabledTooltip="Solo administradores pueden configurar robots"
                                    >
                                        <SettingsIcon />
                                    </ConditionalIconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            {/* Dialog de Control de Robot */}
            <Dialog open={openControlDialog} onClose={() => setOpenControlDialog(false)}>
                <DialogTitle>
                    Control de Robot: {selectedRobot?.nombre}
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        Estado actual: <Chip label={selectedRobot?.estado} size="small" />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ¿Qué acción deseas realizar?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenControlDialog(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        color="success"
                        onClick={() => selectedRobot && handleControlRobot(selectedRobot, 'iniciar')}
                    >
                        Iniciar
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        onClick={() => selectedRobot && handleControlRobot(selectedRobot, 'detener')}
                    >
                        Detener
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog de Configuración */}
            <Dialog open={openConfigDialog} onClose={() => setOpenConfigDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Configurar Robot: {selectedRobot?.nombre}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Nombre del Robot"
                            defaultValue={selectedRobot?.nombre}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                defaultValue={selectedRobot?.estado}
                                label="Estado"
                            >
                                <MenuItem value="En Operación">En Operación</MenuItem>
                                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                                <MenuItem value="Inactivo">Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Ubicación X"
                            type="number"
                            defaultValue={selectedRobot?.ubicacion_x}
                            fullWidth
                        />
                        <TextField
                            label="Ubicación Y"
                            type="number"
                            defaultValue={selectedRobot?.ubicacion_y}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfigDialog(false)}>
                        Cancelar
                    </Button>
                    <Button variant="contained">
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RobotsPageEnhanced;
