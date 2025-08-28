import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { AdminPanelSettings, Email, VerifiedUser } from '@mui/icons-material';
import { authService } from '../services/authService';

const SolicitarAdminPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const steps = ['Solicitar Permisos', 'Verificar Código', 'Confirmación'];

  const handleSolicitar = async () => {
    if (!motivo.trim()) {
      setError('Por favor, especifica el motivo de tu solicitud');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authService.solicitarPermisosAdmin(motivo);
      setMensaje(response.message);
      setActiveStep(1);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al enviar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async () => {
    if (!codigo.trim()) {
      setError('Por favor, ingresa el código de verificación');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authService.verificarCodigoAdmin(codigo);
      setMensaje(response.message);
      setActiveStep(2);
      
      // Recargar la página después de 3 segundos para reflejar los nuevos permisos
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al verificar código');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Solicitar Permisos de Administrador
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Para obtener permisos de administrador, debes enviar una solicitud que será 
              revisada. Se enviará un código de verificación al email de Aspersax.
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Motivo de la solicitud"
              placeholder="Explica por qué necesitas permisos de administrador..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              margin="normal"
              required
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleSolicitar}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Email />}
              sx={{ mt: 2 }}
            >
              {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Verificar Código de Administrador
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Se ha enviado un código de verificación al email de Aspersax. 
              Una vez que recibas el código, ingrésalo aquí para obtener permisos de administrador.
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              El código expira en 24 horas
            </Alert>
            
            <TextField
              fullWidth
              label="Código de verificación"
              placeholder="Ingresa el código de 8 caracteres"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              margin="normal"
              inputProps={{ maxLength: 8 }}
              required
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerificar}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
              sx={{ mt: 2 }}
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center">
            <AdminPanelSettings sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom color="success.main">
              ¡Permisos Otorgados!
            </Typography>
            <Typography variant="body1" paragraph>
              Ahora tienes permisos de administrador. La página se recargará automáticamente 
              para reflejar tus nuevos permisos.
            </Typography>
            <Alert severity="success">
              {mensaje}
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Solicitar Permisos de Administrador
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sistema de verificación por código de email
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {mensaje && activeStep < 2 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            ¿Cómo funciona?
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <ol>
              <li>Envías una solicitud con el motivo por el que necesitas permisos</li>
              <li>Se envía un código de verificación al email de Aspersax</li>
              <li>Una vez que recibas el código, lo ingresas para obtener permisos</li>
              <li>Los permisos se otorgan automáticamente tras la verificación</li>
            </ol>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SolicitarAdminPage;
