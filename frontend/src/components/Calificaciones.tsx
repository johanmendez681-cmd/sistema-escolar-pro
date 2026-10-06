import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Plus, Loader2, CheckCircle2, AlertCircle, GraduationCap, Printer, FileText } from 'lucide-react';

export default function Calificaciones() {
  const [alumnosConNotas, setAlumnosConNotas] = useState([]);
  const [alumnosRaw, setAlumnosRaw] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para modales
  const [modalAsignar, setModalAsignar] = useState(false);
  const [boletaActiva, setBoletaActiva] = useState<any>(null); // Guardará los datos del alumno a imprimir

  // Estados del Formulario de Notas
  const [alumnoId, setAlumnoId] = useState('');
  const [materia, setMateria] = useState('Matemáticas');
  const [periodo, setPeriodo] = useState('Periodo 1');
  const [nota, setNota] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const cargarDatos = async () => {
    try {
      const [resNotas, resUsuarios] = await Promise.all([
        fetch('http://localhost:3000/api/calificaciones'),
        fetch('http://localhost:3000/api/usuarios')
      ]);
      
      const dataNotas = await resNotas.json();
      const dataUsuarios = await resUsuarios.json();

      const soloAlumnos = dataUsuarios.filter((u: any) => u.rol === 'alumno');
      setAlumnosRaw(soloAlumnos);
      if (soloAlumnos.length > 0) setAlumnoId(soloAlumnos[0].id.toString());

      // MAGIA DE AGRUPACIÓN Y CUM: Juntamos las notas por cada alumno
      const alumnosProcesados = soloAlumnos.map((alumno: any) => {
        const susNotas = dataNotas.filter((n: any) => n.alumno_correo === alumno.correo);
        
        let cum = 0;
        if (susNotas.length > 0) {
          const suma = susNotas.reduce((acc: number, curr: any) => acc + parseFloat(curr.nota), 0);
          cum = suma / susNotas.length;
        }

        return {
          ...alumno,
          notas: susNotas,
          cum: cum > 0 ? cum.toFixed(1) : 'N/A',
          totalEvaluaciones: susNotas.length
        };
      });

      setAlumnosConNotas(alumnosProcesados);
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const registrarNota = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('http://localhost:3000/api/calificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          alumno_id: parseInt(alumnoId), 
          materia, 
          periodo, 
          nota: parseFloat(nota) 
        }),
      });
      const data = await response.json();

      if (data.exito) {
        setMensaje({ texto: data.mensaje, tipo: 'exito' });
        cargarDatos(); 
        setTimeout(() => {
          setModalAsignar(false);
          setNota('');
          setMensaje({ texto: '', tipo: '' });
        }, 1000);
      } else {
        setMensaje({ texto: data.mensaje, tipo: 'error' });
      }
    } catch (error) {
      setMensaje({ texto: 'Falla de conexión con el servidor.', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="print:m-0 print:p-0">
      
      {/* Cabecera - Se oculta al imprimir (print:hidden) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Registro Académico</h1>
          <p className="text-gray-500 mt-1">Gestión de calificaciones y CUM por estudiante</p>
        </div>
        <button 
          onClick={() => setModalAsignar(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-600/30"
        >
          <Plus size={20} />
          Asignar Nota
        </button>
      </div>

      {/* Tabla de Alumnos con su CUM - Se oculta al imprimir */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Estudiante</th>
                <th className="p-4 font-semibold text-center">Evaluaciones Totales</th>
                <th className="p-4 font-semibold text-center">CUM (Promedio)</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2 text-emerald-600" size={28} />Calculando CUMs...</td></tr>
              ) : alumnosConNotas.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay alumnos registrados.</td></tr>
              ) : (
                alumnosConNotas.map((alumno: any) => (
                  <tr key={alumno.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-500"><GraduationCap size={18} /></div>
                      {alumno.correo}
                    </td>
                    <td className="p-4 text-center text-gray-600 font-medium">
                      {alumno.totalEvaluaciones} materias
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-4 py-1.5 rounded-xl font-bold text-sm shadow-sm ${
                        alumno.cum === 'N/A' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                        parseFloat(alumno.cum) >= 6.0 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {alumno.cum}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setBoletaActiva(alumno)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 mx-auto border border-blue-100"
                      >
                        <FileText size={16} /> Ver Boleta
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: ASIGNAR NOTA (Igual que antes) --- */}
      <AnimatePresence>
        {modalAsignar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm print:hidden">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-emerald-50/50">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><BookOpen className="text-emerald-600" size={24}/> Registrar Nota</h3>
                <button onClick={() => setModalAsignar(false)} className="text-gray-400 hover:text-gray-700 hover:bg-white p-2 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={registrarNota} className="p-6 space-y-4">
                {alumnosRaw.length === 0 ? (
                  <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm font-medium border border-orange-100 flex gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" /> Necesitas registrar alumnos primero.
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Alumno</label>
                      <select value={alumnoId} onChange={(e)=>setAlumnoId(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-gray-700">
                        {alumnosRaw.map((a: any) => (<option key={a.id} value={a.id}>{a.correo}</option>))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                        <select value={materia} onChange={(e)=>setMateria(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm">
                          <option>Matemáticas</option><option>Ciencias</option><option>Lenguaje</option><option>Inglés</option><option>Informática</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Periodo</label>
                        <select value={periodo} onChange={(e)=>setPeriodo(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-sm">
                          <option>Periodo 1</option><option>Periodo 2</option><option>Periodo 3</option><option>Periodo 4</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Calificación (0 - 10)</label>
                      <input type="number" step="0.1" min="0" max="10" required value={nota} onChange={(e)=>setNota(e.target.value)} className="w-full px-4 py-3 text-2xl font-bold text-center bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="0.0" />
                    </div>
                    {mensaje.texto && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {mensaje.tipo === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />} {mensaje.texto}
                      </motion.div>
                    )}
                    <div className="pt-2">
                      <button type="submit" disabled={guardando} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2">
                        {guardando ? <Loader2 size={20} className="animate-spin" /> : 'Guardar Calificación'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: LA BOLETA DE NOTAS IMPRIMIBLE --- */}
      <AnimatePresence>
        {boletaActiva && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm print:bg-white print:p-0 print:absolute print:inset-0 print:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden print:shadow-none print:rounded-none"
            >
              {/* Encabezado Institucional de la Boleta */}
              <div className="p-8 border-b border-gray-200 text-center relative">
                <button onClick={() => setBoletaActiva(null)} className="absolute right-4 top-4 text-gray-400 hover:bg-gray-100 p-2 rounded-full print:hidden"><X size={24} /></button>
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white print:border-2 print:border-black print:bg-white print:text-black">
                  <GraduationCap size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sistema Escolar Pro</h2>
                <h3 className="text-lg font-medium text-gray-500 uppercase tracking-widest mt-1">Boleta Oficial de Calificaciones</h3>
              </div>

              <div className="p-8">
                {/* Datos del Alumno */}
                <div className="flex justify-between items-end mb-6 bg-gray-50 p-4 rounded-xl print:bg-transparent print:p-0 print:mb-8">
                  <div>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Estudiante Evaluado</p>
                    <p className="text-xl font-bold text-gray-800 mt-1">{boletaActiva.correo}</p>
                    <p className="text-sm text-gray-500 mt-1">ID Institucional: #{boletaActiva.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">C.U.M. Actual</p>
                    <p className={`text-4xl font-black mt-1 ${boletaActiva.cum >= 6.0 ? 'text-emerald-600' : 'text-red-600'} print:text-black`}>
                      {boletaActiva.cum}
                    </p>
                  </div>
                </div>

                {/* Tabla de Detalle */}
                <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 print:bg-gray-200">
                      <tr>
                        <th className="p-3 font-semibold text-gray-700">Materia</th>
                        <th className="p-3 font-semibold text-gray-700">Periodo</th>
                        <th className="p-3 font-semibold text-center text-gray-700">Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boletaActiva.notas.length === 0 ? (
                        <tr><td colSpan={3} className="p-6 text-center text-gray-500">No hay evaluaciones en el sistema.</td></tr>
                      ) : (
                        boletaActiva.notas.map((n: any) => (
                          <tr key={n.id} className="border-t border-gray-200">
                            <td className="p-3 font-medium text-gray-800">{n.materia}</td>
                            <td className="p-3 text-gray-600">{n.periodo}</td>
                            <td className="p-3 text-center font-bold">{parseFloat(n.nota).toFixed(1)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Botón de Imprimir - Se oculta en el papel */}
                <div className="flex justify-center print:hidden">
                  <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/30"
                  >
                    <Printer size={20} />
                    Imprimir Boleta Oficial
                  </button>
                </div>
                
                {/* Firmas - Solo visibles al imprimir o en la boleta final */}
                <div className="hidden print:flex justify-between mt-20 px-10">
                  <div className="text-center">
                    <div className="w-48 border-t-2 border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Firma del Director</p>
                  </div>
                  <div className="text-center">
                    <div className="w-48 border-t-2 border-black mb-2"></div>
                    <p className="font-bold text-sm uppercase">Sello Institucional</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}