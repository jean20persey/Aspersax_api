import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Card, 
    CardContent, 
    Button, 
    Divider,
    useTheme,
    Paper
} from '@mui/material';
import { 
    History as HistoryIcon, 
    Construction as ToolsIcon, 
    People as TeamIcon,
    Agriculture as AgriIcon,
    ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

const LandingPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const modules = [
        { title: "Fundamentos de Robótica", desc: "Arquitectura y propulsión autónoma.", price: "$480,000" },
        { title: "ML aplicado al Agro", desc: "Detección de maleza Romaza.", price: "$650,000" },
        { title: "Optimización Genética", desc: "Eficiencia de rutas y batería.", price: "$820,000" },
        { title: "Deep Learning Visión", desc: "IA en tiempo real para el campo.", price: "$980,000" },
        { title: "Gestión La Riverita", desc: "Control de jornadas y tanques.", price: "$1,300,000" },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                color: 'white',
                py: { xs: 8, md: 12 },
                textAlign: 'center'
            }}>
                <Container maxWidth="md">
                    <AgriIcon sx={{ fontSize: 60, mb: 2, color: 'secondary.main' }} />
                    <Typography variant="h2" gutterBottom fontWeight={800}>
                        PROYECTO ASPERSAX
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        Innovación Autónoma para una Agricultura Sostenible en Finca La Riverita.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="large" 
                        endIcon={<ArrowIcon />}
                        onClick={() => navigate('/login')}
                        sx={{ px: 4, py: 1.5, borderRadius: 4, fontWeight: 700 }}
                    >
                        Ingresar a la Plataforma
                    </Button>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 8 }}>
                {/* History Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography variant="h4" gutterBottom fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <HistoryIcon sx={{ mr: 2, color: 'primary.main' }} /> Nuestra Historia
                    </Typography>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
                        gap: 4 
                    }}>
                        {[
                            { year: 'Origen', text: 'El desafío de la maleza Romaza.' },
                            { year: 'Robótica', text: 'Desarrollo de chasis autónomos.' },
                            { year: 'IA', text: 'Modelos de visión en tiempo real.' },
                        ].map((item, i) => (
                            <Paper key={i} elevation={0} sx={{ p: 3, borderLeft: '4px solid', borderColor: 'primary.main', bgcolor: 'white' }}>
                                <Typography variant="subtitle2" color="primary" fontWeight={700}>{item.year}</Typography>
                                <Typography variant="body1">{item.text}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>

                {/* Modules Grid */}
                <Box sx={{ mb: 10 }}>
                    <Typography variant="h4" gutterBottom fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <ToolsIcon sx={{ mr: 2, color: 'primary.main' }} /> Capacitación y Servicios
                    </Typography>
                    <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
                        gap: 3 
                    }}>
                        {modules.map((mod, i) => (
                            <Card key={i} sx={{ height: '100%', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom fontWeight={700}>{mod.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{mod.desc}</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" color="primary" fontWeight={700}>{mod.price} COP</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>

                {/* Team Section */}
                <Box>
                    <Typography variant="h4" gutterBottom fontWeight={700} sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <TeamIcon sx={{ mr: 2, color: 'primary.main' }} /> Lead Developer
                    </Typography>
                    <Card sx={{ bgcolor: 'white', borderRadius: 4, p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5" fontWeight={700}>Experto Aspersax</Typography>
                                <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>Arquitecto de Sistemas de Precisión</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Líder técnico en Finca La Riverita. Especialista en integración de hardware robótico y modelos de IA para la agricultura sostenible.
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Container>

            {/* Global Chatbot */}
            <Chatbot />
        </Box>
    );
};

export default LandingPage;
