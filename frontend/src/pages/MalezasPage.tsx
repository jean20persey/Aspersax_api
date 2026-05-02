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
            console.error('Error al cargar los registros de Romaza:', error);
            setAlert({
                open: true,
                message: 'Error al cargar los registros del servidor',
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
                    message: '✅ Registro de Romaza actualizado exitosamente',
                    severity: 'success'
                });
            } else {
                await malezasService.create(malezaData);
                setAlert({
                    open: true,
                    message: '✅ Detección de Romaza registrada exitosamente',
                    severity: 'success'
                });
            }

            setOpenForm(false);
            setEditingMaleza(null);
            fetchMalezas();
        } catch (error: any) {
            console.error('Error al procesar el registro:', error);
            const errorMsg = error.response?.data
                ? JSON.stringify(error.response.data)
                : (editingMaleza ? 'Error al actualizar el registro' : 'Error al guardar el registro');
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
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro de Romaza?')) {
            try {
                await malezasService.delete(malezaId);
                setAlert({
                    open: true,
                    message: 'Registro eliminado exitosamente',
                    severity: 'success'
                });
                fetchMalezas();
            } catch (error) {
                console.error('Error al eliminar el registro:', error);
                setAlert({
                    open: true,
                    message: 'Error al eliminar el registro',
                    severity: 'error'
                });
            }
        }
    };

    const totalRomaza = malezas.reduce((acc, m) => acc + (m.cantidad_romaza || 0), 0);
    const conResistencia = malezas.filter(m => m.resistencia_herbicida).length;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

            {/* Encabezado del módulo */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
                    🌿 Detecciones de Romaza
                </h1>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                    Monitoreo de <em>Rumex crispus</em> en Finca La Riverita
                </p>
            </div>

            {/* Tarjetas de contexto y resumen */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    padding: '16px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '10px',
                    border: '1px solid #c8e6c9'
                }}>
                    <div style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        📍 Finca
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1b5e20', marginTop: '4px' }}>
                        La Riverita
                    </div>
                </div>

                <div style={{
                    padding: '16px',
                    backgroundColor: '#f3e5f5',
                    borderRadius: '10px',
                    border: '1px solid #e1bee7'
                }}>
                    <div style={{ fontSize: '12px', color: '#7b1fa2', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        🌱 Maleza Objetivo
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4a148c', marginTop: '4px' }}>
                        Romaza <span style={{ fontSize: '11px', fontStyle: 'italic', fontWeight: 'normal' }}>(Rumex crispus)</span>
                    </div>
                </div>

                <div style={{
                    padding: '16px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '10px',
                    border: '1px solid #bbdefb'
                }}>
                    <div style={{ fontSize: '12px', color: '#1565c0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        🔢 Total Plantas Detectadas
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0d47a1', marginTop: '4px' }}>
                        {totalRomaza.toLocaleString()}
                    </div>
                </div>

                <div style={{
                    padding: '16px',
                    backgroundColor: conResistencia > 0 ? '#fff3e0' : '#e8f5e9',
                    borderRadius: '10px',
                    border: `1px solid ${conResistencia > 0 ? '#ffe0b2' : '#c8e6c9'}`
                }}>
                    <div style={{ fontSize: '12px', color: conResistencia > 0 ? '#e65100' : '#388e3c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        ⚠️ Áreas con Resistencia
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: conResistencia > 0 ? '#bf360c' : '#1b5e20', marginTop: '4px' }}>
                        {conResistencia}
                    </div>
                </div>
            </div>

            {/* Botón de nueva detección */}
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
                + Registrar Nueva Detección de Romaza
            </button>

            {/* Tabla de registros */}
            {malezas.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    color: '#6b7280'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
                    <p style={{ fontSize: '16px', margin: 0 }}>No hay registros de Romaza en Finca La Riverita</p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', margin: '8px 0 0' }}>
                        Haz clic en "Registrar Nueva Detección" para comenzar el monitoreo.
                    </p>
                </div>
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                    overflow: 'hidden'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>#</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>📍 Finca</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>🗺️ Área / Lote</th>
                                <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>🌱 Plantas Romaza</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>📅 Temporada</th>
                                <th style={{ padding: '14px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>⚠️ Resistencia</th>
                                <th style={{ padding: '14px 16px', textAlign: 'right', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {malezas.map((maleza, index) => (
                                <tr
                                    key={maleza.id_maleza}
                                    style={{ borderTop: '1px solid #f1f5f9' }}
                                >
                                    <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px' }}>{index + 1}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            backgroundColor: '#e8f5e9',
                                            color: '#2e7d32'
                                        }}>
                                            {maleza.finca || 'Finca La Riverita'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontWeight: '600', color: '#1f2937' }}>{maleza.nombre}</div>
                                        <div style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>
                                            {maleza.nombre_cientifico || 'Rumex crispus'}
                                        </div>
                                        {maleza.descripcion && (
                                            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                                {maleza.descripcion}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            backgroundColor: '#1a9f0b20',
                                            color: '#1a9f0b',
                                            border: '1px solid #1a9f0b40'
                                        }}>
                                            {maleza.cantidad_romaza.toLocaleString()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#374151', fontSize: '13px' }}>
                                        {maleza.temporada || '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: maleza.resistencia_herbicida ? '#ef444420' : '#22c55e20',
                                            color: maleza.resistencia_herbicida ? '#ef4444' : '#22c55e'
                                        }}>
                                            {maleza.resistencia_herbicida ? '⚠️ Resistente' : '✅ Normal'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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

                    {/* Pie de tabla con resumen */}
                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #f1f5f9',
                        backgroundColor: '#f8fafc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: '#6b7280'
                    }}>
                        <span>{malezas.length} área(s) con detección de Romaza en Finca La Riverita</span>
                        <span>Total: <strong style={{ color: '#1a9f0b' }}>{totalRomaza.toLocaleString()} plantas</strong></span>
                    </div>
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
                    nombre_cientifico: editingMaleza.nombre_cientifico || 'Rumex crispus',
                    cantidad_romaza: editingMaleza.cantidad_romaza,
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