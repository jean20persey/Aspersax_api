import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import mockDataService, { Jornada } from '../services/mockDataService';
import JornadaForm, { JornadaFormData } from '../components/JornadaForm';

const JornadasPage: React.FC = () => {
    const [jornadas, setJornadas] = useState<Jornada[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingJornada, setEditingJornada] = useState<Jornada | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning'
    });

    const fetchJornadas = () => {
        const jornadasData = mockDataService.getJornadas();
        setJornadas(jornadasData);
    };

    useEffect(() => {
        fetchJornadas();
    }, []);

    const handleAddJornada = (jornadaData: JornadaFormData) => {
        try {
            if (editingJornada) {
                // Editar jornada existente
                const updatedJornada = mockDataService.updateJornada(editingJornada.id_jornada, jornadaData);
                if (updatedJornada) {
                    setAlert({
                        open: true,
                        message: 'Jornada actualizada exitosamente',
                        severity: 'success'
                    });
                } else {
                    throw new Error('No se pudo actualizar la jornada');
                }
            } else {
                // Agregar nueva jornada
                const newJornada = mockDataService.addJornada(jornadaData);
                
                console.log('Jornada agregada:', newJornada);
                
                setAlert({
                    open: true,
                    message: 'Jornada agregada exitosamente',
                    severity: 'success'
                });
            }
            
            setOpenForm(false);
            setEditingJornada(null);
            fetchJornadas();
        } catch (error) {
            console.error('Error al procesar la jornada:', error);
            setAlert({
                open: true,
                message: editingJornada ? 'Error al actualizar la jornada' : 'Error al agregar la jornada',
                severity: 'error'
            });
        }
    };

    const handleEditJornada = (jornada: Jornada) => {
        setEditingJornada(jornada);
        setOpenForm(true);
    };

    const handleDeleteJornada = (jornadaId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta jornada?')) {
            try {
                const success = mockDataService.deleteJornada(jornadaId);
                if (success) {
                    setAlert({
                        open: true,
                        message: 'Jornada eliminada exitosamente',
                        severity: 'success'
                    });
                    fetchJornadas();
                } else {
                    throw new Error('No se pudo eliminar la jornada');
                }
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

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Completada':
                return '#22c55e';
            case 'En Progreso':
                return '#3b82f6';
            case 'Pausada':
                return '#f59e0b';
            case 'Cancelada':
                return '#ef4444';
            default:
                return '#6b7280';
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
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Robot</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Área Cubierta</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Malezas Detectadas</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Herbicida Usado</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Duración</th>
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
                                    <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{jornada.robot_nombre}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.area_cubierta} hectáreas</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.malezas_detectadas}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{jornada.herbicida_usado} L</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: `${getEstadoColor(jornada.estado)}20`,
                                            color: getEstadoColor(jornada.estado)
                                        }}>
                                            {jornada.estado}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#6b7280' }}>{jornada.duracion} min</td>
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
                    robot_id: editingJornada.robot_id,
                    robot_nombre: editingJornada.robot_nombre,
                    area_cubierta: editingJornada.area_cubierta,
                    malezas_detectadas: editingJornada.malezas_detectadas,
                    herbicida_usado: editingJornada.herbicida_usado,
                    duracion: editingJornada.duracion,
                    estado: editingJornada.estado
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