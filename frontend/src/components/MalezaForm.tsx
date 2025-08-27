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

interface MalezaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (malezaData: MalezaFormData) => void;
  initialData?: MalezaFormData;
  isEditing?: boolean;
}

export interface MalezaFormData {
  tipo: string;
  ubicacion_x: number;
  ubicacion_y: number;
  fecha_deteccion: string;
  estado: 'Detectada' | 'Tratada' | 'Eliminada';
  robot_detector: string;
  nivel_infestacion: 'Bajo' | 'Medio' | 'Alto';
}

const MalezaForm: React.FC<MalezaFormProps> = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<MalezaFormData>({
    tipo: '',
    ubicacion_x: 0,
    ubicacion_y: 0,
    fecha_deteccion: new Date().toISOString().split('T')[0],
    estado: 'Detectada',
    robot_detector: '',
    nivel_infestacion: 'Medio',
  });

  React.useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData({
        tipo: '',
        ubicacion_x: 0,
        ubicacion_y: 0,
        fecha_deteccion: new Date().toISOString().split('T')[0],
        estado: 'Detectada',
        robot_detector: '',
        nivel_infestacion: 'Medio',
      });
    }
  }, [initialData, isEditing, open]);

  const robots = mockDataService.getRobots();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['ubicacion_x', 'ubicacion_y'].includes(name) ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      tipo: '',
      ubicacion_x: 0,
      ubicacion_y: 0,
      fecha_deteccion: new Date().toISOString().split('T')[0],
      estado: 'Detectada',
      robot_detector: '',
      nivel_infestacion: 'Medio',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Maleza' : 'Agregar Nueva Maleza'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="tipo"
              label="Tipo de Maleza"
              value={formData.tipo}
              onChange={handleInputChange}
              placeholder="Ej: Amaranthus retroflexus (Yuyo Colorado)"
              fullWidth
            />
            
            <TextField
              required
              name="ubicacion_x"
              label="Ubicación X"
              type="number"
              value={formData.ubicacion_x}
              onChange={handleInputChange}
              inputProps={{ step: 0.1 }}
              fullWidth
            />

            <TextField
              required
              name="ubicacion_y"
              label="Ubicación Y"
              type="number"
              value={formData.ubicacion_y}
              onChange={handleInputChange}
              inputProps={{ step: 0.1 }}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Robot Detector</InputLabel>
              <Select
                name="robot_detector"
                value={formData.robot_detector}
                label="Robot Detector"
                onChange={handleSelectChange}
              >
                {robots.map(robot => (
                  <MenuItem key={robot.id_robot} value={robot.nombre}>
                    {robot.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Nivel de Infestación</InputLabel>
              <Select
                name="nivel_infestacion"
                value={formData.nivel_infestacion}
                label="Nivel de Infestación"
                onChange={handleSelectChange}
              >
                <MenuItem value="Bajo">Bajo</MenuItem>
                <MenuItem value="Medio">Medio</MenuItem>
                <MenuItem value="Alto">Alto</MenuItem>
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

export default MalezaForm;
