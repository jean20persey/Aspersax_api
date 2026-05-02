import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { jornadasService, robotsService, tanquesService, Jornada, Robot, Tanque } from '../services/api';
import JornadaForm, { JornadaFormData } from '../components/JornadaForm';

const JornadasPage: React.FC = () => {
    const [jornadas, setJornadas] = useState<Jornada[]>([]);
    const [robots, setRobots] = useState<Robot[]>([]);
    const [tanques, setTanques] = useState<Tanque[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingJornada, setEditingJornada] = useState<Jornada | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning'
    });

    const fetchJornadas = async () => {
        try {
            const response = await jornadasService.getAll();
            const data = response.data;
            if (Array.isArray(data)) {
                setJornadas(data);
            } else if (data && (data as any).results) {
                setJornadas((data as any).results);
            }
        } catch (error) {
            console.error('Error al cargar las jornadas:', error);
            setAlert({
                open: true,
                message: 'Error al cargar las jornadas del servidor',
                severity: 'error'
            });
        }
    };

    const fetchRelatedData = async () => {
        try {
            const [robotsRes, tanquesRes] = await Promise.all([
                robotsService.getAll(),
                tanquesService.getAll()
            ]);
            
            const robotsData = robotsRes.data;
            if (Array.isArray(robotsData)) setRobots(robotsData);
            else if (robotsData && (robotsData as any).results) setRobots((robotsData as any).results);

            const tanquesData = tanquesRes.data;
            if (Array.isArray(tanquesData)) setTanques(tanquesData);
            else if (tanquesData && (tanquesData as any).results) setTanques((tanquesData as any).results);
        } catch (error) {
            console.error('Error al cargar datos relacionados:', error);
        }
    };

    useEffect(() => {
        fetchJornadas();
        fetchRelatedData();
    }, []);

    // Helper para obtener el nombre del robot por su ID
    const getRobotNombre = (robotId: number) => {
        const robot = robots.find(r => r.id_robot === robotId);
        return robot ? robot.nombre : `Robot #${robotId}`;
    };

    // Helper para obtener el nombre del tanque por su ID
    const getTanqueNombre = (tanqueId: number) => {
        const tanque = tanques.find(t => t.id_tanque === tanqueId);
        return tanque ? tanque.nombre : `Tanque #${tanqueId}`;
    };

    const handleAddJornada = async (jornadaData: JornadaFormData) => {
        try {
            if (editingJornada) {
                await jornadasService.update(editingJornada.id_jornada, jornadaData);
                setAlert({
                    open: true,
                    message: 'Jornada actualizada exitosamente',
                    severity: 'success'
                });
            } else {
                await jornadasService.create(jornadaData);
                setAlert({
                    open: true,
                    message: 'Jornada agregada exitosamente',
                    severity: 'success'
                });
            }
            
            setOpenForm(false);
            setEditingJornada(null);
            fetchJornadas();
        } catch (error: any) {
            console.error('Error al procesar la jornada:', error);
            const errorMsg = error.response?.data 
                ? JSON.stringify(error.response.data) 
                : (editingJornada ? 'Error al actualizar la jornada' : 'Error al agregar la jornada');
            setAlert({
                open: true,
                message: errorMsg,
                severity: 'error'
            });
        }
    };

    const handleEditJornada = (jornada: Jornada) => {
        setEditingJornada(jornada);
        setOpenForm(true);
    };

    const handleDeleteJornada = async (jornadaId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta jornada?')) {
            try {
                await jornadasService.delete(jornadaId);
                setAlert({
                    open: true,
                    message: 'Jornada eliminada exitosamente',
                    severity: 'success'
                });
                fetchJornadas();
            } catch (error) {
                console.error('Error al eliminar la jornada:', error);
                setAlert({
                    open: true,
                    message: 'Error al eliminar la jornada',
                    severity: 'error'
                });
            }
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                Jornadas
            </h1>
            
            <button 
                onClick={() => {
                    setEditingJornada(null);
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
                + Nueva Jornada
            </button>

            {jornadas.length === 0 ? (
                <p>No hay jornadas disponibles</p>
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
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Fecha</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Hora Inicio</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Hora Fin</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Duración</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Área Tratada</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Robot</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tanque</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jornadas.map((jornada, index) => (
                                <tr 
                                    key={jornada.id_jornada}
                                    style={{ 
                                        borderBottom: index === jornadas.length - 1 ? 'none' : '1px solid #e5e7eb'
                                    }}
                                >
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.id_jornada}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.fecha}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.hora_inicio}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.hora_fin}</td>
                                    <td style={{ padding: '16px', color: '#6b7280' }}>{jornada.duracion}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.area_tratada} ha</td>
                                    <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{getRobotNombre(jornada.robot)}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{getTanqueNombre(jornada.tanque)}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEditJornada(jornada)}
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
                                                onClick={() => handleDeleteJornada(jornada.id_jornada)}
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

            <JornadaForm
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                    setEditingJornada(null);
                }}
                onSubmit={handleAddJornada}
                initialData={editingJornada ? {
                    fecha: editingJornada.fecha,
                    hora_inicio: editingJornada.hora_inicio,
                    hora_fin: editingJornada.hora_fin,
                    duracion: editingJornada.duracion,
                    area_tratada: editingJornada.area_tratada,
                    robot: editingJornada.robot,
                    tanque: editingJornada.tanque,
                } : undefined}
                isEditing={!!editingJornada}
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

export default JornadasPage;