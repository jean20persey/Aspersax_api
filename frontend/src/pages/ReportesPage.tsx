import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Button,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Email as EmailIcon,
    FilterList as FilterIcon,
    SmartToy as SmartToyIcon,
    WaterDrop as WaterDropIcon,
    Grass as GrassIcon,
    Terrain as TerrainIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import mockDataService from '../services/mockDataService';
import EmailDialog from '../components/EmailDialog';
import emailService from '../services/emailService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
        lastAutoTable: { finalY: number };
    }
}

interface ReportData {
    productividad: any[];
    estadoSistema: any;
    tendencias: any[];
    costos: any;
}

const ReportesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
    const [fechaFin, setFechaFin] = useState<Dayjs | null>(dayjs());
    const [filtroRobot, setFiltroRobot] = useState<string>('todos');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);

    const robots = mockDataService.getRobots();
    const jornadas = mockDataService.getJornadas();
    const malezas = mockDataService.getMalezas();
    const [tanques, setTanques] = useState([]);

    useEffect(() => {
        loadReportData();
    }, [fechaInicio, fechaFin, filtroRobot]);

    useEffect(() => {
        if (reportData) {
            loadReportData();
        }
    }, [filtroRobot, fechaInicio, fechaFin]);

    const loadReportData = () => {
        setLoading(true);
        const tanquesData = mockDataService.getTanques();
        setTanques(tanquesData);
        generateReportData();
    };

    const generateReportData = () => {
        setLoading(true);
        
        // Simular carga de datos
        setTimeout(() => {
            const data: ReportData = {
                productividad: generateProductividadData(),
                estadoSistema: generateEstadoSistemaData(),
                tendencias: generateTendenciasData(),
                costos: generateCostosData()
            };
            setReportData(data);
            setLoading(false);
        }, 1000);
    };

    const generateProductividadData = () => {
        let filteredJornadas = jornadas;
        
        // Filtrar por robot si se seleccionó uno específico
        if (filtroRobot !== 'todos') {
            filteredJornadas = jornadas.filter(j => j.robot_id.toString() === filtroRobot);
        }
        
        // Filtrar por rango de fechas
        if (fechaInicio && fechaFin) {
            filteredJornadas = filteredJornadas.filter(j => {
                const fechaJornada = dayjs(j.fecha);
                return fechaJornada.isAfter(fechaInicio.subtract(1, 'day')) && 
                       fechaJornada.isBefore(fechaFin.add(1, 'day'));
            });
        }
        
        return filteredJornadas.map(jornada => ({
            fecha: jornada.fecha,
            robot: jornada.robot_nombre,
            area: jornada.area_cubierta,
            malezas: jornada.malezas_detectadas,
            herbicida: jornada.herbicida_usado,
            eficiencia: jornada.duracion && jornada.duracion > 0 ? parseFloat((jornada.area_cubierta / jornada.duracion * 60).toFixed(2)) : 0
        }));
    };

    const generateEstadoSistemaData = () => {
        let filteredRobots = robots;
        let filteredMalezas = malezas;
        
        // Si se seleccionó un robot específico, mostrar solo su información
        if (filtroRobot !== 'todos') {
            filteredRobots = robots.filter(r => r.id_robot.toString() === filtroRobot);
            // Filtrar malezas detectadas por ese robot específico
            const robotSeleccionado = robots.find(r => r.id_robot.toString() === filtroRobot);
            if (robotSeleccionado) {
                filteredMalezas = malezas.filter(m => m.robot_detector === robotSeleccionado.nombre);
            }
        }
        
        return {
            robotsActivos: filteredRobots.filter(r => r.estado === 'En Operación').length,
            robotsMantenimiento: filteredRobots.filter(r => r.estado === 'Mantenimiento').length,
            tanquesLlenos: tanques.filter(t => t.estado === 'Lleno').length,
            tanquesBajos: tanques.filter(t => t.estado === 'Bajo').length,
            malezasDetectadas: filteredMalezas.filter(m => m.estado === 'Detectada').length,
            malezasEliminadas: filteredMalezas.filter(m => m.estado === 'Eliminada').length
        };
    };

    const generateTendenciasData = () => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            let jornadasDia = jornadas.filter(j => j.fecha === date);
            
            // Filtrar por robot si se seleccionó uno específico
            if (filtroRobot !== 'todos') {
                jornadasDia = jornadasDia.filter(j => j.robot_id.toString() === filtroRobot);
            }
            
            return {
                fecha: date,
                jornadas: jornadasDia.length,
                area: jornadasDia.reduce((sum, j) => sum + j.area_cubierta, 0),
                malezas: jornadasDia.reduce((sum, j) => sum + j.malezas_detectadas, 0)
            };
        }).reverse();
        return last7Days;
    };

    const generateCostosData = () => {
        let filteredJornadas = jornadas;
        let filteredRobots = robots;
        
        // Filtrar por robot si se seleccionó uno específico
        if (filtroRobot !== 'todos') {
            filteredJornadas = jornadas.filter(j => j.robot_id.toString() === filtroRobot);
            filteredRobots = robots.filter(r => r.id_robot.toString() === filtroRobot);
        }
        
        // Filtrar por rango de fechas
        if (fechaInicio && fechaFin) {
            filteredJornadas = filteredJornadas.filter(j => {
                const fechaJornada = dayjs(j.fecha);
                return fechaJornada.isAfter(fechaInicio.subtract(1, 'day')) && 
                       fechaJornada.isBefore(fechaFin.add(1, 'day'));
            });
        }
        
        const totalHerbicida = filteredJornadas.reduce((sum, j) => sum + j.herbicida_usado, 0);
        const costoHerbicida = totalHerbicida * 12500; // $12,500 COP por litro
        const horasOperacion = filteredJornadas.reduce((sum, j) => sum + j.duracion, 0);
        const costoEnergia = horasOperacion * 3200; // $3,200 COP por hora
        const costoMantenimiento = filteredRobots.length * 250000; // $250,000 COP por robot
        
        return {
            herbicida: costoHerbicida,
            energia: costoEnergia,
            mantenimiento: costoMantenimiento,
            total: costoHerbicida + costoEnergia + costoMantenimiento
        };
    };

    const handleExportPDF = () => {
        setAlert({ open: true, message: 'Generando reporte PDF...', severity: 'success' });
        
        try {
            if (!reportData) {
                throw new Error('No hay datos para generar el reporte');
            }

            const doc = new jsPDF();
            
            // Título del reporte
            doc.setFontSize(20);
            doc.text('Reporte del Sistema Aspersax', 20, 20);
            
            // Información del período
            doc.setFontSize(12);
            const fechaInicioStr = fechaInicio ? fechaInicio.format('DD/MM/YYYY') : 'N/A';
            const fechaFinStr = fechaFin ? fechaFin.format('DD/MM/YYYY') : 'N/A';
            doc.text(`Período: ${fechaInicioStr} - ${fechaFinStr}`, 20, 35);
            doc.text(`Generado: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 20, 45);
            
            let yPosition = 60;
            
            // Sección de Productividad
            doc.setFontSize(16);
            doc.text('Reporte de Productividad', 20, yPosition);
            yPosition += 15;
            
            if (reportData.productividad && reportData.productividad.length > 0) {
                const productividadData = reportData.productividad.map(item => [
                    item.fecha || 'N/A',
                    item.robot || 'N/A',
                    `${item.area || 0} ha`,
                    (item.malezas || 0).toString(),
                    `${item.herbicida || 0} L`,
                    `${item.eficiencia || 0} ha/h`
                ]);
                
                autoTable(doc, {
                    startY: yPosition,
                    head: [['Fecha', 'Robot', 'Área', 'Malezas', 'Herbicida', 'Eficiencia']],
                    body: productividadData,
                    theme: 'grid',
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [41, 128, 185] }
                });
                
                yPosition = (doc as any).lastAutoTable.finalY + 20;
            } else {
                doc.setFontSize(12);
                doc.text('No hay datos de productividad disponibles', 20, yPosition);
                yPosition += 30;
            }
            
            // Sección de Costos
            doc.setFontSize(16);
            doc.text('Análisis de Costos', 20, yPosition);
            yPosition += 15;
            
            if (reportData.costos) {
                const costosData = [
                    ['Herbicida', `$${(reportData.costos.herbicida || 0).toLocaleString('es-CO')} COP`],
                    ['Energía', `$${(reportData.costos.energia || 0).toLocaleString('es-CO')} COP`],
                    ['Mantenimiento', `$${(reportData.costos.mantenimiento || 0).toLocaleString('es-CO')} COP`],
                    ['TOTAL', `$${(reportData.costos.total || 0).toLocaleString('es-CO')} COP`]
                ];
                
                autoTable(doc, {
                    startY: yPosition,
                    head: [['Concepto', 'Costo']],
                    body: costosData,
                    theme: 'grid',
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [231, 76, 60] }
                });
            }
            
            // Guardar el PDF
            doc.save(`Reporte_Aspersax_${dayjs().format('YYYY-MM-DD')}.pdf`);
            
            setAlert({ open: true, message: 'Reporte PDF descargado exitosamente', severity: 'success' });
        } catch (error) {
            console.error('Error generando PDF:', error);
            setAlert({ open: true, message: `Error al generar el PDF: ${error}`, severity: 'error' });
        }
    };

    const handleExportExcel = () => {
        setAlert({ open: true, message: 'Generando reporte Excel...', severity: 'success' });
        
        try {
            const workbook = XLSX.utils.book_new();
            
            if (reportData) {
                // Hoja de Productividad
                const productividadSheet = XLSX.utils.json_to_sheet(
                    reportData.productividad.map(item => ({
                        'Fecha': item.fecha,
                        'Robot': item.robot,
                        'Área (ha)': item.area,
                        'Malezas Detectadas': item.malezas,
                        'Herbicida (L)': item.herbicida,
                        'Eficiencia (ha/h)': item.eficiencia
                    }))
                );
                XLSX.utils.book_append_sheet(workbook, productividadSheet, 'Productividad');
                
                // Hoja de Estado del Sistema
                const estadoSheet = XLSX.utils.json_to_sheet([
                    { 'Concepto': 'Robots Activos', 'Cantidad': reportData.estadoSistema.robotsActivos },
                    { 'Concepto': 'Robots en Mantenimiento', 'Cantidad': reportData.estadoSistema.robotsMantenimiento },
                    { 'Concepto': 'Tanques Llenos', 'Cantidad': reportData.estadoSistema.tanquesLlenos },
                    { 'Concepto': 'Tanques Bajos', 'Cantidad': reportData.estadoSistema.tanquesBajos },
                    { 'Concepto': 'Malezas Detectadas', 'Cantidad': reportData.estadoSistema.malezasDetectadas },
                    { 'Concepto': 'Malezas Eliminadas', 'Cantidad': reportData.estadoSistema.malezasEliminadas }
                ]);
                XLSX.utils.book_append_sheet(workbook, estadoSheet, 'Estado Sistema');
                
                // Hoja de Tendencias
                const tendenciasSheet = XLSX.utils.json_to_sheet(
                    reportData.tendencias.map(item => ({
                        'Fecha': item.fecha,
                        'Jornadas': item.jornadas,
                        'Área Cubierta (ha)': item.area,
                        'Malezas Detectadas': item.malezas
                    }))
                );
                XLSX.utils.book_append_sheet(workbook, tendenciasSheet, 'Tendencias');
                
                // Hoja de Costos
                const costosSheet = XLSX.utils.json_to_sheet([
                    { 'Concepto': 'Herbicida', 'Costo (COP)': reportData.costos.herbicida },
                    { 'Concepto': 'Energía', 'Costo (COP)': reportData.costos.energia },
                    { 'Concepto': 'Mantenimiento', 'Costo (COP)': reportData.costos.mantenimiento },
                    { 'Concepto': 'TOTAL', 'Costo (COP)': reportData.costos.total }
                ]);
                XLSX.utils.book_append_sheet(workbook, costosSheet, 'Costos');
            }
            
            // Guardar el archivo Excel
            XLSX.writeFile(workbook, `Reporte_Aspersax_${dayjs().format('YYYY-MM-DD')}.xlsx`);
            
            setAlert({ open: true, message: 'Reporte Excel descargado exitosamente', severity: 'success' });
        } catch (error) {
            console.error('Error generando Excel:', error);
            setAlert({ open: true, message: 'Error al generar el Excel', severity: 'error' });
        }
    };

    const handleSendEmail = () => {
        setEmailDialogOpen(true);
    };

    const handleEmailSend = async (emailData: any) => {
        try {
            setAlert({ open: true, message: 'Enviando reporte por email...', severity: 'success' });
            
            const reportType = getReportTypeName();
            const fechaInicioStr = fechaInicio?.format('YYYY-MM-DD') || '';
            const fechaFinStr = fechaFin?.format('YYYY-MM-DD') || '';
            
            await emailService.enviarReportePorEmail(
                emailData,
                reportType,
                reportData!,
                filtroRobot,
                fechaInicioStr,
                fechaFinStr
            );
            
            setAlert({ open: true, message: 'Reporte enviado por email exitosamente', severity: 'success' });
        } catch (error: any) {
            setAlert({ open: true, message: error.message || 'Error al enviar el reporte', severity: 'error' });
        }
    };

    const getReportTypeName = () => {
        const reportTypes = ['Productividad', 'Estado del Sistema', 'Tendencias', 'Análisis de Costos'];
        return reportTypes[activeTab] || 'Reporte General';
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                    📊 Reportes del Sistema
                </Typography>
                
                {/* Controles de filtros */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                            <FilterIcon sx={{ mr: 1 }} />
                            Filtros y Configuración
                        </Typography>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <DatePicker
                                    label="Fecha Inicio"
                                    value={fechaInicio}
                                    onChange={(newValue) => {
                                        setFechaInicio(newValue);
                                        setLoading(true);
                                    }}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <DatePicker
                                    label="Fecha Fin"
                                    value={fechaFin}
                                    onChange={(newValue) => {
                                        setFechaFin(newValue);
                                        setLoading(true);
                                    }}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Robot</InputLabel>
                                    <Select
                                        value={filtroRobot}
                                        label="Robot"
                                        onChange={(e) => {
                                            setFiltroRobot(e.target.value);
                                            setLoading(true);
                                        }}
                                    >
                                        <MenuItem value="todos">Todos los robots</MenuItem>
                                        {robots.map(robot => (
                                            <MenuItem key={robot.id_robot} value={robot.id_robot.toString()}>
                                                {robot.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Exportar PDF">
                                        <IconButton onClick={handleExportPDF} color="error">
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Exportar Excel">
                                        <IconButton onClick={handleExportExcel} color="success">
                                            <DownloadIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Enviar por Email">
                                        <IconButton onClick={handleSendEmail} color="primary">
                                            <EmailIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Imprimir">
                                        <IconButton onClick={() => window.print()} color="default">
                                            <PrintIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Pestañas de reportes */}
                <Card>
                    <CardContent>
                        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                            <Tab icon={<TrendingUpIcon />} label="Productividad" />
                            <Tab icon={<AssessmentIcon />} label="Estado Sistema" />
                            <Tab icon={<ScheduleIcon />} label="Tendencias" />
                            <Tab icon={<SmartToyIcon />} label="Análisis Costos" />
                        </Tabs>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                {/* Tab 0: Productividad */}
                                {activeTab === 0 && reportData && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 3 }}>Reporte de Productividad</Typography>
                                        
                                        {/* Gráfico de eficiencia por robot */}
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Eficiencia por Jornada (ha/hora)</Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={reportData.productividad}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="fecha" />
                                                        <YAxis />
                                                        <RechartsTooltip />
                                                        <Bar dataKey="eficiencia" fill="#8884d8" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>

                                        {/* Tabla detallada */}
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Fecha</TableCell>
                                                        <TableCell>Robot</TableCell>
                                                        <TableCell>Área (ha)</TableCell>
                                                        <TableCell>Malezas</TableCell>
                                                        <TableCell>Herbicida (L)</TableCell>
                                                        <TableCell>Eficiencia (ha/h)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {reportData.productividad.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{row.fecha}</TableCell>
                                                            <TableCell>{row.robot}</TableCell>
                                                            <TableCell>{row.area}</TableCell>
                                                            <TableCell>{row.malezas}</TableCell>
                                                            <TableCell>{row.herbicida}</TableCell>
                                                            <TableCell>
                                                                <Chip 
                                                                    label={row.eficiencia} 
                                                                    color={parseFloat(row.eficiencia) > 10 ? 'success' : 'warning'}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                )}

                                {/* Tab 1: Estado del Sistema */}
                                {activeTab === 1 && reportData && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 3 }}>Estado Actual del Sistema</Typography>
                                        
                                        <Grid container spacing={3} sx={{ mb: 3 }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                                    <Typography variant="h4">{reportData.estadoSistema.robotsActivos}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Robots Activos</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <WaterDropIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                                                    <Typography variant="h4">{reportData.estadoSistema.tanquesLlenos}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Tanques Llenos</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <GrassIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                                    <Typography variant="h4">{reportData.estadoSistema.malezasDetectadas}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Malezas Detectadas</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <TerrainIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                                    <Typography variant="h4">{jornadas.length}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Jornadas Totales</Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* Gráfico de distribución */}
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{ mb: 2 }}>Estado de Robots</Typography>
                                                        <ResponsiveContainer width="100%" height={250}>
                                                            <PieChart>
                                                                <Pie
                                                                    data={[
                                                                        { name: 'Activos', value: reportData.estadoSistema.robotsActivos },
                                                                        { name: 'Mantenimiento', value: reportData.estadoSistema.robotsMantenimiento },
                                                                        { name: 'Inactivos', value: robots.length - reportData.estadoSistema.robotsActivos - reportData.estadoSistema.robotsMantenimiento }
                                                                    ]}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={80}
                                                                    dataKey="value"
                                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                                >
                                                                    {COLORS.map((color, index) => (
                                                                        <Cell key={`cell-${index}`} fill={color} />
                                                                    ))}
                                                                </Pie>
                                                                <RechartsTooltip />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{ mb: 2 }}>Estado de Malezas</Typography>
                                                        <ResponsiveContainer width="100%" height={250}>
                                                            <PieChart>
                                                                <Pie
                                                                    data={[
                                                                        { name: 'Detectadas', value: reportData.estadoSistema.malezasDetectadas },
                                                                        { name: 'Eliminadas', value: reportData.estadoSistema.malezasEliminadas },
                                                                        { name: 'En Tratamiento', value: malezas.length - reportData.estadoSistema.malezasDetectadas - reportData.estadoSistema.malezasEliminadas }
                                                                    ]}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={80}
                                                                    dataKey="value"
                                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                                >
                                                                    {COLORS.map((color, index) => (
                                                                        <Cell key={`cell-${index}`} fill={color} />
                                                                    ))}
                                                                </Pie>
                                                                <RechartsTooltip />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {/* Tab 2: Tendencias */}
                                {activeTab === 2 && reportData && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 3 }}>Análisis de Tendencias (Últimos 7 días)</Typography>
                                        
                                        <Card sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Evolución de Jornadas y Área Cubierta</Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <LineChart data={reportData.tendencias}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="fecha" />
                                                        <YAxis yAxisId="left" />
                                                        <YAxis yAxisId="right" orientation="right" />
                                                        <RechartsTooltip />
                                                        <Line yAxisId="left" type="monotone" dataKey="jornadas" stroke="#8884d8" name="Jornadas" />
                                                        <Line yAxisId="right" type="monotone" dataKey="area" stroke="#82ca9d" name="Área (ha)" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Detección de Malezas por Día</Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <AreaChart data={reportData.tendencias}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="fecha" />
                                                        <YAxis />
                                                        <RechartsTooltip />
                                                        <Area type="monotone" dataKey="malezas" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                )}

                                {/* Tab 3: Análisis de Costos */}
                                {activeTab === 3 && reportData && (
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 3 }}>Análisis de Costos Operativos</Typography>
                                        
                                        <Grid container spacing={3} sx={{ mb: 3 }}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.herbicida.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Costo Herbicida</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.energia.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Costo Energía</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.mantenimiento.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Mantenimiento</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.total.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Costo Total</Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Distribución de Costos</Typography>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Herbicida', value: reportData.costos.herbicida },
                                                                { name: 'Energía', value: reportData.costos.energia },
                                                                { name: 'Mantenimiento', value: reportData.costos.mantenimiento }
                                                            ]}
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={100}
                                                            dataKey="value"
                                                            label={({ name, value }) => `${name}: $${value.toLocaleString('es-CO')} COP`}
                                                        >
                                                            {COLORS.map((color, index) => (
                                                                <Cell key={`cell-${index}`} fill={color} />
                                                            ))}
                                                        </Pie>
                                                        <RechartsTooltip formatter={(value) => `$${Number(value).toLocaleString('es-CO')} COP`} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Alert para notificaciones */}
                {alert.open && (
                    <Alert 
                        severity={alert.severity} 
                        onClose={() => setAlert({ ...alert, open: false })}
                        sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
                    >
                        {alert.message}
                    </Alert>
                )}

                {/* Dialog de Email */}
                <EmailDialog
                    open={emailDialogOpen}
                    onClose={() => setEmailDialogOpen(false)}
                    onSend={handleEmailSend}
                    reportType={getReportTypeName()}
                    reportData={reportData}
                />
            </Box>
        </LocalizationProvider>
    );
};

export default ReportesPage; 