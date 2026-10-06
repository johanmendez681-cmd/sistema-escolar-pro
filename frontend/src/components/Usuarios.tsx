import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Mail, Lock, Shield, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Estados del formulario
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('alumno');
  const [cargandoGuardar, setCargandoGuardar] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
      setCargandoLista(false);
    } catch (error) {
      console.error("Falla al cargar la lista:", error);
      setCargandoLista(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargandoGuardar(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password, rol }),
      });
      const data = await response.json();

      if (data.exito) {
        setMensaje({ texto: data.mensaje, tipo: 'exito' });
        obtenerUsuarios(); 
        setTimeout(() => {
          setModalAbierto(false);
          setCorreo('');
          setPassword('');
          setMensaje({ texto: '', tipo: '' });
        }, 1000);
      } else {
        setMensaje({ texto: data.mensaje, tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: 'Error de conexión con el servidor maestro.', tipo: 'error' });
    } finally {
      setCargandoGuardar(false);
    }
  };

  // NUEVA FUNCIÓN: Eliminar Usuario
  const eliminarUsuario = async (id: number, correo: string) => {
    // Pedimos confirmación para evitar accidentes
    const confirmar = window.confirm(`¿Estás seguro de que deseas expulsar a ${correo}? Se borrarán todas sus calificaciones y deméritos para siempre.`);
    
    if (confirmar) {
      try {
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.exito) {
          obtenerUsuarios(); // Recargamos la tabla para que desaparezca
        } else {
          alert("Hubo un error al eliminar el usuario");
        }
      } catch (error) {
        alert("Falla de conexión al intentar eliminar");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra los accesos al sistema institucional</p>
        </div>
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold whitespace-nowrap">ID</th>
                <th className="p-4 font-semibold whitespace-nowrap">Correo Electrónico</th>
                <th className="p-4 font-semibold whitespace-nowrap">Rol Asignado</th>
                <th className="p-4 font-semibold whitespace-nowrap">Fecha de Creación</th>
                <th className="p-4 font-semibold whitespace-nowrap text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargandoLista ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={28} />Cargando base de datos...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay usuarios registrados en el sistema.</td></tr>
              ) : (
                usuarios.map((user: any) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">#{user.id}</td>
                    <td className="p-4 text-gray-900 font-medium">{user.correo}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.rol === 'director' ? 'bg-purple-100 text-purple-700' : 
                        user.rol === 'docente' ? 'bg-blue-100 text-blue-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(user.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => eliminarUsuario(user.id, user.correo)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Flotante de Registro (Permanece igual) */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-800">Registrar Usuario</h3>
                <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-700 transition-colors hover:bg-gray-200 p-2 rounded-full"><X size={20} /></button>
              </div>
              
              <form onSubmit={registrarUsuario} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="email" required value={correo} onChange={(e)=>setCorreo(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="correo@institucion.edu.sv" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Provisoria</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="••••••••" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol en el Sistema</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select value={rol} onChange={(e)=>setRol(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none appearance-none font-medium text-gray-700">
                      <option value="alumno">Alumno</option>
                      <option value="docente">Docente</option>
                      <option value="director">Director</option>
                    </select>
                  </div>
                </div>

                {mensaje.texto && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {mensaje.tipo === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                    {mensaje.texto}
                  </motion.div>
                )}

                <div className="pt-2">
                  <button type="submit" disabled={cargandoGuardar} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2">
                    {cargandoGuardar ? <Loader2 size={20} className="animate-spin" /> : 'Guardar Usuario'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}