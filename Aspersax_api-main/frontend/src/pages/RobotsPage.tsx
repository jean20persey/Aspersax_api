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
} from '@mui/material';
import robotsService from '../services/robotsService';
import PageHeader from '../components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import RobotForm, { RobotFormData } from '../components/RobotForm';

interface Robot {
  id_robot: number;
  nombre: string;
  estado: string;
  bateria: number;
  ultima_actividad: string;
  activo: boolean;
}

const RobotsPage = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchRobots = async () => {
    try {
      const response = await robotsService.getAll();
      setRobots(response.data);
    } catch (error) {
      console.error('Error al cargar los robots:', error);
      setAlert({
        open: true,
        message: 'Error al cargar los robots',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  const handleAddRobot = async (robotData: RobotFormData) => {
    try {
      await robotsService.create(robotData);
      setAlert({
        open: true,
        message: 'Robot agregado exitosamente',
        severity: 'success'
      });
      setOpenForm(false);
      fetchRobots(); // Recargar la lista de robots
    } catch (error) {
      console.error('Error al agregar el robot:', error);
      setAlert({
        open: true,
        message: 'Error al agregar el robot',
        severity: 'error'
      });
    }
  };

<<<<<<< HEAD
  const handleDeleteRobot = async (id_robot: number) => {
    try {
      await robotsService.delete(id_robot);
      setAlert({
        open: true,
        message: 'Robot eliminado exitosamente',
        severity: 'success'
      });
      fetchRobots(); // Recargar la lista de robots
    } catch (error) {
      console.error('Error al eliminar el robot:', error);
      setAlert({
        open: true,
        message: 'Error al eliminar el robot',
        severity: 'error'
      });
    }
  };

=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
  return (
    <div>
      <PageHeader title="Robots" />
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
          onClick={() => setOpenForm(true)}
        >
          Agregar Robot
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Batería</TableCell>
              <TableCell>Última Actividad</TableCell>
<<<<<<< HEAD
              <TableCell>Acciones</TableCell>
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            </TableRow>
          </TableHead>
          <TableBody>
            {robots.map((robot) => (
              <TableRow key={robot.id_robot}>
                <TableCell>{robot.id_robot}</TableCell>
                <TableCell>{robot.nombre}</TableCell>
                <TableCell>{robot.estado}</TableCell>
                <TableCell>{robot.bateria}%</TableCell>
                <TableCell>{new Date(robot.ultima_actividad).toLocaleString()}</TableCell>
<<<<<<< HEAD
                <TableCell>
                  <Button color="primary" size="small">
                    Editar
                  </Button>
                  <Button 
                    color="error" 
                    size="small"
                    onClick={() => handleDeleteRobot(robot.id_robot)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RobotForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAddRobot}
      />

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
};

export default RobotsPage; 