import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import DashboardStats from '../components/Dashboard/DashboardStats';
import ActivityCharts from '../components/Dashboard/ActivityCharts';
import RealTimeStatus from '../components/Dashboard/RealTimeStatus';

interface ActivityData {
  fecha: string;
  malezas_detectadas: number;
  area_cubierta: number;
  robots_activos: number;
  tanques_uso: number;
}

interface RobotStatus {
  id: number;
  nombre: string;
  bateria: number;
  estado: 'activo' | 'inactivo' | 'error';
}

interface TankStatus {
  id: number;
  nombre: string;
  nivel: number;
  estado: 'lleno' | 'medio' | 'bajo' | 'vacio';
}

// Datos de ejemplo para la actividad
const mockActivityData: ActivityData[] = [
  {
    fecha: '2025-05-30',
    malezas_detectadas: 150,
    area_cubierta: 2500,
    robots_activos: 4,
    tanques_uso: 3
  },
  {
    fecha: '2025-05-31',
    malezas_detectadas: 180,
    area_cubierta: 3000,
    robots_activos: 5,
    tanques_uso: 4
  },
  {
    fecha: '2025-06-01',
    malezas_detectadas: 120,
    area_cubierta: 2800,
    robots_activos: 3,
    tanques_uso: 2
  },
  {
    fecha: '2025-06-02',
    malezas_detectadas: 200,
    area_cubierta: 3500,
    robots_activos: 5,
    tanques_uso: 4
  },
  {
    fecha: '2025-06-03',
    malezas_detectadas: 160,
    area_cubierta: 3200,
    robots_activos: 4,
    tanques_uso: 3
  },
  {
    fecha: '2025-06-04',
    malezas_detectadas: 190,
    area_cubierta: 3800,
    robots_activos: 5,
    tanques_uso: 4
  },
  {
    fecha: '2025-06-05',
    malezas_detectadas: 220,
    area_cubierta: 4000,
    robots_activos: 5,
    tanques_uso: 5
  }
];

// Datos de ejemplo para robots
const mockRobots: RobotStatus[] = [
  { id: 1, nombre: 'Robot-001', bateria: 85, estado: 'activo' },
  { id: 2, nombre: 'Robot-002', bateria: 92, estado: 'activo' },
  { id: 3, nombre: 'Robot-003', bateria: 45, estado: 'inactivo' },
  { id: 4, nombre: 'Robot-004', bateria: 78, estado: 'activo' },
  { id: 5, nombre: 'Robot-005', bateria: 15, estado: 'error' }
];

// Datos de ejemplo para tanques
const mockTanks: TankStatus[] = [
  { id: 1, nombre: 'Tanque-001', nivel: 95, estado: 'lleno' },
  { id: 2, nombre: 'Tanque-002', nivel: 65, estado: 'medio' },
  { id: 3, nombre: 'Tanque-003', nivel: 30, estado: 'bajo' },
  { id: 4, nombre: 'Tanque-004', nivel: 82, estado: 'lleno' },
  { id: 5, nombre: 'Tanque-005', nivel: 5, estado: 'vacio' }
];

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [stats, setStats] = useState({
    robots_activos: '3/5',
    tanques_uso: '4/5',
    malezas_detectadas: 220,
    area_cubierta: 4000
  });
  const [activityData, setActivityData] = useState<ActivityData[]>(mockActivityData);
  const [robotStatus, setRobotStatus] = useState<RobotStatus[]>(mockRobots);
  const [tankStatus, setTankStatus] = useState<TankStatus[]>(mockTanks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulación de carga de datos
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          robots_activos: '3/5',
          tanques_uso: '4/5',
          malezas_detectadas: 220,
          area_cubierta: 4000
        });
        setActivityData(mockActivityData);
        setRobotStatus(mockRobots);
        setTankStatus(mockTanks);
      } catch (err) {
        setError('Error al cargar los datos del dashboard. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Simulación de actualización en tiempo real
    const interval = setInterval(() => {
      // Actualizar aleatoriamente el nivel de batería y tanques
      setRobotStatus(prev => prev.map(robot => ({
        ...robot,
        bateria: Math.max(0, Math.min(100, robot.bateria + (Math.random() > 0.5 ? 1 : -1)))
      })));
      
      setTankStatus(prev => prev.map(tank => ({
        ...tank,
        nivel: Math.max(0, Math.min(100, tank.nivel + (Math.random() > 0.5 ? 1 : -1)))
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <DatePicker
              label="Fecha inicial"
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small'
                }
              }}
            />
            <DatePicker
              label="Fecha final"
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  size: 'small'
                }
              }}
            />
          </LocalizationProvider>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <DashboardStats stats={stats} />
            <Box sx={{ mt: 3 }}>
              <RealTimeStatus robots={robotStatus} tanks={tankStatus} />
            </Box>
            <Box sx={{ mt: 3 }}>
              <ActivityCharts data={activityData} />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard; 