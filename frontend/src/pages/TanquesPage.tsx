import React from 'react';
import { Typography, Box } from '@mui/material';

const TanquesPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Gestión de Tanques
            </Typography>
            <Typography variant="body1">
                Administra los tanques del sistema
            </Typography>
        </Box>
    );
};

export default TanquesPage; 