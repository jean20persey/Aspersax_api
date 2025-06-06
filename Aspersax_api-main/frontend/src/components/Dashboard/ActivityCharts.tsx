import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

interface ActivityData {
  fecha: string;
  robots: number;
  malezas: number;
  herbicida_usado: number;
  area_cubierta: number;
}

interface ActivityChartsProps {
  data: ActivityData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        {payload.map((entry: any) => (
          <Box key={entry.name} sx={{ color: entry.color }}>
            <Typography variant="body2">
              {entry.name}: {entry.value}
              {entry.unit}
            </Typography>
          </Box>
        ))}
      </Card>
    );
  }
  return null;
};

const ActivityCharts: React.FC<ActivityChartsProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Main Activity Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Actividad General
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="robots"
                  name="Robots Activos"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="malezas"
                  name="Malezas Detectadas"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Resource Usage Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Uso de Recursos
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="herbicida_usado"
                  name="Herbicida Usado (L)"
                  stroke={theme.palette.info.main}
                  fill={theme.palette.info.light}
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="area_cubierta"
                  name="Área Cubierta (m²)"
                  stroke={theme.palette.warning.main}
                  fill={theme.palette.warning.light}
                  stackId="2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Weed Detection Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detección de Malezas
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="malezas"
                  name="Malezas Detectadas"
                  fill={theme.palette.success.main}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityCharts; 