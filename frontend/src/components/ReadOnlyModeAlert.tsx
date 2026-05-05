import React from 'react';
import { Alert, AlertTitle, Box, Typography } from '@mui/material';
import { Visibility as ViewIcon, Info as InfoIcon } from '@mui/icons-material';
import { usePermissions } from '../hooks/usePermissions';

interface ReadOnlyModeAlertProps {
    featureName: string;
}

const ReadOnlyModeAlert: React.FC<ReadOnlyModeAlertProps> = ({ featureName }) => {
    const userRole = usePermissions();

    if (!userRole || userRole.isAdmin) {
        return null;
    }

    return (
        <Alert 
            severity="info" 
            icon={<ViewIcon />}
            sx={{ 
                mb: 3, 
                borderRadius: '12px',
                background: 'rgba(2, 136, 209, 0.05)',
                border: '1px solid rgba(2, 136, 209, 0.2)',
                '& .MuiAlert-icon': {
                    color: 'info.main'
                }
            }}
        >
            <AlertTitle sx={{ fontWeight: 700 }}>Modo Visualización</AlertTitle>
            <Box>
                <Typography variant="body2">
                    Actualmente tienes el rol de <strong>Visualizador</strong>. Puedes consultar la información de {featureName}, 
                    pero las acciones de creación, edición o eliminación están restringidas.
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mt: 1, color: 'text.secondary' }}>
                    <InfoIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Si necesitas permisos de administrador, solicítalos en tu perfil.
                </Typography>
            </Box>
        </Alert>
    );
};

export default ReadOnlyModeAlert;
