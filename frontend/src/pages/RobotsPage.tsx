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
} from '@mui/material';
import { robotsService } from '../services/api';
import PageHeader from '../components/PageHeader';
import AddIcon from '@mui/icons-material/Add';

interface Robot {
  id: number;
  nombre: string;
  estado: string;
  bateria: number;
  ultima_actividad: string;
}

const RobotsPage = () => {
  const [robots, setRobots] = useState<Robot[]>([]);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const response = await robotsService.getAll();
        setRobots(response.data);
      } catch (error) {
        console.error('Error al cargar los robots:', error);
      }
    };

    fetchRobots();
  }, []);

  return (
    <div>
      <PageHeader title="Robots" />
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
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
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {robots.map((robot) => (
              <TableRow key={robot.id}>
                <TableCell>{robot.id}</TableCell>
                <TableCell>{robot.nombre}</TableCell>
                <TableCell>{robot.estado}</TableCell>
                <TableCell>{robot.bateria}%</TableCell>
                <TableCell>{new Date(robot.ultima_actividad).toLocaleString()}</TableCell>
                <TableCell>
                  <Button color="primary" size="small">
                    Editar
                  </Button>
                  <Button color="error" size="small">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RobotsPage; 