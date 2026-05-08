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
    Tooltip,
    CircularProgress,
    Skeleton,
    Snackbar,
    Alert
} from '@mui/material';
import {
    SmartToy as RobotIcon,
    Settings as SettingsIcon,
    PlayArrow as StartIcon,
    Stop as StopIcon,
    Visibility as ViewIcon,
    Battery3Bar as BatteryIcon,
    Add as AddIcon,
    Refresh as RefreshIcon,
    Speed as SpeedIcon
} from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';
import { ConditionalButton, ConditionalIconButton } from '../components/ConditionalButton';
import ReadOnlyModeAlert from '../components/ReadOnlyModeAlert';
import robotsService from '../services/robotsService';

interface Robot {
    id_robot: number;
    nombre: string;
    estado: 'Disponible' | 'En Mantenimiento' | 'En Operación' | 'Fuera de Servicio';
    bateria: number;
    ultima_actividad: string;
    activo: boolean;
}

const RobotsPage: React.FC = () => {
    const [robots, setRobots] = useState<Robot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
    const [openControlDialog, setOpenControlDialog] = useState(false);
    const [openConfigDialog, setOpenConfigDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    
    const userRole = usePermissions();

    useEffect(() => {
        cargarRobots();
    }, []);

    const cargarRobots = async () => {
        setLoading(true);
        try {
            const response = await robotsService.getAll();
            // La API puede devolver results si está paginada. Usamos any para evitar error de tipado en la validación dinámica.
            const apiData = response.data as any;
            const data = apiData.results || apiData;
            setRobots(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar robots:', error);
            setSnackbar({ open: true, message: 'Error al conectar con el servidor', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleControlRobot = (robot: Robot, accion: 'iniciar' | 'detener') => {
        console.log(`${accion} robot:`, robot.nombre);
        // Lógica de control simulada o real
        setSnackbar({ 
            open: true, 
            message: `Acción '${accion}' enviada al robot ${robot.nombre}`, 
            severity: 'success' 
        });
        setOpenControlDialog(false);
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'En Operación': return 'success';
            case 'En Mantenimiento': return 'warning';
            case 'Fuera de Servicio': return 'error';
            case 'Disponible': return 'info';
            default: return 'default';
        }
    };

    const getBateriaColor = (bateria: number) => {
        if (bateria > 60) return 'success';
        if (bateria > 30) return 'warning';
        return 'error';
    };

    if (!userRole && loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', fontWeight: 700, mb: 1 }}>
                        <RobotIcon sx={{ mr: 2, fontSize: '2.5rem', color: 'primary.main' }} />
                        Gestión de Robots
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitoreo y control de la flota de robots aspersores.
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Actualizar lista">
                        <IconButton onClick={cargarRobots} color="primary" disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    
                    <ConditionalButton
                        permission="canControlRobots"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => console.log('Agregar robot')}
                    >
                        Nuevo Robot
                    </ConditionalButton>
                </Box>
            </Box>

            <ReadOnlyModeAlert featureName="los robots aspersores" />

            {loading ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" width={345} height={200} sx={{ borderRadius: 4 }} />
                    ))}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {robots.length === 0 ? (
                        <Typography variant="body1" sx={{ width: '100%', textAlign: 'center', py: 5 }}>
                            No se encontraron robots registrados.
                        </Typography>
                    ) : (
                        robots.map((robot) => (
                            <Box key={`robot-${robot.id_robot}`} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }}>
                                <Card sx={{ 
                                    height: '100%',
                                    borderRadius: '16px',
                                    border: robot.estado === 'En Operación' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                                    boxShadow: robot.estado === 'En Operación' ? '0 4px 20px rgba(76, 175, 80, 0.2)' : 2,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                    {robot.nombre}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <SpeedIcon sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                                                    ID: {robot.id_robot}
                                                </Typography>
                                            </Box>
                                            <RobotIcon 
                                                color={robot.estado === 'En Operación' ? 'success' : 'primary'} 
                                                sx={{ fontSize: '2rem' }} 
                                            />
                                        </Box>

                                        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={robot.estado}
                                                color={getEstadoColor(robot.estado) as any}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                            <Chip
                                                icon={<BatteryIcon />}
                                                label={`${robot.bateria}%`}
                                                color={getBateriaColor(robot.bateria) as any}
                                                variant="outlined"
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                                            <Tooltip title="Ver detalles">
                                                <IconButton size="small" onClick={() => setSelectedRobot(robot)}>
                                                    <ViewIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <ConditionalIconButton
                                                permission="canControlRobots"
                                                size="small"
                                                color="primary"
                                                onClick={() => {
                                                    setSelectedRobot(robot);
                                                    setOpenControlDialog(true);
                                                }}
                                            >
                                                {robot.estado === 'En Operación' ? <StopIcon fontSize="small" /> : <StartIcon fontSize="small" />}
                                            </ConditionalIconButton>

                                            <ConditionalIconButton
                                                permission="canControlRobots"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedRobot(robot);
                                                    setOpenConfigDialog(true);
                                                }}
                                            >
                                                <SettingsIcon fontSize="small" />
                                            </ConditionalIconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))
                    )}
                </Box>
            )}

            {/* Diálogos y Snackbar heredados de la lógica mejorada */}
            <Dialog open={openControlDialog} onClose={() => setOpenControlDialog(false)}>
                <DialogTitle sx={{ fontWeight: 700 }}>Control de Robot</DialogTitle>
                <DialogContent>
                    <Typography>¿Desea cambiar el estado de operación de <strong>{selectedRobot?.nombre}</strong>?</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenControlDialog(false)}>Cancelar</Button>
                    <Button 
                        variant="contained" 
                        color={selectedRobot?.estado === 'En Operación' ? 'error' : 'success'}
                        onClick={() => selectedRobot && handleControlRobot(selectedRobot, selectedRobot.estado === 'En Operación' ? 'detener' : 'iniciar')}
                    >
                        {selectedRobot?.estado === 'En Operación' ? 'Detener Robot' : 'Iniciar Robot'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de Configuración de Robot */}
            <Dialog open={openConfigDialog} onClose={() => setOpenConfigDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Configuración de {selectedRobot?.nombre}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Ajustes técnicos y parámetros de operación para el robot.
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="body1">Panel de configuración en desarrollo</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenConfigDialog(false)}>Cerrar</Button>
                    <Button variant="contained" onClick={() => setOpenConfigDialog(false)}>Guardar Cambios</Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ borderRadius: '8px', width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RobotsPage;