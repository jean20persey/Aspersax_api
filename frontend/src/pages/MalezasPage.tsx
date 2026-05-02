import React, { useState, useEffect } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { malezasService, Maleza } from '../services/api';
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

    const fetchMalezas = async () => {
        try {
            const response = await malezasService.getAll();
            const data = response.data;
            if (Array.isArray(data)) {
                setMalezas(data);
            } else if (data && (data as any).results) {
                setMalezas((data as any).results);
            }
        } catch (error) {
            console.error('Error al cargar las malezas:', error);
            setAlert({
                open: true,
                message: 'Error al cargar las malezas del servidor',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        fetchMalezas();
    }, []);

    const handleAddMaleza = async (malezaData: MalezaFormData) => {
        try {
            if (editingMaleza) {
                await malezasService.update(editingMaleza.id_maleza, malezaData);
                setAlert({
                    open: true,
                    message: 'Maleza actualizada exitosamente',
                    severity: 'success'
                });
            } else {
                await malezasService.create(malezaData);
                setAlert({
                    open: true,
                    message: 'Maleza agregada exitosamente',
                    severity: 'success'
                });
            }
            
            setOpenForm(false);
            setEditingMaleza(null);
            fetchMalezas();
        } catch (error: any) {
            console.error('Error al procesar la maleza:', error);
            const errorMsg = error.response?.data 
                ? JSON.stringify(error.response.data) 
                : (editingMaleza ? 'Error al actualizar la maleza' : 'Error al agregar la maleza');
            setAlert({
                open: true,
                message: errorMsg,
                severity: 'error'
            });
        }
    };

    const handleEditMaleza = (maleza: Maleza) => {
        setEditingMaleza(maleza);
        setOpenForm(true);
    };

    const handleDeleteMaleza = async (malezaId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta maleza?')) {
            try {
                await malezasService.delete(malezaId);
                setAlert({
                    open: true,
                    message: 'Maleza eliminada exitosamente',
                    severity: 'success'
                });
                fetchMalezas();
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

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'Hoja Ancha':
                return '#22c55e';
            case 'Hoja Angosta':
                return '#3b82f6';
            case 'Gramínea':
                return '#f59e0b';
            case 'Otra':
                return '#6b7280';
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
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nombre</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Nombre Científico</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tipo</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Temporada</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Resistencia Herbicida</th>
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
                                    <td style={{ padding: '16px', color: '#374151', fontWeight: '500' }}>{maleza.nombre}</td>
                                    <td style={{ padding: '16px', color: '#6b7280', fontStyle: 'italic' }}>
                                        {maleza.nombre_cientifico || '—'}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: `${getTipoColor(maleza.tipo)}20`,
                                            color: getTipoColor(maleza.tipo)
                                        }}>
                                            {maleza.tipo}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: '#374151' }}>
                                        {maleza.temporada || '—'}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: maleza.resistencia_herbicida ? '#ef444420' : '#22c55e20',
                                            color: maleza.resistencia_herbicida ? '#ef4444' : '#22c55e'
                                        }}>
                                            {maleza.resistencia_herbicida ? 'Sí' : 'No'}
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
                    nombre: editingMaleza.nombre,
                    nombre_cientifico: editingMaleza.nombre_cientifico || '',
                    tipo: editingMaleza.tipo,
                    descripcion: editingMaleza.descripcion || '',
                    temporada: editingMaleza.temporada || '',
                    resistencia_herbicida: editingMaleza.resistencia_herbicida,
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