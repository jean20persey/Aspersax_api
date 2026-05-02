import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tabs,
    Tab,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Tooltip,
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
    Area,
    Legend,
    ReferenceLine,
    Brush,
} from 'recharts';
import {
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    Email as EmailIcon,
    FilterList as FilterIcon,
    WaterDrop as WaterDropIcon,
    Terrain as TerrainIcon
} from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GrassIcon from '@mui/icons-material/Grass';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import mockDataService from '../services/mockDataService';
import EmailDialog from '../components/EmailDialog';
import emailService from '../services/emailService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { logoBase64 } from '../constants/logoBase64';

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
    const [tanques, setTanques] = useState<any[]>([]);

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
        setTanques(tanquesData as any[]);
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
            robotsMantenimiento: filteredRobots.filter(r => r.estado === 'En Mantenimiento').length,
            tanquesLlenos: tanques.filter((t: any) => t.estado === 'Lleno').length,
            tanquesBajos: tanques.filter((t: any) => t.estado === 'Bajo').length,
            malezasDetectadas: filteredMalezas.filter(m => m.estado === 'Detectada').length,
            malezasTratadas: filteredMalezas.filter(m => m.estado === 'Tratada').length,
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
            
            // Añadir Logo
            doc.addImage(logoBase64, 'JPEG', 20, 10, 30, 30);

            // Título del reporte
            doc.setFontSize(22);
            doc.setTextColor(46, 125, 50); // #2e7d32
            doc.text('Reporte Analítico - ASPERSAX', 60, 25);
            
            // Información del período
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            const fechaInicioStr = fechaInicio ? fechaInicio.format('DD/MM/YYYY') : 'N/A';
            const fechaFinStr = fechaFin ? fechaFin.format('DD/MM/YYYY') : 'N/A';
            doc.text(`Período: ${fechaInicioStr} - ${fechaFinStr}`, 60, 35);
            doc.text(`Generado: ${dayjs().format('DD/MM/YYYY HH:mm')}`, 60, 42);
            
            // Línea separadora
            doc.setDrawColor(46, 125, 50);
            doc.setLineWidth(0.5);
            doc.line(20, 48, 190, 48);

            let yPosition = 60;
            
            // Sección de Productividad
            doc.setFontSize(16);
            doc.setTextColor(46, 125, 50);
            doc.text('Productividad del Campo', 20, yPosition);
            yPosition += 10;
            
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
                    styles: { fontSize: 10, cellPadding: 3 },
                    headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255] },
                    alternateRowStyles: { fillColor: [241, 248, 233] }
                });
                
                yPosition = (doc as any).lastAutoTable.finalY + 20;
            } else {
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                doc.text('No hay datos de productividad disponibles', 20, yPosition);
                yPosition += 20;
            }
            
            // Sección de Costos
            doc.setFontSize(16);
            doc.setTextColor(46, 125, 50);
            doc.text('Análisis de Costos', 20, yPosition);
            yPosition += 10;
            
            if (reportData.costos) {
                const costosData = [
                    ['Herbicida', `$${(reportData.costos.herbicida || 0).toLocaleString('es-CO')} COP`],
                    ['Energía', `$${(reportData.costos.energia || 0).toLocaleString('es-CO')} COP`],
                    ['Mantenimiento', `$${(reportData.costos.mantenimiento || 0).toLocaleString('es-CO')} COP`],
                    ['TOTAL', `$${(reportData.costos.total || 0).toLocaleString('es-CO')} COP`]
                ];
                
                autoTable(doc, {
                    startY: yPosition,
                    head: [['Concepto', 'Costo Estimado']],
                    body: costosData,
                    theme: 'grid',
                    styles: { fontSize: 10, cellPadding: 3 },
                    headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
                    alternateRowStyles: { fillColor: [254, 252, 232] }
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

    const handleExportExcel = async () => {
        setAlert({ open: true, message: 'Generando reporte Excel...', severity: 'success' });
        
        try {
            if (!reportData) throw new Error('No hay datos');

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Aspersax';
            workbook.created = new Date();

            const imageId = workbook.addImage({
                base64: logoBase64,
                extension: 'jpeg',
            });

            // Hoja 1: Productividad
            const sheet1 = workbook.addWorksheet('Productividad');
            sheet1.addImage(imageId, 'A1:C5');
            
            sheet1.mergeCells('D2:F3');
            sheet1.getCell('D2').value = 'REPORTE ANALÍTICO - ASPERSAX';
            sheet1.getCell('D2').font = { size: 16, bold: true, color: { argb: 'FF2E7D32' } };
            sheet1.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };

            sheet1.getRow(7).values = ['Fecha', 'Robot', 'Área (ha)', 'Malezas', 'Herbicida (L)', 'Eficiencia (ha/h)'];
            sheet1.getRow(7).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            sheet1.getRow(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E7D32' } };

            reportData.productividad.forEach((item, index) => {
                sheet1.addRow([item.fecha, item.robot, item.area, item.malezas, item.herbicida, item.eficiencia]);
            });
            sheet1.columns = [{ width: 15 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 18 }];

            // Hoja 2: Estado del Sistema
            const sheet2 = workbook.addWorksheet('Estado Sistema');
            sheet2.addImage(imageId, 'A1:B5');
            sheet2.getRow(7).values = ['Concepto', 'Cantidad'];
            sheet2.getRow(7).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            sheet2.getRow(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0EA5E9' } };
            
            sheet2.addRow(['Robots Activos', reportData.estadoSistema.robotsActivos]);
            sheet2.addRow(['Robots en Mantenimiento', reportData.estadoSistema.robotsMantenimiento]);
            sheet2.addRow(['Tanques Llenos', reportData.estadoSistema.tanquesLlenos]);
            sheet2.addRow(['Tanques Bajos', reportData.estadoSistema.tanquesBajos]);
            sheet2.addRow(['Malezas Detectadas', reportData.estadoSistema.malezasDetectadas]);
            sheet2.addRow(['Malezas Tratadas', reportData.estadoSistema.malezasTratadas]);
            sheet2.addRow(['Malezas Eliminadas', reportData.estadoSistema.malezasEliminadas]);
            sheet2.columns = [{ width: 30 }, { width: 15 }];

            // Hoja 3: Costos
            const sheet3 = workbook.addWorksheet('Costos');
            sheet3.addImage(imageId, 'A1:B5');
            sheet3.getRow(7).values = ['Concepto', 'Costo (COP)'];
            sheet3.getRow(7).font = { bold: true, color: { argb: 'FFFFFFFF' } };
            sheet3.getRow(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF59E0B' } };
            
            sheet3.addRow(['Herbicida', reportData.costos.herbicida]);
            sheet3.addRow(['Energía', reportData.costos.energia]);
            sheet3.addRow(['Mantenimiento', reportData.costos.mantenimiento]);
            sheet3.addRow(['TOTAL', reportData.costos.total]);
            sheet3.columns = [{ width: 25 }, { width: 20 }];
            
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), `Reporte_Aspersax_${dayjs().format('YYYY-MM-DD')}.xlsx`);
            
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

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
    
    // Componente personalizado para tooltips mejorados
    const CustomTooltip = ({ active, payload, label, formatter }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    boxShadow: 3,
                    minWidth: 200
                }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {label}
                    </Typography>
                    {payload.map((entry: any, index: number) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                            {`${entry.name}: ${formatter ? formatter(entry.value, entry.name) : entry.value}`}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    const renderGradients = () => (
        <defs>
            <linearGradient id="colorEficiencia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMalezas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
                <stop offset="100%" stopColor="#764ba2" stopOpacity={1}/>
            </linearGradient>
        </defs>
    );

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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                            <Grid size={{ xs: 12, sm: 3 }}>
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
                                        
                                        {/* Gráfico de eficiencia por robot mejorado */}
                                        <Card sx={{ mb: 3, boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                    Eficiencia por Jornada (ha/hora)
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={350}>
                                                    <BarChart data={reportData.productividad} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                        {renderGradients()}
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                        <XAxis 
                                                            dataKey="fecha" 
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                        />
                                                        <YAxis 
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                            label={{ value: 'Eficiencia (ha/h)', angle: -90, position: 'insideLeft' }}
                                                        />
                                                        <CustomTooltip 
                                                            formatter={(value: any) => [`${value} ha/h`, 'Eficiencia']}
                                                        />
                                                        <Bar 
                                                            dataKey="eficiencia" 
                                                            fill="url(#barGradient)"
                                                            radius={[4, 4, 0, 0]}
                                                            animationDuration={1000}
                                                        />
                                                        <ReferenceLine y={10} stroke="#ff7300" strokeDasharray="5 5" label="Meta: 10 ha/h" />
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
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                                    <Typography variant="h4">{reportData.estadoSistema.robotsActivos}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Robots Activos</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <WaterDropIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                                                    <Typography variant="h4">{reportData.estadoSistema.tanquesLlenos}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Tanques Llenos</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <GrassIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                                                    <Typography variant="h4">{reportData.estadoSistema.malezasDetectadas}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Malezas Detectadas</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2 }}>
                                                    <TerrainIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                                                    <Typography variant="h4">{jornadas.length}</Typography>
                                                    <Typography variant="body2" color="text.secondary">Jornadas Totales</Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        {/* Gráfico de distribución */}
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 6 }}>
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
                                            <Grid size={{ xs: 12, md: 6 }}>
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
                                        
                                        <Card sx={{ mb: 3, boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                    Evolución de Jornadas y Área Cubierta
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <LineChart data={reportData.tendencias} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                        {renderGradients()}
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                        <XAxis 
                                                            dataKey="fecha" 
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={60}
                                                        />
                                                        <YAxis 
                                                            yAxisId="left" 
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                            label={{ value: 'Jornadas', angle: -90, position: 'insideLeft' }}
                                                        />
                                                        <YAxis 
                                                            yAxisId="right" 
                                                            orientation="right"
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                            label={{ value: 'Área (ha)', angle: 90, position: 'insideRight' }}
                                                        />
                                                        <CustomTooltip 
                                                            formatter={(value: any, name: string) => [
                                                                name === 'jornadas' ? `${value} jornadas` : `${value} ha`,
                                                                name === 'jornadas' ? 'Jornadas' : 'Área Cubierta'
                                                            ]}
                                                        />
                                                        <Legend />
                                                        <Line 
                                                            yAxisId="left" 
                                                            type="monotone" 
                                                            dataKey="jornadas" 
                                                            stroke="#667eea" 
                                                            strokeWidth={3}
                                                            dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                                                            activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
                                                            name="Jornadas"
                                                            animationDuration={1500}
                                                        />
                                                        <Line 
                                                            yAxisId="right" 
                                                            type="monotone" 
                                                            dataKey="area" 
                                                            stroke="#82ca9d" 
                                                            strokeWidth={3}
                                                            dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                                                            activeDot={{ r: 8, stroke: '#82ca9d', strokeWidth: 2 }}
                                                            name="Área (ha)"
                                                            animationDuration={1500}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </CardContent>
                                        </Card>

                                        <Card sx={{ boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <GrassIcon sx={{ mr: 1, color: 'success.main' }} />
                                                    Detección de Malezas por Día
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={350}>
                                                    <AreaChart data={reportData.tendencias} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                        {renderGradients()}
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                        <XAxis 
                                                            dataKey="fecha" 
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={60}
                                                        />
                                                        <YAxis 
                                                            tick={{ fontSize: 12 }}
                                                            tickLine={{ stroke: '#ccc' }}
                                                            label={{ value: 'Malezas Detectadas', angle: -90, position: 'insideLeft' }}
                                                        />
                                                        <CustomTooltip 
                                                            formatter={(value: any) => [`${value} malezas`, 'Malezas Detectadas']}
                                                        />
                                                        <Area 
                                                            type="monotone" 
                                                            dataKey="malezas" 
                                                            stroke="#ff7300" 
                                                            strokeWidth={2}
                                                            fill="url(#colorMalezas)" 
                                                            fillOpacity={0.8}
                                                            animationDuration={2000}
                                                        />
                                                        <Brush dataKey="fecha" height={30} stroke="#ff7300" />
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
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.herbicida.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Costo Herbicida</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.energia.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Costo Energía</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.mantenimiento.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Mantenimiento</Typography>
                                                </Card>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', color: 'white' }}>
                                                    <Typography variant="h4">${reportData.costos.total.toLocaleString('es-CO')} COP</Typography>
                                                    <Typography variant="body2">Costo Total</Typography>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        <Card sx={{ boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                                    <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                    Distribución de Costos
                                                </Typography>
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Herbicida', value: reportData.costos.herbicida, color: '#667eea' },
                                                                { name: 'Energía', value: reportData.costos.energia, color: '#82ca9d' },
                                                                { name: 'Mantenimiento', value: reportData.costos.mantenimiento, color: '#ff7300' }
                                                            ]}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={120}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                            animationBegin={0}
                                                            animationDuration={1500}
                                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                                            labelLine={false}
                                                        >
                                                            {[
                                                                { name: 'Herbicida', value: reportData.costos.herbicida, color: '#667eea' },
                                                                { name: 'Energía', value: reportData.costos.energia, color: '#82ca9d' },
                                                                { name: 'Mantenimiento', value: reportData.costos.mantenimiento, color: '#ff7300' }
                                                            ].map((entry, index) => (
                                                                <Cell 
                                                                    key={`cell-${index}`} 
                                                                    fill={entry.color}
                                                                    stroke={entry.color}
                                                                    strokeWidth={2}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <CustomTooltip 
                                                            formatter={(value: any) => [`$${Number(value).toLocaleString('es-CO')} COP`, 'Costo']}
                                                        />
                                                        <Legend 
                                                            verticalAlign="bottom" 
                                                            height={36}
                                                            formatter={(value, entry: any) => (
                                                                <span style={{ color: entry.color, fontWeight: 'bold' }}>
                                                                    {value}
                                                                </span>
                                                            )}
                                                        />
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