import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';

interface ActivityChartsProps {
  activityData: { fecha: string; robots: number; malezas: number; area_cubierta: number; herbicida_usado: number }[];
  batteryStats: { name: string; value: number }[];
  tankStats: { name: string; nivel: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ActivityCharts: React.FC<ActivityChartsProps> = ({ activityData, batteryStats, tankStats }) => {
  const theme = useTheme();
  const pieData = batteryStats;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {/* Gráfica de actividad */}
      <Box sx={{ width: { xs: '100%', md: '33%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actividad del Período
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="robots" stroke="#8884d8" name="Robots" />
                <Line type="monotone" dataKey="malezas" stroke="#82ca9d" name="Malezas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
      {/* Gráfica de batería (diagrama de torta) */}
      <Box sx={{ width: { xs: '100%', md: '33%' }, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <CardContent sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Estado de Batería (Robots)
            </Typography>
            <ResponsiveContainer width={350} height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx={175}
                  cy={140}
                  outerRadius={110}
                  label={false}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {pieData.map((item, idx) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length], mr: 1 }} />
                  <Typography variant="body2" sx={{ color: COLORS[idx % COLORS.length], fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
      {/* Gráfica de tanques */}
      <Box sx={{ width: { xs: '100%', md: '33%' } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Niveles de Tanques (%)
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tankStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Nivel']} labelFormatter={(label: string) => `Tanque: ${label}`} />
                <Bar dataKey="nivel" fill={theme.palette.info.main} name="Nivel (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ActivityCharts;

interface ActivityChartsProps {
    activityData: { fecha: string; robots: number; malezas: number; area_cubierta: number; herbicida_usado: number }[];
    batteryStats: { name: string; value: number }[];
    tankStats: { name: string; nivel: number }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ActivityCharts: React.FC<ActivityChartsProps> = ({ activityData, batteryStats, tankStats }) => {
    const theme = useTheme();
    const pieData = batteryStats;

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Gráfica de actividad */}
            <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Actividad del Período
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="robots" stroke="#8884d8" name="Robots" />
                                <Line type="monotone" dataKey="malezas" stroke="#82ca9d" name="Malezas" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Box>
            {/* Gráfica de batería (diagrama de torta) */}
            <Box sx={{ width: { xs: '100%', md: '33%' }, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <CardContent sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Estado de Batería (Robots)
                        </Typography>
                        <ResponsiveContainer width={350} height={350}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx={175}
                                    cy={140}
                                    outerRadius={110}
                                    label={false}
                                    labelLine={false}
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ mt: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {pieData.map((item, idx) => (
                                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length], mr: 1 }} />
                                    <Typography variant="body2" sx={{ color: COLORS[idx % COLORS.length], fontWeight: 500 }}>
                                        {item.name}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Box>
            {/* Gráfica de tanques */}
            <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Niveles de Tanques (%)
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={tankStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                                <YAxis domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} />
                                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Nivel']} labelFormatter={(label: string) => `Tanque: ${label}`} />
                                <Bar dataKey="nivel" fill={theme.palette.info.main} name="Nivel (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ActivityCharts;
