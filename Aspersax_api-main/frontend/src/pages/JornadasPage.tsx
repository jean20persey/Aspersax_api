<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 30311b5 (Primer commit: API Aspersax)
import {
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
<<<<<<< HEAD
    MenuItem
=======
    MenuItem,
    Alert,
    Snackbar,
    IconButton,
    Tooltip,
    Chip
>>>>>>> 30311b5 (Primer commit: API Aspersax)
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
<<<<<<< HEAD
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/PageHeader';

interface Jornada {
    id: number;
    titulo: string;
    fecha: string;
    estado: string;
}

const JornadasPage: React.FC = () => {
    const [jornadas, setJornadas] = useState<Jornada[]>([
        { id: 1, titulo: 'Fumigación Sector A', fecha: '2024-03-19', estado: 'Pendiente' },
        { id: 2, titulo: 'Mantenimiento Robots', fecha: '2024-03-20', estado: 'Completado' },
        { id: 3, titulo: 'Inspección Sector B', fecha: '2024-03-21', estado: 'En Progreso' }
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newJornada, setNewJornada] = useState({
        titulo: '',
        fecha: dayjs(),
        estado: 'Pendiente'
    });

    const handleAddJornada = () => {
        const jornadaToAdd: Jornada = {
            id: jornadas.length + 1,
            titulo: newJornada.titulo,
            fecha: newJornada.fecha.format('YYYY-MM-DD'),
            estado: newJornada.estado
        };
        setJornadas([...jornadas, jornadaToAdd]);
        setOpenDialog(false);
        setNewJornada({
            titulo: '',
            fecha: dayjs(),
            estado: 'Pendiente'
        });
    };

=======
import dayjs, { Dayjs } from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../components/PageHeader';
import { jornadasService, robotsService, tanquesService } from '../services/api';

interface Jornada {
    id_jornada: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    duracion: string;
    area_tratada: number;
    robot: {
        id_robot: number;
        nombre: string;
    } | null;
    tanque: {
        id_tanque: number;
        nombre: string;
    } | null;
    activo: boolean;
}

interface JornadaFormData {
    fecha: Dayjs;
    hora_inicio: string;
    hora_fin: string;
    area_tratada: string | number;
    robot_id: number | null;
    tanque_id: number | null;
}

const JornadasPage: React.FC = () => {
    const [robots, setRobots] = useState<{ id_robot: number; nombre: string }[]>([]);
    const [tanques, setTanques] = useState<{ id_tanque: number; nombre: string }[]>([]);

    useEffect(() => {
        // Cargar robots y tanques al montar el componente
        const fetchRobots = async () => {
            try {
                const res = await robotsService.getAll();
                setRobots(res.data);
            } catch (error) {
                setRobots([]);
            }
        };
        const fetchTanques = async () => {
            try {
                const res = await tanquesService.getAll();
                setTanques(res.data);
            } catch (error) {
                setTanques([]);
            }
        };
        fetchRobots();
        fetchTanques();
    }, []);
    const [jornadas, setJornadas] = useState<Jornada[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingJornada, setEditingJornada] = useState<Jornada | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info'
    });

    const [formData, setFormData] = useState<JornadaFormData>({
        fecha: dayjs(),
        hora_inicio: '08:00',
        hora_fin: '12:00',
        area_tratada: 0,
        robot_id: null,
        tanque_id: null,
    });

    const fetchJornadas = async () => {
        try {
            const response = await jornadasService.getAll();
            setJornadas(response.data);
        } catch (error) {
            console.error('Error al cargar las jornadas:', error);
            setAlert({
                open: true,
                message: 'Error al cargar las jornadas',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchJornadas();
    }, []);

    const handleOpenDialog = (jornada?: Jornada) => {
        if (jornada) {
            // Modo edición
            setEditingJornada(jornada);
            setIsEditMode(true);
            setFormData({
                fecha: dayjs(jornada.fecha),
                hora_inicio: jornada.hora_inicio,
                hora_fin: jornada.hora_fin,
                area_tratada: jornada.area_tratada,
                robot_id: jornada.robot ? jornada.robot.id_robot : null,
                tanque_id: jornada.tanque ? jornada.tanque.id_tanque : null,
            });
        } else {
            // Modo creación
            setEditingJornada(null);
            setIsEditMode(false);
            setFormData({
                fecha: dayjs(),
                hora_inicio: '08:00',
                hora_fin: '12:00',
                area_tratada: 0,
                robot_id: null,
                tanque_id: null,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingJornada(null);
        setIsEditMode(false);
        setFormData({
            fecha: dayjs(),
            hora_inicio: '08:00',
            hora_fin: '12:00',
            area_tratada: 0,
            robot_id: null,
            tanque_id: null,
        });
    };

    const handleSubmit = async () => {
        // Validar robot y tanque
        if (!formData.robot_id || !formData.tanque_id) {
            setAlert({
                open: true,
                message: 'Debes seleccionar un robot y un tanque.',
                severity: 'error'
            });
            return;
        }
        // Validar área tratada
        let areaTratada: number;
        if (typeof formData.area_tratada === 'string') {
            const valor = formData.area_tratada.replace(',', '.');
            areaTratada = parseFloat(valor);
        } else {
            areaTratada = formData.area_tratada;
        }
        if (isNaN(areaTratada) || areaTratada <= 0) {
            setAlert({
                open: true,
                message: 'El campo Área Tratada debe ser un número mayor a 0.',
                severity: 'error'
            });
            return;
        }

        try {
            // Asegurar formato HH:mm para hora_inicio y hora_fin
            const formatHour = (h: string) => {
                let hour = h.replace(/\s*(a\. m\.|p\. m\.|AM|PM|am|pm)/gi, '').trim();
                if (/\d{1,2}:\d{2}/.test(hour)) {
                    if (/p\. m\.|PM|pm/i.test(h) && parseInt(hour.split(':')[0], 10) < 12) {
                        const [h1, m1] = hour.split(':');
                        hour = `${parseInt(h1, 10) + 12}:${m1}`;
                    }
                    if (/a\. m\.|AM|am/i.test(h) && parseInt(hour.split(':')[0], 10) === 12) {
                        const [h1, m1] = hour.split(':');
                        hour = `00:${m1}`;
                    }
                }
                return hour;
            };

            const dataToSend = {
                fecha: formData.fecha.format('YYYY-MM-DD'),
                hora_inicio: formatHour(formData.hora_inicio),
                hora_fin: formatHour(formData.hora_fin),
                area_tratada: areaTratada,
                robot: formData.robot_id,
                tanque: formData.tanque_id,
            };

            if (isEditMode && editingJornada) {
                await jornadasService.update(editingJornada.id_jornada, dataToSend);
                setAlert({
                    open: true,
                    message: 'Jornada actualizada exitosamente',
                    severity: 'success'
                });
            } else {
                await jornadasService.create(dataToSend);
                setAlert({
                    open: true,
                    message: 'Jornada creada exitosamente',
                    severity: 'success'
                });
            }
            handleCloseDialog();
            fetchJornadas();
        } catch (error) {
            console.error('Error al guardar la jornada:', error);
            setAlert({
                open: true,
                message: 'Error al guardar la jornada',
                severity: 'error'
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta jornada?')) {
            try {
                await jornadasService.delete(id);
                setAlert({
                    open: true,
                    message: 'Jornada eliminada exitosamente',
                    severity: 'success'
                });
                fetchJornadas(); // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar la jornada:', error);
                setAlert({
                    open: true,
                    message: 'Error al eliminar la jornada',
                    severity: 'error'
                });
            }
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Pendiente':
                return 'warning';
            case 'En Progreso':
                return 'info';
            case 'Completado':
                return 'success';
            case 'Cancelado':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    const formatTime = (timeString: string) => {
        return dayjs(`2000-01-01T${timeString}`).format('HH:mm');
    };

>>>>>>> 30311b5 (Primer commit: API Aspersax)
    return (
        <Box>
            <PageHeader title="Gestión de Jornadas" />
            
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
<<<<<<< HEAD
                    onClick={() => setOpenDialog(true)}
=======
                    onClick={() => handleOpenDialog()}
                    sx={{ borderRadius: 2 }}
>>>>>>> 30311b5 (Primer commit: API Aspersax)
                >
                    Nueva Jornada
                </Button>
            </Box>

<<<<<<< HEAD
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Estado</TableCell>
=======
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Horario</TableCell>
                            <TableCell>Área (m²)</TableCell>
                            <TableCell>Robot</TableCell>
                            <TableCell>Tanque</TableCell>
>>>>>>> 30311b5 (Primer commit: API Aspersax)
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jornadas.map((jornada) => (
<<<<<<< HEAD
                            <TableRow key={jornada.id}>
                                <TableCell>{jornada.titulo}</TableCell>
                                <TableCell>{jornada.fecha}</TableCell>
                                <TableCell>{jornada.estado}</TableCell>
                                <TableCell>
                                    <Button color="primary" size="small">
                                        Editar
                                    </Button>
                                    <Button color="error" size="small">
                                        Eliminar
                                    </Button>
=======
                            <TableRow key={jornada.id_jornada}>
                                <TableCell>{jornada.id_jornada}</TableCell>
                                <TableCell>{formatDate(jornada.fecha)}</TableCell>
                                <TableCell>
                                    {formatTime(jornada.hora_inicio)} - {formatTime(jornada.hora_fin)}
                                </TableCell>
                                <TableCell>{jornada.area_tratada.toFixed(1)}</TableCell>
                                <TableCell>
                                    {jornada.robot ? jornada.robot.nombre : 'Sin robot'}
                                </TableCell>
                                <TableCell>
                                    {jornada.tanque ? jornada.tanque.nombre : 'Sin tanque'}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Editar">
                                            <IconButton 
                                                size="small" 
                                                color="primary"
                                                onClick={() => handleOpenDialog(jornada)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleDelete(jornada.id_jornada)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
>>>>>>> 30311b5 (Primer commit: API Aspersax)
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

<<<<<<< HEAD
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Nueva Jornada</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Título"
                            value={newJornada.titulo}
                            onChange={(e) => setNewJornada({ ...newJornada, titulo: e.target.value })}
                            fullWidth
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha"
                                value={newJornada.fecha}
                                onChange={(newValue) => setNewJornada({ ...newJornada, fecha: newValue || dayjs() })}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={newJornada.estado}
                                label="Estado"
                                onChange={(e) => setNewJornada({ ...newJornada, estado: e.target.value })}
                            >
                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                <MenuItem value="En Progreso">En Progreso</MenuItem>
                                <MenuItem value="Completado">Completado</MenuItem>
=======
            {jornadas.length === 0 && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No hay jornadas registradas en el sistema
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Utiliza el botón "Nueva Jornada" para comenzar a registrar jornadas
                    </Typography>
                </Box>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {isEditMode ? 'Editar Jornada' : 'Nueva Jornada'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Fecha"
                                value={formData.fecha}
                                onChange={(newValue) => setFormData({ ...formData, fecha: newValue || dayjs() })}
                                sx={{ width: '100%' }}
                            />
                        </LocalizationProvider>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Hora de Inicio"
                                type="time"
                                value={formData.hora_inicio}
                                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Hora de Fin"
                                type="time"
                                value={formData.hora_fin}
                                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>

                        <TextField
                            label="Área Tratada (m²)"
                            type="text"
                            value={formData.area_tratada}
                            onChange={(e) => {
                                const valor = e.target.value.replace(',', '.');
                                setFormData({ ...formData, area_tratada: valor });
                            }}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel id="robot-label">Robot</InputLabel>
                            <Select
                                labelId="robot-label"
                                value={formData.robot_id ?? ''}
                                label="Robot"
                                onChange={(e) => setFormData({ ...formData, robot_id: Number(e.target.value) })}
                            >
                                <MenuItem value=""><em>Selecciona un robot</em></MenuItem>
                                {robots.map((robot) => (
                                    <MenuItem key={robot.id_robot} value={robot.id_robot}>{robot.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="tanque-label">Tanque</InputLabel>
                            <Select
                                labelId="tanque-label"
                                value={formData.tanque_id ?? ''}
                                label="Tanque"
                                onChange={(e) => setFormData({ ...formData, tanque_id: Number(e.target.value) })}
                            >
                                <MenuItem value=""><em>Selecciona un tanque</em></MenuItem>
                                {tanques.map((tanque) => (
                                    <MenuItem key={tanque.id_tanque} value={tanque.id_tanque}>{tanque.nombre}</MenuItem>
                                ))}
>>>>>>> 30311b5 (Primer commit: API Aspersax)
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
<<<<<<< HEAD
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAddJornada} variant="contained" color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
=======
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {isEditMode ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert
                    onClose={() => setAlert({ ...alert, open: false })}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        </Box>
    );
};

export default JornadasPage; 