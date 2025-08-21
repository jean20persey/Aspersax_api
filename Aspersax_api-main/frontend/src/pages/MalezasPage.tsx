<<<<<<< HEAD
import React from 'react';
import { Typography, Box } from '@mui/material';

const MalezasPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Malezas
            </Typography>
            <Typography variant="body1">
                Administra el catálogo de malezas
            </Typography>
        </Box>
    );
=======
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Alert,
  Snackbar,
  Typography,
  Chip,
} from '@mui/material';
import { malezasService } from '../services/api';
import PageHeader from '../components/PageHeader';
import AddIcon from '@mui/icons-material/Add';

interface Maleza {
  id_maleza: number;
  nombre: string;
  nombre_cientifico: string;
  tipo: string;
  descripcion: string;
  temporada: string;
  resistencia_herbicida: boolean;
  activo: boolean;
}

const MalezasPage: React.FC = () => {
  const [malezas, setMalezas] = useState<Maleza[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info'
  });

  const fetchMalezas = async () => {
    try {
      const response = await malezasService.getAll();
      setMalezas(response.data);
    } catch (error) {
      console.error('Error al cargar las malezas:', error);
      setAlert({
        open: true,
        message: 'Error al cargar las malezas',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchMalezas();
  }, []);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Hoja Ancha':
        return 'primary';
      case 'Gramínea':
        return 'secondary';
      case 'Cyperácea':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getResistenciaColor = (resistencia: boolean) => {
    return resistencia ? 'error' : 'success';
  };

  const getTemporadaColor = (temporada: string) => {
    if (temporada.includes('Primavera')) return 'success';
    if (temporada.includes('Verano')) return 'warning';
    if (temporada.includes('Otoño')) return 'error';
    if (temporada.includes('Invierno')) return 'info';
    return 'default';
  };

  return (
    <div>
      <PageHeader title="Gestión de Malezas" />
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => {
            // TODO: Implementar formulario para agregar maleza
            setAlert({
              open: true,
              message: 'Funcionalidad de agregar maleza en desarrollo',
              severity: 'info'
            });
          }}
        >
          Agregar Maleza
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Nombre Científico</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Temporada</TableCell>
              <TableCell>Resistencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {malezas.map((maleza) => (
              <TableRow key={maleza.id_maleza}>
                <TableCell>{maleza.id_maleza}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {maleza.nombre}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontStyle="italic" color="textSecondary">
                    {maleza.nombre_cientifico}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={maleza.tipo} 
                    color={getTipoColor(maleza.tipo) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {maleza.descripcion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={maleza.temporada}
                    color={getTemporadaColor(maleza.temporada) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={maleza.resistencia_herbicida ? 'Resistente' : 'Sensible'}
                    color={getResistenciaColor(maleza.resistencia_herbicida) as any}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {malezas.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No hay malezas registradas en el sistema
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Utiliza el botón "Agregar Maleza" para comenzar a registrar malezas
          </Typography>
        </Box>
      )}

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
    </div>
  );
>>>>>>> 30311b5 (Primer commit: API Aspersax)
};

export default MalezasPage; 