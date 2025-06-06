import React from 'react';
import { Typography, Box } from '@mui/material';

const ReportesPage: React.FC = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Reportes
            </Typography>
            <Typography variant="body1">
                Visualiza los reportes del sistema
            </Typography>
        </Box>
    );
};

export default ReportesPage; 