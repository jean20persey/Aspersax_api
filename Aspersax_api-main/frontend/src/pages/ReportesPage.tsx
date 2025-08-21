<<<<<<< HEAD
import React from 'react';
import { Typography, Box } from '@mui/material';

const ReportesPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Reportes
            </Typography>
            <Typography variant="body1">
                Visualiza los reportes del sistema
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { reportesService } from '../services/api';
import PageHeader from '../components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

interface Reporte {
  id_reporte: number;
  fecha: string;
  tipo: string;
  robot: {
    id_robot: number;
    nombre: string;
  } | null;
  tanque: {
    id_tanque: number;
    nombre: string;
  } | null;
  area_cubierta: number;
  herbicida_usado: number;
  duracion: string;
  observaciones: string;
  activo: boolean;
}

const ReportesPage: React.FC = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info'
  });

  const fetchReportes = async () => {
    try {
      const response = await reportesService.getAll();
      setReportes(response.data);
    } catch (error) {
      console.error('Error al cargar los reportes:', error);
      setAlert({
        open: true,
        message: 'Error al cargar los reportes',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Jornada':
        return 'success';
      case 'Mantenimiento':
        return 'warning';
      case 'Incidente':
        return 'error';
      case 'Recarga':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDuration = (duration: string) => {
    // Convertir la duración de formato ISO a formato legible
    try {
      const hours = Math.floor(parseInt(duration) / 3600);
      const minutes = Math.floor((parseInt(duration) % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } catch {
      return duration;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <PageHeader title="Reportes del Sistema" />
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => {
            // TODO: Implementar formulario para agregar reporte
            setAlert({
              open: true,
              message: 'Funcionalidad de agregar reporte en desarrollo',
              severity: 'info'
            });
          }}
        >
          Crear Reporte
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Robot</TableCell>
              <TableCell>Tanque</TableCell>
              <TableCell>Área (m²)</TableCell>
              <TableCell>Herbicida (L)</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportes.map((reporte) => (
              <TableRow key={reporte.id_reporte}>
                <TableCell>{reporte.id_reporte}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(reporte.fecha)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={reporte.tipo} 
                    color={getTipoColor(reporte.tipo) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {reporte.robot ? (
                    <Typography variant="body2" fontWeight="medium">
                      {reporte.robot.nombre}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin robot
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {reporte.tanque ? (
                    <Typography variant="body2" fontWeight="medium">
                      {reporte.tanque.nombre}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Sin tanque
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {reporte.area_cubierta.toFixed(1)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {reporte.herbicida_usado.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDuration(reporte.duracion)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Ver Detalles">
                      <IconButton size="small" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Descargar PDF">
                      <IconButton size="small" color="secondary">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {reportes.length === 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No hay reportes registrados en el sistema
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Utiliza el botón "Crear Reporte" para comenzar a registrar reportes
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

export default ReportesPage; 