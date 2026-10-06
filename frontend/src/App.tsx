import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import type { JSX } from 'react/jsx-runtime';

// 🛡️ EL GUARDIÁN DE RUTAS
// Este componente envuelve las rutas secretas. Revisa si tienes llave.
const RutaProtegida = ({ children }: { children: JSX.Element }) => {
  const tieneLlave = localStorage.getItem('usuarioActivo');
  
  if (!tieneLlave) {
    // Si no hay llave, te regresa al login inmediatamente
    return <Navigate to="/" replace />;
  }
  
  // Si tienes llave, te deja pasar al componente que pediste
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Envolvemos el Dashboard con el Guardián */}
        <Route 
          path="/dashboard" 
          element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}