import React from 'react';
import { Typography, Box } from '@mui/material';

const MalezasPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Malezas
            </Typography>
            <Typography variant="body1">
                Administra el catálogo de malezas
            </Typography>
        </Box>
    );
};

export default MalezasPage; 