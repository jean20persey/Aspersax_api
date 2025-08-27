import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecuperarPasswordPage from './pages/RecuperarPasswordPage';
import DashboardPage from './pages/DashboardPage';
import RobotsPage from './pages/RobotsPage';
import TanquesPage from './pages/TanquesPage';
import JornadasPage from './pages/JornadasPage';
import MalezasPage from './pages/MalezasPage';
import ReportesPage from './pages/ReportesPage';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a9f0b',
      dark: '#154c0f',
      light: '#45b939',
    },
    secondary: {
      main: '#2DFFF5',
      dark: '#1CCCC2',
      light: '#57FFF7',
    },
    info: {
      main: '#0288d1',
      dark: '#01579b',
      light: '#03a9f4',
    },
    success: {
      main: '#2e7d32',
      dark: '#1b5e20',
      light: '#4caf50',
    },
    warning: {
      main: '#ed6c02',
      dark: '#e65100',
      light: '#ff9800',
    },
    error: {
      main: '#d32f2f',
      dark: '#c62828',
      light: '#ef5350',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Navigation />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        ml: '240px',
        width: 'calc(100% - 240px)',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {children}
    </Box>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/recuperar-password" element={<RecuperarPasswordPage />} />
          
          {/* Ruta raíz redirige a /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/robots"
            element={
              <ProtectedRoute>
                <Layout>
                  <RobotsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tanques"
            element={
              <ProtectedRoute>
                <Layout>
                  <TanquesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/jornadas"
            element={
              <ProtectedRoute>
                <Layout>
                  <JornadasPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/malezas"
            element={
              <ProtectedRoute>
                <Layout>
                  <MalezasPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 