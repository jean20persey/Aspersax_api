import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
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
    Tooltip
} from '@mui/material';
import {
    SmartToy as RobotIcon,
    Settings as SettingsIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Battery3Bar as BatteryIcon,
    LocationOn as LocationIcon
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

    if (loading) return <Typography>Cargando robots...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestión de Robots
                </Typography>
                
                <ProtectedComponent permission="canControlRobots">
                    <ConditionalButton
                        permission="canControlRobots"
                        variant="contained"
                        startIcon={<RobotIcon />}
                        onClick={() => console.log('Agregar robot')}
                    >
                        Agregar Robot
                    </ConditionalButton>
                </ProtectedComponent>
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

            {/* Vista para Usuarios Normales */}
            <ProtectedComponent requiredRole="viewer" showFallback={false}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Modo Visualización
                    </Typography>
                    <Typography variant="body2">
                        Puedes consultar el estado y ubicación de los robots, pero no controlarlos.
                    </Typography>
                </Alert>
            </ProtectedComponent>

            <Grid container spacing={3}>
                {robots.map((robot) => (
                    <Grid item xs={12} md={6} lg={4} key={robot.id}>
                        <Card sx={{ 
                            height: '100%',
                            border: robot.estado === 'En Operación' ? '2px solid #4caf50' : '1px solid #e0e0e0'
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            {robot.nombre}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {robot.modelo}
                                        </Typography>
                                    </Box>
                                    <RobotIcon color="primary" />
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

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        X: {robot.ubicacion_x}, Y: {robot.ubicacion_y}
                                    </Typography>
                                </Box>

                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                    Último mantenimiento: {new Date(robot.fecha_ultimo_mantenimiento).toLocaleDateString()}
                                </Typography>

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
                    </Grid>
                ))}
            </Grid>

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
