<<<<<<< HEAD
import React from 'react';
import { Typography, Box } from '@mui/material';

const TanquesPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Tanques
            </Typography>
            <Typography variant="body1">
                Administra los tanques del sistema
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
import { tanquesService } from '../services/api';
import PageHeader from '../components/PageHeader';
import AddIcon from '@mui/icons-material/Add';

interface Tanque {
  id_tanque: number;
  nombre: string;
  capacidad: number;
  nivel_actual: number;
  estado: string;
  ultima_recarga: string;
  activo: boolean;
}

const TanquesPage: React.FC = () => {
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info'
  });

  const fetchTanques = async () => {
    try {
      const response = await tanquesService.getAll();
      setTanques(response.data);
    } catch (error) {
      console.error('Error al cargar los tanques:', error);
      setAlert({
        open: true,
        message: 'Error al cargar los tanques',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchTanques();
  }, []);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Lleno':
        return 'success';
      case 'Medio':
        return 'warning';
      case 'Bajo':
        return 'error';
      case 'Vacío':
        return 'error';
      default:
        return 'default';
    }
  };

  const getNivelColor = (nivel: number, capacidad: number) => {
    const porcentaje = (nivel / capacidad) * 100;
    if (porcentaje > 70) return 'success';
    if (porcentaje > 30) return 'warning';
    return 'error';
  };

  return (
    <div>
      <PageHeader title="Gestión de Tanques" />
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => {
            // TODO: Implementar formulario para agregar tanque
            setAlert({
              open: true,
              message: 'Funcionalidad de agregar tanque en desarrollo',
              severity: 'info'
            });
          }}
        >
          Agregar Tanque
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Capacidad (L)</TableCell>
              <TableCell>Nivel Actual (L)</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Última Recarga</TableCell>
              <TableCell>Porcentaje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tanques.map((tanque) => {
              const porcentaje = Math.round((tanque.nivel_actual / tanque.capacidad) * 100);
              return (
                <TableRow key={tanque.id_tanque}>
                  <TableCell>{tanque.id_tanque}</TableCell>
                  <TableCell>{tanque.nombre}</TableCell>
                  <TableCell>{tanque.capacidad}</TableCell>
                  <TableCell>{tanque.nivel_actual}</TableCell>
                  <TableCell>
                    <Chip 
                      label={tanque.estado} 
                      color={getEstadoColor(tanque.estado) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(tanque.ultima_recarga).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${porcentaje}%`}
                      color={getNivelColor(tanque.nivel_actual, tanque.capacidad) as any}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {tanques.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No hay tanques registrados en el sistema
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Utiliza el botón "Agregar Tanque" para comenzar a registrar tanques
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

export default TanquesPage; 