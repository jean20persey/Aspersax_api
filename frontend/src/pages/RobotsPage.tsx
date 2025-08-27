import { useEffect, useState } from 'react';
import {
  Alert,
  Snackbar,
} from '@mui/material';
import robotsService from '../services/robotsService';
import mockDataService, { Robot } from '../services/mockDataService';
import RobotForm, { RobotFormData } from '../components/RobotForm';

const RobotsPage: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingRobot, setEditingRobot] = useState<Robot | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning'
  });

  const fetchRobots = async () => {
    try {
      console.log('Intentando cargar robots...');
      
      // Primero cargar datos mock para asegurar que siempre hay datos
      const robotsMock = mockDataService.getRobots();
      setRobots(robotsMock);
      
      // Intentar cargar datos de la API
      const response = await robotsService.getAll();
      console.log('Respuesta del servidor:', response);
      
      // Si la API responde correctamente, usar esos datos
      if (response && response.data && Array.isArray(response.data)) {
        const robotsData = response.data.map((robot: any) => ({
          ...robot,
          estado: robot.estado as Robot['estado']
        }));
        setRobots(robotsData);
        console.log('Datos de API cargados exitosamente');
      } else {
        console.log('Usando datos mock - respuesta de API inválida');
      }
    } catch (error) {
      console.error('Error al cargar los robots:', error);
      // Los datos mock ya están cargados, no mostrar alerta
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);

  const handleAddRobot = (robotData: RobotFormData) => {
    try {
      if (editingRobot) {
        // Editar robot existente
        const updatedRobot = mockDataService.updateRobot(editingRobot.id_robot, robotData);
        if (updatedRobot) {
          setAlert({
            open: true,
            message: 'Robot actualizado exitosamente',
            severity: 'success'
          });
        } else {
          throw new Error('No se pudo actualizar el robot');
        }
      } else {
        // Agregar nuevo robot
        const newRobot = mockDataService.addRobot({
          ...robotData,
          activo: true,
          ultima_actividad: new Date().toISOString(),
          ubicacion: 'Estación de Carga',
          modelo: 'Modelo Estándar'
        });
        
        console.log('Robot agregado:', newRobot);
        
        setAlert({
          open: true,
          message: 'Robot agregado exitosamente',
          severity: 'success'
        });
      }
      
      setOpenForm(false);
      setEditingRobot(null);
      fetchRobots();
    } catch (error) {
      console.error('Error al procesar el robot:', error);
      setAlert({
        open: true,
        message: editingRobot ? 'Error al actualizar el robot' : 'Error al agregar el robot',
        severity: 'error'
      });
    }
  };

  const handleEditRobot = (robot: Robot) => {
    setEditingRobot(robot);
    setOpenForm(true);
  };

  const handleDeleteRobot = (robotId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este robot?')) {
      try {
        const success = mockDataService.deleteRobot(robotId);
        if (success) {
          setAlert({
            open: true,
            message: 'Robot eliminado exitosamente',
            severity: 'success'
          });
          fetchRobots();
        } else {
          throw new Error('No se pudo eliminar el robot');
        }
      } catch (error) {
        console.error('Error al eliminar el robot:', error);
        setAlert({
          open: true,
          message: 'Error al eliminar el robot',
          severity: 'error'
        });
      }
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
        Robots
      </h1>
      
      <button 
        onClick={() => {
          setEditingRobot(null);
          setOpenForm(true);
        }}
        style={{
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        + Nuevo Robot
      </button>

      {robots.length === 0 ? (
        <p>No hay robots disponibles</p>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nombre</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Batería</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Última Actividad</th>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(robots) && robots.map((robot, index) => (
                <tr 
                  key={robot.id_robot}
                  style={{ 
                    borderBottom: index === robots.length - 1 ? 'none' : '1px solid #e5e7eb'
                  }}
                >
                  <td style={{ padding: '16px', color: '#374151' }}>{robot.id_robot}</td>
                  <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{robot.nombre}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: robot.estado === 'Disponible' ? '#dcfce7' : 
                                     robot.estado === 'En Mantenimiento' ? '#fef3c7' : '#dbeafe',
                      color: robot.estado === 'Disponible' ? '#166534' : 
                             robot.estado === 'En Mantenimiento' ? '#92400e' : '#1e40af'
                    }}>
                      {robot.estado}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#374151' }}>{robot.bateria}%</td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>
                    {new Date(robot.ultima_actividad).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditRobot(robot)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteRobot(robot.id_robot)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RobotForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingRobot(null);
        }}
        onSubmit={handleAddRobot}
        initialData={editingRobot ? {
          nombre: editingRobot.nombre,
          estado: editingRobot.estado,
          bateria: editingRobot.bateria
        } : undefined}
        isEditing={!!editingRobot}
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