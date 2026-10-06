import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, BookOpen, Shield, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [rolActivo, setRolActivo] = useState('alumno');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  // Inicializamos el navegador de React Router
  const navigate = useNavigate();

  const roles = [
    { id: 'alumno', nombre: 'Alumno', icono: GraduationCap },
    { id: 'docente', nombre: 'Docente', icono: BookOpen },
    { id: 'director', nombre: 'Director', icono: Shield },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          correo: correo, 
          password: password, 
          rol_esperado: rolActivo 
        }),
      });

      const data = await response.json();

     if (data.exito) {
        setMensaje({ texto: data.mensaje, tipo: 'exito' });
        
        // --- NUEVA LÍNEA: Guardamos la "llave" en la memoria del navegador ---
        localStorage.setItem('usuarioActivo', data.rol);
        
        // MAGIA DE REDIRECCIÓN
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMensaje({ texto: data.mensaje, tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: 'Falla de conexión con el servidor maestro.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Panel Izquierdo - Formulario */}
        <div className="w-full md:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido de nuevo</h1>
            <p className="text-gray-500 mb-8">Selecciona tu perfil para ingresar al sistema.</p>
          </motion.div>

          {/* Selector de Roles Animado */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 relative">
            {roles.map((rol) => {
              const Icono = rol.icono;
              const activo = rolActivo === rol.id;
              
              return (
                <button
                  key={rol.id}
                  type="button"
                  onClick={() => {
                    setRolActivo(rol.id);
                    setMensaje({ texto: '', tipo: '' });
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-colors relative z-10 ${
                    activo ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {activo && (
                    <motion.div
                      layoutId="fondoRol"
                      className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icono size={18} />
                  <span className="hidden sm:block">{rol.nombre}</span>
                </button>
              );
            })}
          </div>

          {/* Formulario Conectado */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="ejemplo@institucion.edu.sv"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Mensaje de Respuesta (Error o Éxito) */}
            {mensaje.texto && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                  mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                }`}
              >
                {mensaje.tipo === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                {mensaje.texto}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={cargando}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 px-4 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-600/30"
            >
              {cargando ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Panel Derecho - Intacto */}
        <div className="hidden md:flex w-1/2 bg-blue-600 relative p-12 overflow-hidden items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[20%] w-[140%] h-[140%] rounded-full border-[80px] border-blue-500/30"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-64 h-64 bg-blue-500/40 rounded-full blur-3xl"
          />

          <div className="relative z-10 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.4 }}
              className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/20"
            >
              <GraduationCap size={48} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Sistema Escolar Pro</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Gestión académica, control de deméritos y administración institucional de primer nivel.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}