import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { robotsService, tanquesService, Robot, Tanque } from '../services/api';

interface JornadaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (jornadaData: JornadaFormData) => void;
  initialData?: JornadaFormData;
  isEditing?: boolean;
}

export interface JornadaFormData {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  duracion: string; // "HH:MM:SS"
  area_tratada: number;
  robot: number; // FK id
  tanque: number; // FK id
}

const JornadaForm: React.FC<JornadaFormProps> = ({ open, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState<JornadaFormData>({
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '08:00',
    hora_fin: '12:00',
    duracion: '04:00:00',
    area_tratada: 0,
    robot: 0,
    tanque: 0,
  });

  const [robots, setRobots] = useState<Robot[]>([]);
  const [tanques, setTanques] = useState<Tanque[]>([]);

  useEffect(() => {
    if (open) {
      // Cargar robots y tanques desde la API
      robotsService.getAll().then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setRobots(data);
        } else if (data && (data as any).results) {
          setRobots((data as any).results);
        }
      }).catch(err => console.error('Error cargando robots:', err));

      tanquesService.getAll().then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setTanques(data);
        } else if (data && (data as any).results) {
          setTanques((data as any).results);
        }
      }).catch(err => console.error('Error cargando tanques:', err));
    }
  }, [open]);

  useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: '08:00',
        hora_fin: '12:00',
        duracion: '04:00:00',
        area_tratada: 0,
        robot: 0,
        tanque: 0,
      });
    }
  }, [initialData, open, isEditing]);

  // Auto-calcular duración cuando cambian hora_inicio y hora_fin
  useEffect(() => {
    if (formData.hora_inicio && formData.hora_fin) {
      const [hi, mi] = formData.hora_inicio.split(':').map(Number);
      const [hf, mf] = formData.hora_fin.split(':').map(Number);
      const totalMinStart = hi * 60 + mi;
      const totalMinEnd = hf * 60 + mf;
      if (totalMinEnd > totalMinStart) {
        const diff = totalMinEnd - totalMinStart;
        const hours = Math.floor(diff / 60).toString().padStart(2, '0');
        const mins = (diff % 60).toString().padStart(2, '0');
        setFormData(prev => ({ ...prev, duracion: `${hours}:${mins}:00` }));
      }
    }
  }, [formData.hora_inicio, formData.hora_fin]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['area_tratada'].includes(name) ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      hora_inicio: '08:00',
      hora_fin: '12:00',
      duracion: '04:00:00',
      area_tratada: 0,
      robot: 0,
      tanque: 0,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Jornada' : 'Agregar Nueva Jornada'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="fecha"
              label="Fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                required
                name="hora_inicio"
                label="Hora Inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                required
                name="hora_fin"
                label="Hora Fin"
                type="time"
                value={formData.hora_fin}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            <TextField
              name="duracion"
              label="Duración (calculada)"
              value={formData.duracion}
              InputProps={{ readOnly: true }}
              fullWidth
              helperText="Se calcula automáticamente"
            />

            <FormControl fullWidth required>
              <InputLabel>Robot</InputLabel>
              <Select
                name="robot"
                value={formData.robot || ''}
                label="Robot"
                onChange={handleSelectChange}
              >
                <MenuItem value="" disabled>
                  Selecciona un robot
                </MenuItem>
                {robots.map(robot => (
                  <MenuItem key={robot.id_robot} value={robot.id_robot}>
                    {robot.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Tanque</InputLabel>
              <Select
                name="tanque"
                value={formData.tanque || ''}
                label="Tanque"
                onChange={handleSelectChange}
              >
                <MenuItem value="" disabled>
                  Selecciona un tanque
                </MenuItem>
                {tanques.map(tanque => (
                  <MenuItem key={tanque.id_tanque} value={tanque.id_tanque}>
                    {tanque.nombre} ({tanque.nivel_actual}L / {tanque.capacidad}L)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              name="area_tratada"
              label="Área Tratada (hectáreas)"
              type="number"
              value={formData.area_tratada}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: 0.1 }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JornadaForm;
