import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AdminIA from './pages/AdminIA';
import Caja from './pages/Caja';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import CocinaKDS from './pages/CocinaKDS';
import Inventario from './pages/Inventario';
import Reportes from './pages/Reportes';
import PortalCliente from './pages/PortalCliente';
import AdminDashboard from './pages/AdminDashboard';
import ConfigTotem from './pages/ConfigTotem';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
        <ProtectedRoute />
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>

            {/* ══════════════════════════════════════════════════
                RUTAS PÚBLICAS
            ══════════════════════════════════════════════════ */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/cliente" element={<PortalCliente />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/gestion" element={<Navigate to="/admin/login" replace />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />

            {/* ══════════════════════════════════════════════════
                RUTAS PROTEGIDAS — Solo personal autenticado
            ══════════════════════════════════════════════════ */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/caja" element={<Caja />} />
              <Route path="/cocina" element={<CocinaKDS />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/inventario" element={<Inventario />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/admin/ia" element={<AdminIA />} />
              <Route path="/admin/totem" element={<ConfigTotem />} />
            </Route>

            {/* Catch-all: Redirige cualquier ruta desconocida a login */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
