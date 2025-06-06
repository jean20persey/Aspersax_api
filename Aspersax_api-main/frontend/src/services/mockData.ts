import dayjs from 'dayjs';

// Generar datos de actividad para los últimos 7 días
const generateActivityData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day');
    data.push({
      fecha: date.format('YYYY-MM-DD'),
      robots: Math.floor(Math.random() * 5) + 1,
      malezas: Math.floor(Math.random() * 50) + 10,
      herbicida_usado: Math.floor(Math.random() * 100) + 20,
      area_cubierta: Math.floor(Math.random() * 1000) + 200,
    });
  }
  return data;
};

// Datos mock para las estadísticas del dashboard
export const mockStats = {
  total_robots: 5,
  robots_activos: 3,
  total_tanques: 5,
  tanques_en_uso: 2,
  total_malezas: 150,
  malezas_detectadas: 45,
  area_cubierta: 2500,
  herbicida_usado: 350
};

// Datos mock para la actividad
export const mockActivityData = generateActivityData();

// Datos mock para el estado de los robots
export const mockRobotStats = [
  { id: 1, nombre: "Robot 1", bateria: 85, estado: "activo" },
  { id: 2, nombre: "Robot 2", bateria: 45, estado: "inactivo" },
  { id: 3, nombre: "Robot 3", bateria: 92, estado: "activo" },
  { id: 4, nombre: "Robot 4", bateria: 15, estado: "cargando" },
  { id: 5, nombre: "Robot 5", bateria: 78, estado: "activo" }
];

// Datos mock para el estado de los tanques
export const mockTankStats = [
  { id: 1, nombre: "Tanque 1", nivel: 90, estado: "en_uso" },
  { id: 2, nombre: "Tanque 2", nivel: 30, estado: "disponible" },
  { id: 3, nombre: "Tanque 3", nivel: 85, estado: "en_uso" },
  { id: 4, nombre: "Tanque 4", nivel: 5, estado: "mantenimiento" },
  { id: 5, nombre: "Tanque 5", nivel: 60, estado: "disponible" }
];

// Datos mock para las malezas
export const mockWeedStats = {
  tipos_detectados: [
    { tipo: "Maleza A", cantidad: 25 },
    { tipo: "Maleza B", cantidad: 15 },
    { tipo: "Maleza C", cantidad: 30 },
    { tipo: "Maleza D", cantidad: 20 },
    { tipo: "Maleza E", cantidad: 10 }
  ],
  total_detectadas: 100,
  area_afectada: 1500
}; 