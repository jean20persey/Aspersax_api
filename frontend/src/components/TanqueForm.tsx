import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface TanqueFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tanqueData: TanqueFormData) => void;
  initialData?: TanqueFormData;
  isEditing?: boolean;
}

export interface TanqueFormData {
  nombre: string;
  capacidad: number;
  nivel_actual: number;
}

const TanqueForm: React.FC<TanqueFormProps> = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<TanqueFormData>({
    nombre: '',
    capacidad: 0,
    nivel_actual: 0,
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData({
        nombre: '',
        capacidad: 0,
        nivel_actual: 0,
      });
    }
  }, [initialData, isEditing, open]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['capacidad', 'nivel_actual'].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      nombre: '',
      capacidad: 1000,
      nivel_actual: 0,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Tanque' : 'Agregar Nuevo Tanque'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              name="nombre"
              label="Nombre del Tanque"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
            />
            
            <TextField
              required
              name="capacidad"
              label="Capacidad (L)"
              type="number"
              value={formData.capacidad}
              onChange={handleInputChange}
              inputProps={{ min: 1 }}
              fullWidth
            />

            <TextField
              required
              name="nivel_actual"
              label="Nivel Actual (L)"
              type="number"
              value={formData.nivel_actual}
              onChange={handleInputChange}
              inputProps={{ min: 0, max: formData.capacidad }}
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

export default TanqueForm;
