import React, { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Chip,
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
  cantidad_romaza: number;
  descripcion: string;
  temporada: string;
  resistencia_herbicida: boolean;
}

const VALORES_INICIALES: MalezaFormData = {
  nombre: '',
  nombre_cientifico: 'Rumex crispus',
  cantidad_romaza: 0,
  descripcion: '',
  temporada: '',
  resistencia_herbicida: false,
};

const MalezaForm: React.FC<MalezaFormProps> = ({ open, onClose, onSubmit, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<MalezaFormData>(VALORES_INICIALES);

  React.useEffect(() => {
    if (initialData && open) {
      setFormData(initialData);
    } else if (!isEditing && open) {
      setFormData(VALORES_INICIALES);
    }
  }, [initialData, isEditing, open]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad_romaza' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(VALORES_INICIALES);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <span>
            {isEditing ? '✏️ Editar Detección de Romaza' : '🌿 Nueva Detección de Romaza'}
          </span>
          <Chip
            label="Finca La Riverita"
            size="small"
            sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          Maleza objetivo: <em>Rumex crispus</em> (Romaza)
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <TextField
              required
              name="nombre"
              label="Área / Lote de la Finca"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Lote 1, Sector Norte, Potrero Sur"
              fullWidth
              helperText="Indique el sector de Finca La Riverita donde se detectó la Romaza"
            />

            <TextField
              name="nombre_cientifico"
              label="Nombre Científico"
              value={formData.nombre_cientifico}
              onChange={handleInputChange}
              placeholder="Rumex crispus"
              fullWidth
              helperText="Por defecto: Rumex crispus (Romaza)"
            />

            <TextField
              required
              type="number"
              name="cantidad_romaza"
              label="Cantidad de plantas Romaza detectadas"
              value={formData.cantidad_romaza}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0 }}
              helperText="Número total de plantas de Romaza encontradas en el área"
            />

            <TextField
              name="temporada"
              label="Temporada de detección"
              value={formData.temporada}
              onChange={handleInputChange}
              placeholder="Ej: Época de lluvias 2025, Verano 2026"
              fullWidth
            />

            <TextField
              name="descripcion"
              label="Observaciones del área"
              value={formData.descripcion}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
              placeholder="Describa las condiciones del área: estado del suelo, densidad del cultivo, etc."
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.resistencia_herbicida}
                  onChange={(e) => setFormData(prev => ({ ...prev, resistencia_herbicida: e.target.checked }))}
                  name="resistencia_herbicida"
                  color="warning"
                />
              }
              label="⚠️ Romaza con resistencia al herbicida"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="success">
            {isEditing ? 'Actualizar Registro' : 'Guardar Detección'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MalezaForm;
