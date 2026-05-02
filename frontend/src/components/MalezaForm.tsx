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
  FormControlLabel,
  Switch,
} from '@mui/material';

interface MalezaFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (malezaData: MalezaFormData) => void;
  initialData?: MalezaFormData;
  isEditing?: boolean;
}

export interface MalezaFormData {
  nombre: string;
  nombre_cientifico: string;
  tipo: 'Hoja Ancha' | 'Hoja Angosta' | 'Gramínea' | 'Otra';
  descripcion: string;
  temporada: string;
  resistencia_herbicida: boolean;
}

const MalezaForm: React.FC<MalezaFormProps> = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<MalezaFormData>({
    nombre: '',
    nombre_cientifico: '',
    tipo: 'Otra',
    descripcion: '',
    temporada: '',
    resistencia_herbicida: false,
  });

  React.useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData({
        nombre: '',
        nombre_cientifico: '',
        tipo: 'Otra',
        descripcion: '',
        temporada: '',
        resistencia_herbicida: false,
      });
    }
  }, [initialData, isEditing, open]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      nombre: '',
      nombre_cientifico: '',
      tipo: 'Otra',
      descripcion: '',
      temporada: '',
      resistencia_herbicida: false,
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
              name="nombre"
              label="Nombre Común"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Yuyo Colorado"
              fullWidth
            />

            <TextField
              name="nombre_cientifico"
              label="Nombre Científico"
              value={formData.nombre_cientifico}
              onChange={handleInputChange}
              placeholder="Ej: Amaranthus retroflexus"
              fullWidth
            />
            
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                label="Tipo"
                onChange={handleSelectChange}
              >
                <MenuItem value="Hoja Ancha">Hoja Ancha</MenuItem>
                <MenuItem value="Hoja Angosta">Hoja Angosta</MenuItem>
                <MenuItem value="Gramínea">Gramínea</MenuItem>
                <MenuItem value="Otra">Otra</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="descripcion"
              label="Descripción"
              value={formData.descripcion}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              name="temporada"
              label="Temporada"
              value={formData.temporada}
              onChange={handleInputChange}
              placeholder="Ej: Primavera-Verano"
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.resistencia_herbicida}
                  onChange={(e) => setFormData(prev => ({ ...prev, resistencia_herbicida: e.target.checked }))}
                  name="resistencia_herbicida"
                />
              }
              label="¿Tiene resistencia a herbicida?"
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

export default MalezaForm;
