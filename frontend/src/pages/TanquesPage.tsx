import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    IconButton, 
    Tooltip, 
    Chip, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Snackbar,
    Alert,
    LinearProgress
} from '@mui/material';
import { 
    WaterDrop as TanqueIcon, 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { tanquesService, Tanque } from '../services/api';
import TanqueForm, { TanqueFormData } from '../components/TanqueForm';
import ReadOnlyModeAlert from '../components/ReadOnlyModeAlert';
import { ConditionalButton, ConditionalIconButton } from '../components/ConditionalButton';

const TanquesPage: React.FC = () => {
    const [tanques, setTanques] = useState<Tanque[]>([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [editingTanque, setEditingTanque] = useState<Tanque | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning'
    });

    const fetchTanques = async () => {
        setLoading(true);
        try {
            const response = await tanquesService.getAll();
            const data = response.data;
            if (Array.isArray(data)) {
                setTanques(data);
            } else if (data && (data as any).results) {
                setTanques((data as any).results);
            }
        } catch (error) {
            console.error('Error al cargar los tanques:', error);
            setAlert({
                open: true,
                message: 'Error al cargar los tanques del servidor',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTanques();
    }, []);

    const handleAddTanque = async (tanqueData: TanqueFormData) => {
        try {
            if (editingTanque) {
                await tanquesService.update(editingTanque.id_tanque, tanqueData);
                setAlert({
                    open: true,
                    message: 'Tanque actualizado exitosamente',
                    severity: 'success'
                });
            } else {
                await tanquesService.create(tanqueData);
                setAlert({
                    open: true,
                    message: 'Tanque agregado exitosamente',
                    severity: 'success'
                });
            }
            
            setOpenForm(false);
            setEditingTanque(null);
            fetchTanques();
        } catch (error: any) {
            console.error('Error al procesar el tanque:', error);
            setAlert({
                open: true,
                message: 'Error al procesar la solicitud',
                severity: 'error'
            });
        }
    };

    const handleDeleteTanque = async (tanqueId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tanque?')) {
            try {
                await tanquesService.delete(tanqueId);
                setAlert({
                    open: true,
                    message: 'Tanque eliminado exitosamente',
                    severity: 'success'
                });
                fetchTanques();
            } catch (error) {
                setAlert({
                    open: true,
                    message: 'Error al eliminar el tanque',
                    severity: 'error'
                });
            }
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Lleno': return 'success';
            case 'Medio': return 'warning';
            case 'Bajo': return 'error';
            case 'Vacío': return 'default';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TanqueIcon color="primary" sx={{ fontSize: 40 }} />
                        Gestión de Tanques
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Control de inventario de herbicidas y nivel de tanques.
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Actualizar">
                        <IconButton onClick={fetchTanques} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    
                    <ConditionalButton 
                        permission="canManageTanques"
                        variant="contained" 
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setEditingTanque(null);
                            setOpenForm(true);
                        }}
                    >
                        Nuevo Tanque
                    </ConditionalButton>
                </Box>
            </Box>

            <ReadOnlyModeAlert featureName="los tanques y niveles de herbicida" />

            <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={0}>
                    {loading && <LinearProgress sx={{ height: 4 }} />}
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Capacidad</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Nivel Actual</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Última Recarga</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tanques.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                        No hay tanques registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tanques.map((tanque) => (
                                    <TableRow key={tanque.id_tanque} hover>
                                        <TableCell>{tanque.id_tanque}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{tanque.nombre}</TableCell>
                                        <TableCell>{tanque.capacidad}L</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body2">{tanque.nivel_actual}L</Typography>
                                                <Box sx={{ flexGrow: 1, minWidth: 50 }}>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={(tanque.nivel_actual / tanque.capacidad) * 100} 
                                                        color={getEstadoColor(tanque.estado) as any}
                                                        sx={{ height: 6, borderRadius: 3 }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {Math.round((tanque.nivel_actual / tanque.capacidad) * 100)}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={tanque.estado} 
                                                color={getEstadoColor(tanque.estado) as any}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                                            {new Date(tanque.ultima_recarga).toLocaleString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <ConditionalIconButton 
                                                    permission="canManageTanques"
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => {
                                                        setEditingTanque(tanque);
                                                        setOpenForm(true);
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </ConditionalIconButton>
                                                <ConditionalIconButton 
                                                    permission="canManageTanques"
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDeleteTanque(tanque.id_tanque)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </ConditionalIconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <TanqueForm
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                    setEditingTanque(null);
                }}
                onSubmit={handleAddTanque}
                initialData={editingTanque ? {
                    nombre: editingTanque.nombre,
                    capacidad: editingTanque.capacidad,
                    nivel_actual: editingTanque.nivel_actual,
                } : undefined}
                isEditing={!!editingTanque}
            />

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={alert.severity}
                    sx={{ width: '100%', borderRadius: '8px' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default TanquesPage;