import React, { useState, ChangeEvent } from 'react';
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
import mockDataService from '../services/mockDataService';

interface JornadaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (jornadaData: JornadaFormData) => void;
  initialData?: JornadaFormData;
  isEditing?: boolean;
}

export interface JornadaFormData {
  fecha: string;
  robot_id: number;
  robot_nombre: string;
  area_cubierta: number;
  malezas_detectadas: number;
  herbicida_usado: number;
  duracion: number;
  estado: 'Completada' | 'En Progreso' | 'Pausada' | 'Programada' | 'Cancelada';
}

const JornadaForm: React.FC<JornadaFormProps> = ({ open, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState<JornadaFormData>({
    fecha: new Date().toISOString().split('T')[0],
    robot_id: 0,
    robot_nombre: '',
    area_cubierta: 0,
    malezas_detectadas: 0,
    herbicida_usado: 0,
    duracion: 0,
    estado: 'Programada',
  });

  React.useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        robot_id: 0,
        robot_nombre: '',
        area_cubierta: 0,
        malezas_detectadas: 0,
        herbicida_usado: 0,
        duracion: 0,
        estado: 'Programada',
      });
    }
  }, [initialData, open, isEditing]);

  const robots = mockDataService.getRobots();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['robot_id', 'area_cubierta', 'malezas_detectadas', 'herbicida_usado', 'duracion'].includes(name) 
        ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const selectedRobotId = Number(e.target.value);
    const selectedRobot = robots.find(robot => robot.id_robot === selectedRobotId);
    
    setFormData(prev => ({
      ...prev,
      robot_id: selectedRobotId,
      robot_nombre: selectedRobot ? selectedRobot.nombre : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      robot_id: 0,
      robot_nombre: '',
      area_cubierta: 0,
      malezas_detectadas: 0,
      herbicida_usado: 0,
      duracion: 0,
      estado: 'Programada',
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
            
            <FormControl fullWidth required>
              <InputLabel>Robot</InputLabel>
              <Select
                name="robot_id"
                value={formData.robot_id || ''}
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

            <TextField
              required
              name="area_cubierta"
              label="Área Cubierta (hectáreas)"
              type="number"
              value={formData.area_cubierta}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: 0.1 }}
              fullWidth
            />

            <TextField
              required
              name="malezas_detectadas"
              label="Malezas Detectadas"
              type="number"
              value={formData.malezas_detectadas}
              onChange={handleInputChange}
              inputProps={{ min: 0 }}
              fullWidth
            />

            <TextField
              required
              name="herbicida_usado"
              label="Herbicida Usado (L)"
              type="number"
              value={formData.herbicida_usado}
              onChange={handleInputChange}
              inputProps={{ min: 0, step: 0.1 }}
              fullWidth
            />

            <TextField
              required
              name="duracion"
              label="Duración (minutos)"
              type="number"
              value={formData.duracion}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                label="Estado"
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as any }))}
              >
                <MenuItem value="Programada">Programada</MenuItem>
                <MenuItem value="En Progreso">En Progreso</MenuItem>
                <MenuItem value="Pausada">Pausada</MenuItem>
                <MenuItem value="Completada">Completada</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
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
