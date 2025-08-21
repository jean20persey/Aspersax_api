import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
    useTheme,
    Badge,
} from '@mui/material';
import {
    SmartToy,
    WaterDrop,
    Grass,
    Terrain,
    Refresh,
    CheckCircle,
    Warning,
    Error,
    Info,
    BatteryChargingFull,
    BatteryAlert,
    BatteryFull,
    Battery6Bar,
    Battery4Bar,
    Battery2Bar,
    Battery0Bar,
} from '@mui/icons-material';

interface RobotStatus {
    id: number;
    nombre: string;
    estado: string;
    bateria: number;
    ultima_actividad: string;
}

interface TankStatus {
    id_tanque: number;
    nombre: string;
    nivel_actual: number;
    capacidad: number;
    estado: string;
}

interface RealTimeStatusProps {
    robotStats: RobotStatus[];
    tankStats: TankStatus[];
}

const RealTimeStatus: React.FC<RealTimeStatusProps> = ({ robotStats, tankStats }) => {
    const theme = useTheme();
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const getBatteryIcon = (battery: number) => {
        if (battery >= 90) return <BatteryFull />;
        if (battery >= 70) return <Battery6Bar />;
        if (battery >= 50) return <Battery4Bar />;
        if (battery >= 30) return <Battery2Bar />;
        if (battery >= 10) return <Battery0Bar />;
        return <BatteryAlert />;
    };

    const getBatteryColor = (battery: number) => {
        if (battery >= 70) return theme.palette.success.main;
        if (battery >= 30) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    const getStatusColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'activo':
            case 'disponible':
            case 'lleno':
                return 'success';
            case 'en operación':
            case 'en operacion':
            case 'medio':
                return 'info';
            case 'en mantenimiento':
            case 'bajo':
                return 'warning';
            case 'inactivo':
            case 'vacío':
            case 'vacio':
            case 'fuera de servicio':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'activo':
            case 'disponible':
            case 'lleno':
                return <CheckCircle />;
            case 'en operación':
            case 'en operacion':
            case 'medio':
                return <Info />;
            case 'en mantenimiento':
            case 'bajo':
                return <Warning />;
            case 'inactivo':
            case 'vacío':
            case 'vacio':
            case 'fuera de servicio':
                return <Error />;
            default:
                return <Info />;
        }
    };

    const getTankLevelColor = (nivel: number, capacidad: number) => {
        const percentage = (nivel / capacidad) * 100;
        if (percentage >= 70) return theme.palette.success.main;
        if (percentage >= 30) return theme.palette.warning.main;
        return theme.palette.error.main;
    };

    const formatLastActivity = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
            
            if (diffInMinutes < 1) return 'Ahora mismo';
            if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
            if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
            return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
        } catch (error) {
            return 'Fecha desconocida';
        }
    };

    const handleRefresh = () => {
        setLastUpdate(new Date());
        // Aquí se podría agregar una función para recargar los datos
    };

    return (
        <Grid container spacing={3}>
            {/* Estado de Robots */}
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <SmartToy sx={{ color: theme.palette.primary.main, mr: 1 }} />
                                <Typography variant="h6">Estado de Robots</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Última actualización: {lastUpdate.toLocaleTimeString()}
                                </Typography>
                                <Tooltip title="Actualizar">
                                    <IconButton size="small" onClick={handleRefresh}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <List sx={{ p: 0 }}>
                            {robotStats.map((robot) => (
                                <ListItem key={robot.id} sx={{ px: 0, py: 1 }}>
                                    <ListItemAvatar>
                                        <Badge
                                            badgeContent={
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor: getBatteryColor(robot.bateria),
                                                    }}
                                                />
                                            }
                                        >
                                            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                                <SmartToy />
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={robot.nombre}
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Box sx={{ color: getBatteryColor(robot.bateria) }}>
                                                    {getBatteryIcon(robot.bateria)}
                                                </Box>
                                                <Typography variant="caption">
                                                    {robot.bateria}% • {formatLastActivity(robot.ultima_actividad)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <Chip
                                            icon={getStatusIcon(robot.estado)}
                                            label={robot.estado}
                                            color={getStatusColor(robot.estado) as any}
                                            size="small"
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Estado de Tanques */}
            <Grid item xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <WaterDrop sx={{ color: theme.palette.info.main, mr: 1 }} />
                            <Typography variant="h6">Estado de Tanques</Typography>
                        </Box>

                        <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {tankStats.map((tanque) => (
                                <ListItem key={tanque.id_tanque} sx={{ px: 0, py: 2, alignItems: 'flex-start', borderRadius: 2, boxShadow: 1, mb: 1, background: '#f7fafd' }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: theme.palette.info.main, width: 48, height: 48 }}>
                                            <WaterDrop fontSize="large" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{tanque.nombre}</Typography>
                                                <Chip
                                                    icon={<Info />}
                                                    label={tanque.estado && tanque.estado !== 'Desconocido' ? tanque.estado : 'Sin estado'}
                                                    color={tanque.estado && tanque.estado !== 'Desconocido' ? getStatusColor(tanque.estado) as any : 'default'}
                                                    size="small"
                                                    sx={{ fontWeight: 500, fontSize: 13, px: 1.5 }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {tanque.nivel_actual}L / {tanque.capacidad}L
                                                </Typography>
                                                <Box sx={{ width: 100, height: 6, backgroundColor: theme.palette.grey[200], borderRadius: 2, mt: 0.5 }}>
                                                    <Box sx={{ width: `${(tanque.nivel_actual / tanque.capacidad) * 100}%`, height: '100%', backgroundColor: theme.palette.success.main }} />
                                                </Box>
                                            </Box>
                                        }
                                    />
                                    <ListItemSecondaryAction sx={{ top: 24 }}>
                                        {/* El Chip de estado ahora está al frente del nombre, no aquí */}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Resumen de estado */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Resumen del Sistema
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="primary.main">
                                        {robotStats.filter(r => r.estado.toLowerCase() === 'activo').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Robots Activos
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="info.main">
                                        {tankStats.filter(t => t.estado.toLowerCase() === 'lleno').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tanques Llenos
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="warning.main">
                                        {robotStats.filter(r => r.bateria < 30).length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Baterías Bajas
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h4" color="error.main">
                                        {tankStats.filter(t => (t.nivel_actual / t.capacidad) < 0.3).length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tanques Críticos
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default RealTimeStatus;
