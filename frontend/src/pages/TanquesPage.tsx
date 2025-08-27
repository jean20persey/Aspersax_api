import React, { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import mockDataService, { Tanque } from '../services/mockDataService';
import TanqueForm, { TanqueFormData } from '../components/TanqueForm';

const TanquesPage: React.FC = () => {
    const [tanques, setTanques] = useState<Tanque[]>([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingTanque, setEditingTanque] = useState<Tanque | null>(null);
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning'
    });

    const fetchTanques = () => {
        const tanquesData = mockDataService.getTanques();
        setTanques(tanquesData);
    };

    useEffect(() => {
        fetchTanques();
    }, []);

    const handleAddTanque = (tanqueData: TanqueFormData) => {
        try {
            if (editingTanque) {
                // Editar tanque existente
                const updatedTanque = mockDataService.updateTanque(editingTanque.id_tanque, {
                    ...tanqueData,
                    activo: true
                });
                if (updatedTanque) {
                    setAlert({
                        open: true,
                        message: 'Tanque actualizado exitosamente',
                        severity: 'success'
                    });
                } else {
                    throw new Error('No se pudo actualizar el tanque');
                }
            } else {
                // Agregar nuevo tanque
                const newTanque = mockDataService.addTanque({
                    ...tanqueData,
                    activo: true
                });
                
                console.log('Tanque agregado:', newTanque);
                
                setAlert({
                    open: true,
                    message: 'Tanque agregado exitosamente',
                    severity: 'success'
                });
            }
            
            setOpenForm(false);
            setEditingTanque(null);
            fetchTanques();
        } catch (error) {
            console.error('Error al procesar el tanque:', error);
            setAlert({
                open: true,
                message: editingTanque ? 'Error al actualizar el tanque' : 'Error al agregar el tanque',
                severity: 'error'
            });
        }
    };

    const handleEditTanque = (tanque: Tanque) => {
        setEditingTanque(tanque);
        setOpenForm(true);
    };

    const handleDeleteTanque = (tanqueId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tanque?')) {
            try {
                const success = mockDataService.deleteTanque(tanqueId);
                if (success) {
                    setAlert({
                        open: true,
                        message: 'Tanque eliminado exitosamente',
                        severity: 'success'
                    });
                    fetchTanques();
                } else {
                    throw new Error('No se pudo eliminar el tanque');
                }
            } catch (error) {
                console.error('Error al eliminar el tanque:', error);
                setAlert({
                    open: true,
                    message: 'Error al eliminar el tanque',
                    severity: 'error'
                });
            }
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Lleno':
                return '#22c55e';
            case 'Medio':
                return '#f59e0b';
            case 'Bajo':
                return '#ef4444';
            case 'Vacío':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                Tanques
            </h1>
            
            <button 
                onClick={() => {
                    setEditingTanque(null);
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
                + Nuevo Tanque
            </button>

            {tanques.length === 0 ? (
                <p>No hay tanques disponibles</p>
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
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Capacidad</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nivel Actual</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Estado</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tipo Herbicida</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Última Recarga</th>
                                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', color: '#374151', fontWeight: '600' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tanques.map((tanque, index) => (
                                <tr 
                                    key={tanque.id_tanque}
                                    style={{ 
                                        borderBottom: index === tanques.length - 1 ? 'none' : '1px solid #e5e7eb'
                                    }}
                                >
                                    <td style={{ padding: '16px', color: '#374151' }}>{tanque.id_tanque}</td>
                                    <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{tanque.nombre}</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{tanque.capacidad}L</td>
                                    <td style={{ padding: '16px', color: '#374151' }}>
                                        {tanque.nivel_actual}L ({Math.round((tanque.nivel_actual / tanque.capacidad) * 100)}%)
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: `${getEstadoColor(tanque.estado)}20`,
                                            color: getEstadoColor(tanque.estado)
                                        }}>
                                            {tanque.estado}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#374151' }}>{tanque.tipo_herbicida}</td>
                                    <td style={{ padding: '16px', color: '#6b7280' }}>
                                        {new Date(tanque.ultima_recarga).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEditTanque(tanque)}
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
                                                onClick={() => handleDeleteTanque(tanque.id_tanque)}
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

            <TanqueForm
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                    setEditingTanque(null);
                }}
                onSubmit={handleAddTanque}
                initialData={editingTanque ? {
                    nombre: editingTanque.nombre,
                    capacidad: editingTanque.capacidad,
                    nivel_actual: editingTanque.nivel_actual,
                    tipo_herbicida: editingTanque.tipo_herbicida
                } : undefined}
                isEditing={!!editingTanque}
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

export default TanquesPage; 