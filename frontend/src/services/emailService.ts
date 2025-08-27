import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF interface for TypeScript
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
}

interface EmailData {
    destinatarios: string[];
    asunto: string;
    mensaje: string;
    incluirPDF: boolean;
    incluirExcel: boolean;
}

interface ReportData {
    productividad: any[];
    estadoSistema: any;
    tendencias: any[];
    costos: any;
}

class EmailService {
    async enviarReportePorEmail(
        emailData: EmailData, 
        reportType: string, 
        reportData: ReportData,
        filtroRobot: string,
        fechaInicio: string,
        fechaFin: string
    ): Promise<void> {
        try {
            console.log('Enviando reporte por email:', emailData);
            
            // Generar archivos adjuntos si están habilitados
            const adjuntos = [];
            
            if (emailData.incluirPDF) {
                const pdfBlob = await this.generarPDF(reportType, reportData, filtroRobot, fechaInicio, fechaFin);
                adjuntos.push({
                    nombre: `Reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`,
                    tipo: 'application/pdf',
                    contenido: pdfBlob
                });
            }
            
            if (emailData.incluirExcel) {
                const excelBlob = await this.generarExcel(reportType, reportData, filtroRobot, fechaInicio, fechaFin);
                adjuntos.push({
                    nombre: `Reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`,
                    tipo: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    contenido: excelBlob
                });
            }

            // Enviar email real a través del backend
            await this.enviarEmailReal(emailData, adjuntos);
            
            // Guardar registro del envío
            this.guardarRegistroEnvio(emailData, reportType, adjuntos.length);
            
        } catch (error: any) {
            console.error('Error al enviar email:', error);
            throw new Error(error.message || 'Error al enviar el reporte por email');
        }
    }

    private async generarPDF(
        reportType: string, 
        reportData: ReportData, 
        filtroRobot: string, 
        fechaInicio: string, 
        fechaFin: string
    ): Promise<Blob> {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        
        // Configuración del documento
        doc.setFontSize(20);
        doc.text(`Reporte ${reportType}`, 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Período: ${fechaInicio} - ${fechaFin}`, 20, 35);
        doc.text(`Robot: ${filtroRobot === 'todos' ? 'Todos los robots' : `Robot ${filtroRobot}`}`, 20, 45);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 20, 55);

        let yPosition = 70;

        // Generar contenido según el tipo de reporte
        switch (reportType) {
            case 'Productividad':
                if (reportData.productividad && reportData.productividad.length > 0) {
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['Fecha', 'Robot', 'Área Cubierta (ha)', 'Malezas Detectadas', 'Herbicida Usado (L)', 'Eficiencia (%)']],
                        body: reportData.productividad.map(item => [
                            item.fecha,
                            item.robot,
                            item.areaCubierta ? item.areaCubierta.toFixed(2) : '0.00',
                            item.malezasDetectadas,
                            item.herbicidaUsado ? item.herbicidaUsado.toFixed(2) : '0.00',
                            typeof item.eficiencia === 'number' ? item.eficiencia.toFixed(1) : '0.0'
                        ]),
                        theme: 'striped',
                        headStyles: { fillColor: [26, 159, 11] }
                    });
                }
                break;

            case 'Estado del Sistema':
                if (reportData.estadoSistema) {
                    const estado = reportData.estadoSistema;
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['Métrica', 'Valor']],
                        body: [
                            ['Robots Activos', estado.robotsActivos],
                            ['Robots en Mantenimiento', estado.robotsMantenimiento],
                            ['Área Total Cubierta', `${estado.areaTotalCubierta} ha`],
                            ['Eficiencia Promedio', `${estado.eficienciaPromedio}%`],
                            ['Último Mantenimiento', estado.ultimoMantenimiento]
                        ],
                        theme: 'striped',
                        headStyles: { fillColor: [26, 159, 11] }
                    });
                }
                break;

            case 'Análisis de Costos':
                if (reportData.costos) {
                    const costos = reportData.costos;
                    autoTable(doc, {
                        startY: yPosition,
                        head: [['Concepto', 'Costo (COP)']],
                        body: [
                            ['Herbicida', costos.herbicida.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })],
                            ['Mantenimiento', costos.mantenimiento.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })],
                            ['Energía', costos.energia.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })],
                            ['Personal', costos.personal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })],
                            ['TOTAL', costos.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })]
                        ],
                        theme: 'striped',
                        headStyles: { fillColor: [26, 159, 11] }
                    });
                }
                break;
        }

        return new Blob([doc.output('blob')], { type: 'application/pdf' });
    }

    private async generarExcel(
        reportType: string, 
        reportData: ReportData, 
        filtroRobot: string, 
        fechaInicio: string, 
        fechaFin: string
    ): Promise<Blob> {
        const wb = XLSX.utils.book_new();
        
        // Hoja de información general
        const infoData = [
            ['Reporte', reportType],
            ['Período', `${fechaInicio} - ${fechaFin}`],
            ['Robot', filtroRobot === 'todos' ? 'Todos los robots' : `Robot ${filtroRobot}`],
            ['Generado', new Date().toLocaleString()],
            [''],
        ];
        
        let mainData: any[] = [];
        
        // Generar datos según el tipo de reporte
        switch (reportType) {
            case 'Productividad':
                if (reportData.productividad && reportData.productividad.length > 0) {
                    mainData = [
                        ['Fecha', 'Robot', 'Área Cubierta (ha)', 'Malezas Detectadas', 'Herbicida Usado (L)', 'Eficiencia (%)'],
                        ...reportData.productividad.map(item => [
                            item.fecha,
                            item.robot,
                            item.areaCubierta,
                            item.malezasDetectadas,
                            item.herbicidaUsado,
                            item.eficiencia
                        ])
                    ];
                }
                break;

            case 'Estado del Sistema':
                if (reportData.estadoSistema) {
                    const estado = reportData.estadoSistema;
                    mainData = [
                        ['Métrica', 'Valor'],
                        ['Robots Activos', estado.robotsActivos],
                        ['Robots en Mantenimiento', estado.robotsMantenimiento],
                        ['Área Total Cubierta', `${estado.areaTotalCubierta} ha`],
                        ['Eficiencia Promedio', `${estado.eficienciaPromedio}%`],
                        ['Último Mantenimiento', estado.ultimoMantenimiento]
                    ];
                }
                break;

            case 'Análisis de Costos':
                if (reportData.costos) {
                    const costos = reportData.costos;
                    mainData = [
                        ['Concepto', 'Costo (COP)'],
                        ['Herbicida', costos.herbicida],
                        ['Mantenimiento', costos.mantenimiento],
                        ['Energía', costos.energia],
                        ['Personal', costos.personal],
                        ['TOTAL', costos.total]
                    ];
                }
                break;
        }

        // Combinar información general con datos principales
        const allData = [...infoData, ...mainData];
        
        const ws = XLSX.utils.aoa_to_sheet(allData);
        XLSX.utils.book_append_sheet(wb, ws, reportType);
        
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        return new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
    }

    private async enviarEmailReal(emailData: EmailData, adjuntos: any[]): Promise<void> {
        try {
            // Convertir adjuntos a base64 para envío
            const adjuntosBase64 = await Promise.all(
                adjuntos.map(async (adjunto) => {
                    const reader = new FileReader();
                    return new Promise((resolve) => {
                        reader.onload = () => {
                            resolve({
                                nombre: adjunto.nombre,
                                tipo: adjunto.tipo,
                                contenido: reader.result
                            });
                        };
                        reader.readAsDataURL(adjunto.contenido);
                    });
                })
            );

            // Obtener token de autenticación
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
            }

            // Enviar al backend
            const response = await fetch('http://127.0.0.1:8000/api/emails/enviar/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    destinatarios: emailData.destinatarios,
                    asunto: emailData.asunto,
                    mensaje: emailData.mensaje,
                    adjuntos: adjuntosBase64
                })
            });

            if (!response.ok) {
                let errorMessage = 'Error al enviar email';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    // Si no se puede parsear como JSON, usar el status text
                    errorMessage = `Error ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            
            // Mostrar mensaje de éxito
            const destinatariosText = emailData.destinatarios.length > 3 
                ? `${emailData.destinatarios.slice(0, 3).join(', ')} y ${emailData.destinatarios.length - 3} más`
                : emailData.destinatarios.join(', ');
                
            alert(`EMAIL ENVIADO EXITOSAMENTE:\n\nDestinatarios: ${destinatariosText}\nAsunto: ${emailData.asunto}\nAdjuntos: ${adjuntos.length} archivo(s)\n\n${result.message}`);
            
        } catch (error: any) {
            console.error('Error al enviar email real:', error);
            throw new Error(`Error al enviar email: ${error.message}`);
        }
    }

    private guardarRegistroEnvio(emailData: EmailData, reportType: string, cantidadAdjuntos: number): void {
        const registros = JSON.parse(localStorage.getItem('registrosEmail') || '[]');
        
        const nuevoRegistro = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            destinatarios: emailData.destinatarios,
            asunto: emailData.asunto,
            tipoReporte: reportType,
            adjuntos: cantidadAdjuntos,
            estado: 'enviado'
        };
        
        registros.push(nuevoRegistro);
        
        // Mantener solo los últimos 100 registros
        if (registros.length > 100) {
            registros.splice(0, registros.length - 100);
        }
        
        localStorage.setItem('registrosEmail', JSON.stringify(registros));
    }

    getRegistrosEnvio(): any[] {
        return JSON.parse(localStorage.getItem('registrosEmail') || '[]');
    }

    // Validar configuración de email (para futuras implementaciones)
    validarConfiguracionEmail(): boolean {
        // En producción, verificar configuración SMTP, API keys, etc.
        return true;
    }
}

export default new EmailService();
