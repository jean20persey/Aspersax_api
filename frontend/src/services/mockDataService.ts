// Servicio centralizado de datos mock para mantener consistencia entre todas las secciones

export interface Robot {
  id_robot: number;
  nombre: string;
  estado: 'Disponible' | 'En Mantenimiento' | 'En Operación' | 'Inactivo' | 'Mantenimiento' | 'Fuera de Servicio';
  bateria: number;
  ultima_actividad: string;
  activo: boolean;
  ubicacion?: string;
  modelo?: string;
}

export interface Tanque {
  id_tanque: number;
  nombre: string;
  capacidad: number;
  capacidad_total: number;
  nivel_actual: number;
  estado: 'Lleno' | 'Medio' | 'Bajo' | 'Vacío';
  tipo_herbicida: string;
  ultima_recarga: string;
  activo: boolean;
}

export interface Jornada {
  id_jornada: number;
  fecha: string;
  robot_id: number;
  robot_nombre: string;
  area_cubierta: number;
  malezas_detectadas: number;
  herbicida_usado: number;
  duracion: number;
  estado: 'Completada' | 'En Progreso' | 'Pausada' | 'Cancelada' | 'Programada';
}

export interface Maleza {
  id_maleza: number;
  tipo: string;
  ubicacion_x: number;
  ubicacion_y: number;
  fecha_deteccion: string;
  estado: 'Detectada' | 'Tratada' | 'Eliminada' | 'En Tratamiento';
  robot_detector: string;
  nivel_infestacion: 'Bajo' | 'Medio' | 'Alto';
}

export interface DashboardStats {
  total_robots: number;
  robots_activos: number;
  total_tanques: number;
  tanques_en_uso: number;
  total_malezas: number;
  malezas_detectadas: number;
  area_cubierta: number;
  herbicida_usado: number;
}

export interface ActivityData {
  fecha: string;
  robots: number;
  malezas: number;
}

class MockDataService {
  private readonly STORAGE_KEYS = {
    robots: 'aspersax_robots',
    tanques: 'aspersax_tanques',
    jornadas: 'aspersax_jornadas',
    malezas: 'aspersax_malezas'
  };

  // Métodos de persistencia
  private loadFromStorage<T>(key: keyof typeof this.STORAGE_KEYS): T[] | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS[key]);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return null;
    }
  }

  private saveToStorage<T>(key: keyof typeof this.STORAGE_KEYS, data: T[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS[key], JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  private robots: Robot[] = this.loadFromStorage('robots') || [
    {
      id_robot: 1,
      nombre: 'Robot-001',
      estado: 'En Operación',
      bateria: 85,
      ultima_actividad: '2024-01-15T10:30:00Z',
      activo: true,
      ubicacion: 'Sector A',
      modelo: 'AgriBot Pro'
    },
    {
      id_robot: 2,
      nombre: 'WeedHunter Pro Max',
      estado: 'Disponible',
      bateria: 92,
      ultima_actividad: '2025-08-27T11:30:00',
      activo: true,
      ubicacion: 'Estación de Carga Principal',
      modelo: 'WHP-3000'
    },
    {
      id_robot: 3,
      nombre: 'SprayMaster Elite',
      estado: 'En Mantenimiento',
      bateria: 23,
      ultima_actividad: '2025-08-26T16:20:00',
      activo: true,
      ubicacion: 'Taller de Mantenimiento',
      modelo: 'SME-2023'
    },
    {
      id_robot: 4,
      nombre: 'CropGuardian V2',
      estado: 'En Operación',
      bateria: 78,
      ultima_actividad: '2025-08-27T14:15:00',
      activo: true,
      ubicacion: 'Campo Sur - Lote 22B',
      modelo: 'CGV2-2024'
    },
    {
      id_robot: 5,
      nombre: 'AgriBot Precision',
      estado: 'Disponible',
      bateria: 95,
      ultima_actividad: '2025-08-27T09:45:00',
      activo: true,
      ubicacion: 'Base Operativa Este',
      modelo: 'ABP-2024'
    },
    {
      id_robot: 6,
      nombre: 'FieldScanner Alpha',
      estado: 'En Operación',
      bateria: 65,
      ultima_actividad: '2025-08-27T14:00:00',
      activo: true,
      ubicacion: 'Campo Oeste - Lote 8C',
      modelo: 'FSA-2023'
    },
    {
      id_robot: 7,
      nombre: 'HerbicideBot Pro',
      estado: 'En Mantenimiento',
      bateria: 41,
      ultima_actividad: '2025-08-26T14:30:00',
      activo: false,
      ubicacion: 'Taller de Reparaciones',
      modelo: 'HBP-2022'
    },
    {
      id_robot: 8,
      nombre: 'SmartSprayer X3',
      estado: 'Disponible',
      bateria: 88,
      ultima_actividad: '2025-08-27T12:00:00',
      activo: true,
      ubicacion: 'Almacén Central',
      modelo: 'SSX3-2024'
    },
    {
      id_robot: 9,
      nombre: 'Aspersax01',
      estado: 'En Mantenimiento',
      bateria: 50,
      ultima_actividad: '2025-08-28T12:03:42',
      activo: true,
      ubicacion: 'Taller de Mantenimiento',
      modelo: 'ASX-2024'
    },
    {
      id_robot: 10,
      nombre: 'Robot Test',
      estado: 'Fuera de Servicio',
      bateria: 0,
      ultima_actividad: '2025-08-28T12:07:07',
      activo: false,
      ubicacion: 'Almacén',
      modelo: 'RT-2024'
    }
  ];

  private tanques: Tanque[] = this.loadFromStorage('tanques') || [
    {
      id_tanque: 1,
      nombre: 'Tanque Principal Norte',
      capacidad: 2500,
      capacidad_total: 2500,
      nivel_actual: 1875,
      estado: 'Lleno',
      tipo_herbicida: 'Glifosato 48% SL',
      ultima_recarga: '2025-08-27T06:30:00',
      activo: true
    },
    {
      id_tanque: 2,
      nombre: 'Tanque Selectivo Sur',
      capacidad: 1800,
      capacidad_total: 1800,
      nivel_actual: 720,
      estado: 'Medio',
      tipo_herbicida: '2,4-D Amina 72%',
      ultima_recarga: '2025-08-26T14:15:00',
      activo: true
    },
    {
      id_tanque: 3,
      nombre: 'Tanque Preemergente Este',
      capacidad: 1200,
      capacidad_total: 1200,
      nivel_actual: 240,
      estado: 'Bajo',
      tipo_herbicida: 'Atrazina 50% SC',
      ultima_recarga: '2025-08-25T09:45:00',
      activo: true
    },
    {
      id_tanque: 4,
      nombre: 'Tanque Residual Oeste',
      capacidad: 800,
      capacidad_total: 800,
      nivel_actual: 560,
      estado: 'Medio',
      tipo_herbicida: 'Pendimetalina 33% EC',
      ultima_recarga: '2025-08-26T11:20:00',
      activo: true
    },
    {
      id_tanque: 5,
      nombre: 'Tanque Emergencia Central',
      capacidad: 1500,
      capacidad_total: 1500,
      nivel_actual: 0,
      estado: 'Vacío',
      tipo_herbicida: 'Dicamba 48% SL',
      ultima_recarga: '2025-08-22T16:00:00',
      activo: false
    },
    {
      id_tanque: 6,
      nombre: 'Tanque Sistémico A',
      capacidad: 2000,
      capacidad_total: 2000,
      nivel_actual: 1600,
      estado: 'Lleno',
      tipo_herbicida: 'Glufosinato 20% SL',
      ultima_recarga: '2025-08-27T07:45:00',
      activo: true
    }
  ];

  private jornadas: Jornada[] = this.loadFromStorage('jornadas') || [
    {
      id_jornada: 1,
      fecha: '2025-08-27',
      robot_id: 1,
      robot_nombre: 'AgroBot Sentinel X1',
      area_cubierta: 15.7,
      malezas_detectadas: 342,
      herbicida_usado: 47.3,
      duracion: 285,
      estado: 'Completada'
    },
    {
      id_jornada: 2,
      fecha: '2025-08-27',
      robot_id: 4,
      robot_nombre: 'CropGuardian V2',
      area_cubierta: 12.4,
      malezas_detectadas: 198,
      herbicida_usado: 35.8,
      duracion: 220,
      estado: 'En Progreso'
    },
    {
      id_jornada: 3,
      fecha: '2025-08-26',
      robot_id: 6,
      robot_nombre: 'FieldScanner Alpha',
      area_cubierta: 18.9,
      malezas_detectadas: 456,
      herbicida_usado: 62.1,
      duracion: 315,
      estado: 'Completada'
    },
    {
      id_jornada: 4,
      fecha: '2025-08-26',
      robot_id: 2,
      robot_nombre: 'WeedHunter Pro Max',
      area_cubierta: 9.8,
      malezas_detectadas: 127,
      herbicida_usado: 28.4,
      duracion: 195,
      estado: 'Completada'
    },
    {
      id_jornada: 5,
      fecha: '2025-08-25',
      robot_id: 8,
      robot_nombre: 'SmartSprayer X3',
      area_cubierta: 21.3,
      malezas_detectadas: 589,
      herbicida_usado: 78.9,
      duracion: 380,
      estado: 'Completada'
    },
    {
      id_jornada: 6,
      fecha: '2025-08-25',
      robot_id: 5,
      robot_nombre: 'AgriBot Precision',
      area_cubierta: 14.2,
      malezas_detectadas: 234,
      herbicida_usado: 41.7,
      duracion: 265,
      estado: 'Completada'
    },
    {
      id_jornada: 7,
      fecha: '2025-08-24',
      robot_id: 1,
      robot_nombre: 'AgroBot Sentinel X1',
      area_cubierta: 16.5,
      malezas_detectadas: 298,
      herbicida_usado: 52.3,
      duracion: 295,
      estado: 'Completada'
    },
    {
      id_jornada: 8,
      fecha: '2025-08-24',
      robot_id: 4,
      robot_nombre: 'CropGuardian V2',
      area_cubierta: 11.7,
      malezas_detectadas: 176,
      herbicida_usado: 33.2,
      duracion: 210,
      estado: 'Pausada'
    },
    {
      id_jornada: 9,
      fecha: '2025-08-23',
      robot_id: 6,
      robot_nombre: 'FieldScanner Alpha',
      area_cubierta: 19.8,
      malezas_detectadas: 412,
      herbicida_usado: 67.4,
      duracion: 340,
      estado: 'Completada'
    },
    {
      id_jornada: 10,
      fecha: '2025-08-23',
      robot_id: 2,
      robot_nombre: 'WeedHunter Pro Max',
      area_cubierta: 13.6,
      malezas_detectadas: 203,
      herbicida_usado: 38.9,
      duracion: 245,
      estado: 'Completada'
    }
  ];

  private malezas: Maleza[] = this.loadFromStorage('malezas') || [
    {
      id_maleza: 1,
      tipo: 'Amaranthus retroflexus (Yuyo Colorado)',
      ubicacion_x: 234.7,
      ubicacion_y: 156.2,
      fecha_deteccion: '2025-08-27T09:15:00',
      estado: 'Detectada',
      robot_detector: 'AgroBot Sentinel X1',
      nivel_infestacion: 'Alto'
    },
    {
      id_maleza: 2,
      tipo: 'Sorghum halepense (Sorgo de Alepo)',
      ubicacion_x: 187.3,
      ubicacion_y: 298.4,
      fecha_deteccion: '2025-08-27T10:30:00',
      estado: 'Tratada',
      robot_detector: 'CropGuardian V2',
      nivel_infestacion: 'Alto'
    },
    {
      id_maleza: 3,
      tipo: 'Digitaria sanguinalis (Pata de Gallina)',
      ubicacion_x: 345.8,
      ubicacion_y: 89.7,
      fecha_deteccion: '2025-08-26T14:45:00',
      estado: 'Eliminada',
      robot_detector: 'FieldScanner Alpha',
      nivel_infestacion: 'Medio'
    },
    {
      id_maleza: 4,
      tipo: 'Portulaca oleracea (Verdolaga)',
      ubicacion_x: 412.1,
      ubicacion_y: 203.6,
      fecha_deteccion: '2025-08-26T11:20:00',
      estado: 'Tratada',
      robot_detector: 'WeedHunter Pro Max',
      nivel_infestacion: 'Medio'
    },
    {
      id_maleza: 5,
      tipo: 'Chenopodium album (Quinoa Silvestre)',
      ubicacion_x: 156.9,
      ubicacion_y: 367.2,
      fecha_deteccion: '2025-08-25T16:10:00',
      estado: 'Eliminada',
      robot_detector: 'SmartSprayer X3',
      nivel_infestacion: 'Bajo'
    },
    {
      id_maleza: 6,
      tipo: 'Cynodon dactylon (Gramilla)',
      ubicacion_x: 289.4,
      ubicacion_y: 134.8,
      fecha_deteccion: '2025-08-25T13:25:00',
      estado: 'Detectada',
      robot_detector: 'AgriBot Precision',
      nivel_infestacion: 'Alto'
    },
    {
      id_maleza: 7,
      tipo: 'Taraxacum officinale (Diente de León)',
      ubicacion_x: 98.7,
      ubicacion_y: 245.3,
      fecha_deteccion: '2025-08-24T15:40:00',
      estado: 'Eliminada',
      robot_detector: 'AgroBot Sentinel X1',
      nivel_infestacion: 'Bajo'
    },
    {
      id_maleza: 8,
      tipo: 'Echinochloa crus-galli (Capín)',
      ubicacion_x: 367.2,
      ubicacion_y: 178.9,
      fecha_deteccion: '2025-08-24T12:15:00',
      estado: 'Tratada',
      robot_detector: 'CropGuardian V2',
      nivel_infestacion: 'Alto'
    },
    {
      id_maleza: 9,
      tipo: 'Setaria viridis (Cola de Zorro Verde)',
      ubicacion_x: 203.5,
      ubicacion_y: 312.7,
      fecha_deteccion: '2025-08-23T17:30:00',
      estado: 'Eliminada',
      robot_detector: 'FieldScanner Alpha',
      nivel_infestacion: 'Medio'
    },
    {
      id_maleza: 10,
      tipo: 'Convolvulus arvensis (Correhuela)',
      ubicacion_x: 445.1,
      ubicacion_y: 267.4,
      fecha_deteccion: '2025-08-23T14:50:00',
      estado: 'Detectada',
      robot_detector: 'WeedHunter Pro Max',
      nivel_infestacion: 'Medio'
    },
    {
      id_maleza: 11,
      tipo: 'Rumex crispus (Lengua de Vaca)',
      ubicacion_x: 134.6,
      ubicacion_y: 398.2,
      fecha_deteccion: '2025-08-22T10:25:00',
      estado: 'Eliminada',
      robot_detector: 'SmartSprayer X3',
      nivel_infestacion: 'Bajo'
    },
    {
      id_maleza: 12,
      tipo: 'Polygonum aviculare (Sanguinaria)',
      ubicacion_x: 321.8,
      ubicacion_y: 87.6,
      fecha_deteccion: '2025-08-22T08:40:00',
      estado: 'Tratada',
      robot_detector: 'AgriBot Precision',
      nivel_infestacion: 'Alto'
    }
  ];

  // Métodos para robots
  getRobots(): Robot[] {
    return [...this.robots];
  }

getRobotById(id: number): Robot | undefined {
return this.robots.find(robot => robot.id_robot === id);
}

addRobot(robot: Omit<Robot, 'id_robot'>): Robot {
const newRobot = {
...robot,
id_robot: Math.max(...this.robots.map(r => r.id_robot)) + 1
};
this.robots.push(newRobot);
this.saveToStorage('robots', this.robots);
return newRobot;
}

updateRobot(id: number, updates: Partial<Robot>): Robot | null {
const index = this.robots.findIndex(robot => robot.id_robot === id);
if (index !== -1) {
this.robots[index] = { ...this.robots[index], ...updates };
this.saveToStorage('robots', this.robots);
return this.robots[index];
}
return null;
}

deleteRobot(id: number): boolean {
const index = this.robots.findIndex(robot => robot.id_robot === id);
if (index !== -1) {
this.robots.splice(index, 1);
this.saveToStorage('robots', this.robots);
return true;
}
return false;
}

// Métodos para tanques
getTanques(): Tanque[] {
return [...this.tanques];
}

getTanqueById(id: number): Tanque | undefined {
return this.tanques.find(tanque => tanque.id_tanque === id);
}

addTanque(tanque: Omit<Tanque, 'id_tanque' | 'estado' | 'ultima_recarga'>): Tanque {
const newTanque = {
...tanque,
id_tanque: Math.max(...this.tanques.map(t => t.id_tanque)) + 1,
estado: this.calculateTanqueEstado(tanque.nivel_actual, tanque.capacidad),
ultima_recarga: new Date().toISOString()
};
this.tanques.push(newTanque);
this.saveToStorage('tanques', this.tanques);
return newTanque;
}

updateTanque(id: number, updates: Partial<Omit<Tanque, 'id_tanque' | 'estado' | 'ultima_recarga'>>): Tanque | null {
const index = this.tanques.findIndex(tanque => tanque.id_tanque === id);
if (index !== -1) {
const updatedTanque = { ...this.tanques[index], ...updates };
if (updates.nivel_actual !== undefined || updates.capacidad !== undefined) {
updatedTanque.estado = this.calculateTanqueEstado(
updates.nivel_actual ?? updatedTanque.nivel_actual,
updates.capacidad ?? updatedTanque.capacidad
);
}
this.tanques[index] = updatedTanque;
this.saveToStorage('tanques', this.tanques);
return this.tanques[index];
}
return null;
}

deleteTanque(id: number): boolean {
const index = this.tanques.findIndex(tanque => tanque.id_tanque === id);
if (index !== -1) {
this.tanques.splice(index, 1);
this.saveToStorage('tanques', this.tanques);
return true;
}
return false;
}

private calculateTanqueEstado(nivel: number, capacidad: number): 'Lleno' | 'Medio' | 'Bajo' | 'Vacío' {
const porcentaje = (nivel / capacidad) * 100;
if (porcentaje === 0) return 'Vacío';
if (porcentaje <= 25) return 'Bajo';
if (porcentaje <= 75) return 'Medio';
return 'Lleno';
}

// Métodos para jornadas
getJornadas(): Jornada[] {
return [...this.jornadas];
}

getJornadaById(id: number): Jornada | undefined {
return this.jornadas.find(jornada => jornada.id_jornada === id);
}

addJornada(jornada: Omit<Jornada, 'id_jornada'>): Jornada {
const newJornada = {
...jornada,
id_jornada: Math.max(...this.jornadas.map(j => j.id_jornada)) + 1
};
this.jornadas.push(newJornada);
this.saveToStorage('jornadas', this.jornadas);
return newJornada;
}

updateJornada(id: number, updates: Partial<Omit<Jornada, 'id_jornada'>>): Jornada | null {
const index = this.jornadas.findIndex(jornada => jornada.id_jornada === id);
if (index !== -1) {
this.jornadas[index] = { ...this.jornadas[index], ...updates };
this.saveToStorage('jornadas', this.jornadas);
return this.jornadas[index];
}
return null;
}

deleteJornada(id: number): boolean {
const index = this.jornadas.findIndex(jornada => jornada.id_jornada === id);
if (index !== -1) {
this.jornadas.splice(index, 1);
this.saveToStorage('jornadas', this.jornadas);
return true;
}
return false;
}

// Métodos para malezas
getMalezas(): Maleza[] {
return [...this.malezas];
}

getMalezaById(id: number): Maleza | undefined {
return this.malezas.find(maleza => maleza.id_maleza === id);
}

addMaleza(maleza: Omit<Maleza, 'id_maleza'>): Maleza {
const newMaleza = {
...maleza,
id_maleza: Math.max(...this.malezas.map(m => m.id_maleza)) + 1
};
this.malezas.push(newMaleza);
this.saveToStorage('malezas', this.malezas);
return newMaleza;
}

updateMaleza(id: number, updates: Partial<Omit<Maleza, 'id_maleza'>>): Maleza | null {
const index = this.malezas.findIndex(maleza => maleza.id_maleza === id);
if (index !== -1) {
this.malezas[index] = { ...this.malezas[index], ...updates };
this.saveToStorage('malezas', this.malezas);
return this.malezas[index];
}
return null;
}

deleteMaleza(id: number): boolean {
const index = this.malezas.findIndex(maleza => maleza.id_maleza === id);
if (index !== -1) {
this.malezas.splice(index, 1);
this.saveToStorage('malezas', this.malezas);
return true;
}
return false;
}

// Métodos para dashboard
  getDashboardStats(): DashboardStats {
    const robotsActivos = this.robots.filter(r => r.estado === 'En Operación').length;
    const tanquesEnUso = this.tanques.filter(t => t.activo && t.estado !== 'Vacío').length;
    const malezasDetectadas = this.malezas.filter(m => m.estado === 'Detectada').length;
    const areaCubierta = this.jornadas.reduce((total, j) => total + j.area_cubierta, 0);
    const herbicidaUsado = this.jornadas.reduce((total, j) => total + j.herbicida_usado, 0);

    console.log('Dashboard Stats Calculation:', {
      total_robots: this.robots.length,
      robots_activos: robotsActivos,
      total_tanques: this.tanques.length,
      tanques_en_uso: tanquesEnUso,
      total_malezas: this.malezas.length,
      malezas_detectadas: malezasDetectadas,
      area_cubierta: areaCubierta,
      herbicida_usado: herbicidaUsado
    });

    return {
      total_robots: this.robots.length,
      robots_activos: robotsActivos,
      total_tanques: this.tanques.length,
      tanques_en_uso: tanquesEnUso,
      total_malezas: this.malezas.length,
      malezas_detectadas: malezasDetectadas,
      area_cubierta: areaCubierta,
      herbicida_usado: herbicidaUsado
    };
  }

  getActivityData(startDate: string, endDate: string): ActivityData[] {
    // Generar datos de actividad para el rango de fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data: ActivityData[] = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const jornadasDelDia = this.jornadas.filter(j => j.fecha === dateStr);
      
      data.push({
        fecha: dateStr,
        robots: jornadasDelDia.length,
        malezas: jornadasDelDia.reduce((total, j) => total + j.malezas_detectadas, 0)
      });
    }

    return data;
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;
