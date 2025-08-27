import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import mockDataService, { Maleza } from '../services/mockDataService';
import MalezaForm, { MalezaFormData } from '../components/MalezaForm';

const MalezasPage: React.FC = () => {
    const [malezas, setMalezas] = useState<Maleza[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingMaleza, setEditingMaleza] = useState<Maleza | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning'
    });

    const fetchMalezas = () => {
        const malezasData = mockDataService.getMalezas();
        setMalezas(malezasData);
    };

    useEffect(() => {
        fetchMalezas();
    }, []);

    const handleAddMaleza = (malezaData: MalezaFormData) => {
        try {
            if (editingMaleza) {
                // Editar maleza existente
                const updatedMaleza = mockDataService.updateMaleza(editingMaleza.id_maleza, malezaData);
                if (updatedMaleza) {
                    setAlert({
                        open: true,
                        message: 'Maleza actualizada exitosamente',
                        severity: 'success'
                    });
                } else {
                    throw new Error('No se pudo actualizar la maleza');
                }
            } else {
                // Agregar nueva maleza
                const newMaleza = mockDataService.addMaleza(malezaData);
                
                console.log('Maleza agregada:', newMaleza);
                
                setAlert({
                    open: true,
                    message: 'Maleza agregada exitosamente',
                    severity: 'success'
                });
            }
            
            setOpenForm(false);
            setEditingMaleza(null);
            fetchMalezas();
        } catch (error) {
            console.error('Error al procesar la maleza:', error);
            setAlert({
                open: true,
                message: editingMaleza ? 'Error al actualizar la maleza' : 'Error al agregar la maleza',
                severity: 'error'
            });
        }
    };

    const handleEditMaleza = (maleza: Maleza) => {
        setEditingMaleza(maleza);
        setOpenForm(true);
    };

    const handleDeleteMaleza = (malezaId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta maleza?')) {
            try {
                const success = mockDataService.deleteMaleza(malezaId);
                if (success) {
                    setAlert({
                        open: true,
                        message: 'Maleza eliminada exitosamente',
                        severity: 'success'
                    });
                    fetchMalezas();
                } else {
                    throw new Error('No se pudo eliminar la maleza');
                }
            } catch (error) {
                console.error('Error al eliminar la maleza:', error);
                setAlert({
                    open: true,
                    message: 'Error al eliminar la maleza',
                    severity: 'error'
                });
            }
        }
    };

    const getNivelInfestacionColor = (nivel: string) => {
        switch (nivel) {
            case 'Alto':
                return '#ef4444';
            case 'Medio':
                return '#f59e0b';
            case 'Bajo':
                return '#22c55e';
            default:
                return '#6b7280';
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Eliminada':
                return '#22c55e';
            case 'Tratada':
                return '#3b82f6';
            case 'Detectada':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                Malezas
            </h1>
            
            <button 
                onClick={() => {
                    setEditingMaleza(null);
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
                + Nueva Maleza
            </button>

            {malezas.length === 0 ? (
                <p>No hay malezas registradas</p>
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
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tipo</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ubicación (X, Y)</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Fecha Detección</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Robot Detector</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Nivel Infestación</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {malezas.map((maleza, index) => (
                                <tr 
                                    key={maleza.id_maleza}
                                    style={{ 
                                        borderBottom: index === malezas.length - 1 ? 'none' : '1px solid #e5e7eb'
                                    }}
                                >
                                    <td style={{ padding: '16px', color: '#374151' }}>{maleza.id_maleza}</td>
                                    <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{maleza.tipo}</td>
                                    <td style={{ padding: '16px', color: '#6b7280' }}>({maleza.ubicacion_x}, {maleza.ubicacion_y})</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>
                                        {new Date(maleza.fecha_deteccion).toLocaleDateString('es-ES')}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: `${getEstadoColor(maleza.estado)}20`,
                                            color: getEstadoColor(maleza.estado)
                                        }}>
                                            {maleza.estado}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{maleza.robot_detector}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: `${getNivelInfestacionColor(maleza.nivel_infestacion)}20`,
                                            color: getNivelInfestacionColor(maleza.nivel_infestacion)
                                        }}>
                                            {maleza.nivel_infestacion}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEditMaleza(maleza)}
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
                                                onClick={() => handleDeleteMaleza(maleza.id_maleza)}
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

            <MalezaForm
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                    setEditingMaleza(null);
                }}
                onSubmit={handleAddMaleza}
                initialData={editingMaleza ? {
                    tipo: editingMaleza.tipo,
                    ubicacion_x: editingMaleza.ubicacion_x,
                    ubicacion_y: editingMaleza.ubicacion_y,
                    fecha_deteccion: editingMaleza.fecha_deteccion,
                    estado: editingMaleza.estado,
                    robot_detector: editingMaleza.robot_detector,
                    nivel_infestacion: editingMaleza.nivel_infestacion
                } : undefined}
                isEditing={!!editingMaleza}
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

export default MalezasPage; 