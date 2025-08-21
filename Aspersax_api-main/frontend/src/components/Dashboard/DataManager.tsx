import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Alert,
    Tabs,
    Tab,
    useTheme,
} from '@mui/material';
import {
    Edit,
    Delete,
    Add,
    SmartToy,
    WaterDrop,
    Grass,
    Save,
    Cancel,
} from '@mui/icons-material';

interface Robot {
    id_robot: number;
    nombre: string;
    estado: string;
    bateria: number;
    ultima_actividad: string;
}

interface Tank {
    id_tanque: number;
    nombre: string;
    capacidad: number;
    nivel_actual: number;
    estado: string;
}

interface Weed {
    id_maleza: number;
    nombre: string;
    nombre_cientifico: string;
    tipo: string;
    descripcion: string;
    temporada: string;
    resistencia_herbicida: boolean;
}

interface DataManagerProps {
    robotStats: Robot[];
    tankStats: Tank[];
    weedStats: any[];
    onDataUpdate: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({
    robotStats,
    tankStats,
    weedStats,
    onDataUpdate,
}) => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editingType, setEditingType] = useState<'robot' | 'tank' | 'weed'>('robot');
    const [formData, setFormData] = useState<any>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const robotEstados = ['Disponible', 'En Operación', 'En Mantenimiento', 'Fuera de Servicio'];
    const tankEstados = ['Lleno', 'Medio', 'Bajo', 'Vacío'];
    const weedTipos = ['Hoja Ancha', 'Gramínea', 'Enredadera', 'Suculenta'];

    const handleEdit = (item: any, type: 'robot' | 'tank' | 'weed') => {
        setEditingItem(item);
        setEditingType(type);
        setFormData({ ...item });
        setEditDialogOpen(true);
    };

    const handleDelete = (item: any, type: 'robot' | 'tank' | 'weed') => {
        setEditingItem(item);
        setEditingType(type);
        setDeleteDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            setError(null);
            let endpoint = '';
            let data = { ...formData };

            switch (editingType) {
                case 'robot':
                    endpoint = `/api/robots/${editingItem.id_robot}/actualizar/`;
                    break;
                case 'tank':
                    endpoint = `/api/tanques/tanques/${editingItem.id_tanque}/`;
                    break;
                case 'weed':
                    endpoint = `/api/malezas/malezas/${editingItem.id_maleza}/`;
                    break;
            }

            const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess('Datos actualizados correctamente');
                setEditDialogOpen(false);
                onDataUpdate();
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const errorData = await response.json();
                setError(`Error al actualizar: ${errorData.detail || 'Error desconocido'}`);
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            setError(null);
            let endpoint = '';

            switch (editingType) {
                case 'robot':
                    endpoint = `/api/robots/${editingItem.id_robot}/eliminar/`;
                    break;
                case 'tank':
                    endpoint = `/api/tanques/tanques/${editingItem.id_tanque}/`;
                    break;
                case 'weed':
                    endpoint = `/api/malezas/malezas/${editingItem.id_maleza}/`;
                    break;
            }

            const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setSuccess('Elemento eliminado correctamente');
                setDeleteDialogOpen(false);
                onDataUpdate();
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const errorData = await response.json();
                setError(`Error al eliminar: ${errorData.detail || 'Error desconocido'}`);
            }
        } catch (err) {
            setError('Error de conexión');
        }
    };

    const renderRobotForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                        value={formData.estado || ''}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        label="Estado"
                    >
                        {robotEstados.map((estado) => (
                            <MenuItem key={estado} value={estado}>
                                {estado}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Batería (%)"
                    type="number"
                    value={formData.bateria || 0}
                    onChange={(e) => setFormData({ ...formData, bateria: parseInt(e.target.value) })}
                    inputProps={{ min: 0, max: 100 }}
                />
            </Grid>
        </Grid>
    );

    const renderTankForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Capacidad (L)"
                    type="number"
                    value={formData.capacidad || 0}
                    onChange={(e) => setFormData({ ...formData, capacidad: parseFloat(e.target.value) })}
                    inputProps={{ min: 0 }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Nivel Actual (L)"
                    type="number"
                    value={formData.nivel_actual || 0}
                    onChange={(e) => setFormData({ ...formData, nivel_actual: parseFloat(e.target.value) })}
                    inputProps={{ min: 0 }}
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select
                        value={formData.estado || ''}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        label="Estado"
                    >
                        {tankEstados.map((estado) => (
                            <MenuItem key={estado} value={estado}>
                                {estado}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );

    const renderWeedForm = () => (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.nombre || ''}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Nombre Científico"
                    value={formData.nombre_cientifico || ''}
                    onChange={(e) => setFormData({ ...formData, nombre_cientifico: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        value={formData.tipo || ''}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        label="Tipo"
                    >
                        {weedTipos.map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                                {tipo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Temporada"
                    value={formData.temporada || ''}
                    onChange={(e) => setFormData({ ...formData, temporada: e.target.value })}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Descripción"
                    multiline
                    rows={3}
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
            </Grid>
        </Grid>
    );

    return (
        <Box>
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Gestión de Datos
                    </Typography>

                    <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
                        <Tab icon={<SmartToy />} label="Robots" />
                        <Tab icon={<WaterDrop />} label="Tanques" />
                        <Tab icon={<Grass />} label="Malezas" />
                    </Tabs>

                    {/* Robots Tab */}
                    {tabValue === 0 && (
                        <List>
                            {robotStats.map((robot) => (
                                <ListItem key={robot.id_robot} divider>
                                    <ListItemText
                                        primary={robot.nombre}
                                        secondary={`Estado: ${robot.estado} | Batería: ${robot.bateria}%`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleEdit(robot, 'robot')}
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(robot, 'robot')}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {/* Tanks Tab */}
                    {tabValue === 1 && (
                        <List>
                            {tankStats.map((tank) => (
                                <ListItem key={tank.id_tanque} divider>
                                    <ListItemText
                                        primary={tank.nombre}
                                        secondary={`${tank.nivel_actual}L / ${tank.capacidad}L | Estado: ${tank.estado}`}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleEdit(tank, 'tank')}
                                            sx={{ mr: 1 }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(tank, 'tank')}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}

                    {/* Weeds Tab */}
                    {tabValue === 2 && (
                        <List>
                            {weedStats.map((weed) => (
                                <ListItem key={weed.maleza__nombre} divider>
                                    <ListItemText
                                        primary={weed.maleza__nombre}
                                        secondary={`Total detectado: ${weed.total} unidades`}
                                    />
                                    <ListItemSecondaryAction>
                                        <Chip
                                            label={`${weed.total} unidades`}
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1 }}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Editar {editingType === 'robot' ? 'Robot' : editingType === 'tank' ? 'Tanque' : 'Maleza'}
                </DialogTitle>
                <DialogContent>
                    {editingType === 'robot' && renderRobotForm()}
                    {editingType === 'tank' && renderTankForm()}
                    {editingType === 'weed' && renderWeedForm()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} startIcon={<Cancel />}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar{' '}
                        <strong>
                            {editingItem?.nombre || editingItem?.maleza__nombre}
                        </strong>
                        ?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DataManager;
