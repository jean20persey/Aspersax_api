import React, { useState } from 'react';
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
    MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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

    return (
        <Box>
            <PageHeader title="Gestión de Jornadas" />
            
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Nueva Jornada
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jornadas.map((jornada) => (
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleAddJornada} variant="contained" color="primary">
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default JornadasPage; 