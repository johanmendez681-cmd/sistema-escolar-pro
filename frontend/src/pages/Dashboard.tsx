import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, BookOpen, AlertTriangle, Megaphone, LogOut, Menu, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Usuarios from '../components/Usuarios';
import Calificaciones from '../components/Calificaciones';



export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  
  // ESTADO CLAVE: Nos dice en qué parte del menú estamos
  const [vistaActiva, setVistaActiva] = useState('Inicio');

  const [cargando, setCargando] = useState(true);
  const [stats, setStats] = useState({
    usuarios: 0, promedio: '0.0', demeritos: 0, avisos: 0
  });

  // Solo recarga las estadísticas si estamos viendo la pantalla de "Inicio"
  useEffect(() => {
    if (vistaActiva === 'Inicio') {
      setCargando(true);
      const obtenerEstadisticas = async () => {
        try {
          const respuesta = await fetch('http://localhost:3000/api/dashboard/stats');
          const data = await respuesta.json();
          setTimeout(() => {
            setStats({
              usuarios: data.totalUsuarios,
              promedio: data.promedioInstitucional,
              demeritos: data.demeritosActivos,
              avisos: data.avisosActivos
            });
            setCargando(false);
          }, 300);
        } catch (error) {
          console.error(error);
          setCargando(false);
        }
      };
      obtenerEstadisticas();
    }
  }, [vistaActiva]); // Se dispara cada vez que cambias al menú Inicio

  const menuItems = [
    { nombre: 'Inicio', icono: LayoutDashboard },
    { nombre: 'Usuarios', icono: Users },
    { nombre: 'Calificaciones', icono: BookOpen },
    { nombre: 'Deméritos', icono: AlertTriangle },
    { nombre: 'Cartelera', icono: Megaphone },
  ];

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Menú Lateral */}
      <motion.div animate={{ width: sidebarAbierto ? 256 : 80 }} className="bg-blue-900 text-white flex flex-col transition-all duration-300 shadow-2xl z-20 relative">
        <div className="p-4 flex items-center justify-between border-b border-blue-800">
          {sidebarAbierto && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-bold text-xl whitespace-nowrap">Escolar Pro</motion.span>}
          <button onClick={() => setSidebarAbierto(!sidebarAbierto)} className="p-2 hover:bg-blue-800 rounded-xl transition-colors mx-auto">
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item, index) => {
            const Icono = item.icono;
            const activo = vistaActiva === item.nombre; // Verifica si este botón es el seleccionado
            
            return (
              <button 
                key={index} 
                onClick={() => setVistaActiva(item.nombre)} // Cambia la pantalla al hacer clic
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  activo ? 'bg-blue-600 shadow-md' : 'hover:bg-blue-800/50 text-blue-100 hover:text-white'
                }`}
              >
                <Icono size={22} className="min-w-[22px]" />
                {sidebarAbierto && <span className="whitespace-nowrap font-medium text-sm">{item.nombre}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button onClick={cerrarSesion} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/90 hover:text-white text-blue-200 transition-colors group">
            <LogOut size={22} className="min-w-[22px] group-hover:scale-110 transition-transform" />
            {sidebarAbierto && <span className="font-medium text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.div>

      {/* Área de Trabajo Principal - Renderizado Condicional */}
      <div className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
        
        {/* VISTA 1: INICIO (Estadísticas) */}
        {vistaActiva === 'Inicio' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
              <p className="text-gray-500 mt-1">Resumen general del Sistema Institucional</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-600"><Users size={28} /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Usuarios</p>
                  {cargando ? <Loader2 size={24} className="animate-spin text-blue-600 mt-1" /> : <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gray-900">{stats.usuarios}</motion.p>}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600"><BookOpen size={28} /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Promedio General</p>
                  {cargando ? <Loader2 size={24} className="animate-spin text-emerald-600 mt-1" /> : <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gray-900">{stats.promedio}</motion.p>}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="bg-rose-50 p-4 rounded-xl text-rose-600"><AlertTriangle size={28} /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Deméritos Activos</p>
                  {cargando ? <Loader2 size={24} className="animate-spin text-rose-600 mt-1" /> : <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gray-900">{stats.demeritos}</motion.p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="bg-purple-50 p-4 rounded-xl text-purple-600"><Megaphone size={28} /></div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Avisos Activos</p>
                  {cargando ? <Loader2 size={24} className="animate-spin text-purple-600 mt-1" /> : <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-bold text-gray-900">{stats.avisos}</motion.p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VISTA 2: USUARIOS */}
        {vistaActiva === 'Usuarios' && <Usuarios />}
        
        {/* VISTA 3: CALIFICACIONES */}
        {vistaActiva === 'Calificaciones' && <Calificaciones />}
        
        {/* Pestañas en Construcción restantes */}
        {(vistaActiva === 'Deméritos' || vistaActiva === 'Cartelera') && (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <LayoutDashboard size={48} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-gray-300">Módulo en Construcción</h2>
            <p className="mt-2 text-gray-400">Esta sección se implementará en la próxima fase.</p>
          </div>
        )}

      </div>
    </div>
  );
}