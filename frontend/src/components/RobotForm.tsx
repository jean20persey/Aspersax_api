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

interface RobotFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (robotData: RobotFormData) => void;
  initialData?: RobotFormData;
  isEditing?: boolean;
}

export interface RobotFormData {
  nombre: string;
  estado: 'Disponible' | 'En Mantenimiento' | 'En Operación';
  bateria: number;
}

const RobotForm: React.FC<RobotFormProps> = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<RobotFormData>({
    nombre: '',
    estado: 'Disponible',
    bateria: 100,
  });

  React.useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData({
        nombre: '',
        estado: 'Disponible',
        bateria: 100,
      });
    }
  }, [initialData, isEditing, open]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'bateria' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      estado: e.target.value as 'Disponible' | 'En Mantenimiento' | 'En Operación'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: '',
      estado: 'Disponible',
      bateria: 100,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Robot' : 'Agregar Nuevo Robot'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="nombre"
              label="Nombre del Robot"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                label="Estado"
                onChange={handleSelectChange}
              >
                <MenuItem value="Disponible">Disponible</MenuItem>
                <MenuItem value="En Mantenimiento">En Mantenimiento</MenuItem>
                <MenuItem value="En Operación">En Operación</MenuItem>
                <MenuItem value="Fuera de Servicio">Fuera de Servicio</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              name="bateria"
              label="Nivel de Batería"
              type="number"
              value={formData.bateria}
              onChange={handleInputChange}
              inputProps={{ min: 0, max: 100 }}
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

export default RobotForm; 