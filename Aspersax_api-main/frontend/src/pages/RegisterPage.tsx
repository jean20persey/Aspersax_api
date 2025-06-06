import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        telefono: '',
        direccion: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err: any) {
            if (err.response?.data) {
                const errorMessages = Object.entries(err.response.data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' ');
                setError(errorMessages);
            } else {
                setError('Error al registrar usuario');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img src="/assets/favicon.svg" alt="Logo" style={{ width: 40, height: 40 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            Registro ASPERSAX
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Nombre"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Apellido"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Usuario"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Teléfono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Dirección"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    name="password2"
                                    type="password"
                                    value={formData.password2}
                                    onChange={handleChange}
                                />
                            </Box>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Registrarse
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" style={{ color: 'primary.main' }}>
                                    Inicia sesión
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterPage; 