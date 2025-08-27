import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    InputAdornment,
    Fade,
    Grow,
    useTheme,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    Email,
    Lock,
    Agriculture,
    VpnKey,
    ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const RecuperarPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const steps = ['Verificar Email', 'Código de Verificación', 'Nueva Contraseña'];

    const handleEnviarCodigo = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            // Simular envío de código por email
            await authService.enviarCodigoRecuperacion(email);
            setSuccess('Se ha enviado un código de verificación a tu correo electrónico');
            setActiveStep(1);
        } catch (err: any) {
            setError(err.detail || 'Error al enviar el código. Verifica que el email esté registrado.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificarCodigo = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await authService.verificarCodigoRecuperacion(email, codigo);
            setSuccess('Código verificado correctamente');
            setActiveStep(2);
        } catch (err: any) {
            setError(err.detail || 'Código incorrecto o expirado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCambiarPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (nuevaPassword !== confirmarPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (nuevaPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            await authService.cambiarPasswordConCodigo(email, codigo, nuevaPassword);
            setSuccess('Contraseña cambiada exitosamente. Serás redirigido al login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.detail || 'Error al cambiar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVolver = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
            setError('');
            setSuccess('');
        } else {
            navigate('/login');
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box component="form" onSubmit={handleEnviarCodigo} sx={{ width: '100%' }}>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                            Ingresa tu correo electrónico para recibir un código de verificación
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: 'action.active' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ 
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
                                boxShadow: '0 4px 16px rgba(69, 185, 57, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #1a9f0b 100%)',
                                    boxShadow: '0 6px 20px rgba(69, 185, 57, 0.4)',
                                    transform: 'translateY(-1px)'
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {isLoading ? 'Enviando código...' : 'Enviar Código'}
                        </Button>
                    </Box>
                );

            case 1:
                return (
                    <Box component="form" onSubmit={handleVerificarCodigo} sx={{ width: '100%' }}>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                            Ingresa el código de 6 dígitos que enviamos a tu correo
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            label="Código de Verificación"
                            name="codigo"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            autoFocus
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKey sx={{ color: 'action.active' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading || codigo.length !== 6}
                            sx={{ 
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
                                boxShadow: '0 4px 16px rgba(69, 185, 57, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #1a9f0b 100%)',
                                    boxShadow: '0 6px 20px rgba(69, 185, 57, 0.4)',
                                    transform: 'translateY(-1px)'
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {isLoading ? 'Verificando...' : 'Verificar Código'}
                        </Button>
                    </Box>
                );

            case 2:
                return (
                    <Box component="form" onSubmit={handleCambiarPassword} sx={{ width: '100%' }}>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                            Ingresa tu nueva contraseña
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <TextField
                                    required
                                    fullWidth
                                    label="Nueva Contraseña"
                                    name="nuevaPassword"
                                    type="password"
                                    value={nuevaPassword}
                                    onChange={(e) => setNuevaPassword(e.target.value)}
                                    autoFocus
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirmar Nueva Contraseña"
                                    name="confirmarPassword"
                                    type="password"
                                    value={confirmarPassword}
                                    onChange={(e) => setConfirmarPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ 
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
                                boxShadow: '0 4px 16px rgba(69, 185, 57, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #1a9f0b 100%)',
                                    boxShadow: '0 6px 20px rgba(69, 185, 57, 0.4)',
                                    transform: 'translateY(-1px)'
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                        </Button>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a9f0b 0%, #0f6b08 50%, #2e7d32 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                py: 4,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    opacity: 0.3
                }
            }}
        >
            <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 3, sm: 5 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Grow in timeout={1000}>
                            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, #45b939 0%, #2e7d32 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 32px rgba(69, 185, 57, 0.3)',
                                    mb: 2
                                }}>
                                    <Agriculture sx={{ color: 'white', fontSize: 40 }} />
                                </Box>
                                <Typography 
                                    component="h1" 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 800,
                                        background: 'linear-gradient(135deg, #1a9f0b 0%, #2e7d32 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        letterSpacing: '1px',
                                        fontFamily: '"Inter", sans-serif'
                                    }}
                                >
                                    RECUPERAR CONTRASEÑA
                                </Typography>
                            </Box>
                        </Grow>

                        <Box sx={{ width: '100%', mb: 4 }}>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {error && (
                            <Fade in={!!error}>
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        width: '100%', 
                                        mb: 3,
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': {
                                            fontSize: '1.2rem'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {success && (
                            <Fade in={!!success}>
                                <Alert 
                                    severity="success" 
                                    sx={{ 
                                        width: '100%', 
                                        mb: 3,
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': {
                                            fontSize: '1.2rem'
                                        }
                                    }}
                                >
                                    {success}
                                </Alert>
                            </Fade>
                        )}

                        {renderStepContent()}

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Button
                                onClick={handleVolver}
                                startIcon={<ArrowBack />}
                                sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: 'rgba(69, 185, 57, 0.04)',
                                    }
                                }}
                            >
                                {activeStep === 0 ? 'Volver al Login' : 'Volver'}
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default RecuperarPasswordPage;
