import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Printer, Plus, X, GraduationCap, FileText, AlertTriangle, CheckCircle2, History, Sparkles } from 'lucide-react';

export default function App() {
  const [pestaña, setPestaña] = useState<'actas' | 'demeritos'>('actas');

  const [nombre, setNombre] = useState('');
  const [grado, setGrado] = useState('');
  const [seccion, setSeccion] = useState('');
  const [motivo, setMotivo] = useState('');
  const [cantidad, setCantidad] = useState('1');

  const [actas, setActas] = useState<any[]>([]);
  const [demeritos, setDemeritos] = useState<any[]>([]);
  const [docImprimir, setDocImprimir] = useState<any>(null);
  const [mensaje, setMensaje] = useState(false);

  const cargarDatos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/registros');
      if (res.ok) {
        const data = await res.json();
        setActas(data.filter((d: any) => d.tipo === 'actas'));
        setDemeritos(data.filter((d: any) => d.tipo === 'demeritos'));
      }
    } catch (error) {
      console.error('Error conectando con la base de datos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoRegistro = {
      tipo: pestaña,
      fecha: new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' }),
      nombre, grado, seccion, motivo, cantidad
    };

    try {
      await fetch('http://localhost:3000/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoRegistro)
      });
      cargarDatos();
      setNombre(''); setGrado(''); setSeccion(''); setMotivo(''); setCantidad('1');
      setMensaje(true); setTimeout(() => setMensaje(false), 3000);
    } catch (error) {
      console.error('Error guardando registro:', error);
    }
  };

  const eliminarRegistro = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/registros/${id}`, { method: 'DELETE' });
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans relative overflow-hidden text-slate-800">
      
      {/* MAGIA CSS: MÁRGENES CERO EN IMPRESIÓN Y FORZAR COLORES EXACTOS */}
      <style>
        {`
          @media print {
            @page { margin: 0; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      {/* MOTOR GRÁFICO */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -60, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-400/20 blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[10%] left-[20%] w-[550px] h-[550px] rounded-full bg-rose-400/15 blur-[130px]" />
      </div>

      <header className="relative z-10 p-6 print:hidden">
        <div className="max-w-7xl mx-auto bg-white/40 backdrop-blur-2xl border border-white/60 shadow-lg shadow-slate-200/50 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 pl-2">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="w-14 h-14 rounded-2xl shadow-lg bg-white flex items-center justify-center p-2 border border-slate-100">
              <img src="/logo.png" alt="Logo Institución" className="w-full h-full object-contain" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">C.E. Jutta Steiner</h1>
              <p className="text-slate-500 text-sm font-semibold flex items-center gap-1">Sistema Disciplinario Oficial <Sparkles size={14} className="text-amber-400" /></p>
            </div>
          </div>
          
          <div className="flex bg-slate-900/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-inner relative">
            <button onClick={() => setPestaña('actas')} className="relative px-8 py-3 rounded-xl font-bold text-sm transition-colors z-10 flex items-center gap-2">
              {pestaña === 'actas' && <motion.div layoutId="pestañaActiva" className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-100 z-[-1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <FileText size={18} className={pestaña === 'actas' ? 'text-blue-600' : 'text-slate-400'} />
              <span className={pestaña === 'actas' ? 'text-slate-900' : 'text-slate-500'}>Actas</span>
            </button>
            <button onClick={() => setPestaña('demeritos')} className="relative px-8 py-3 rounded-xl font-bold text-sm transition-colors z-10 flex items-center gap-2">
              {pestaña === 'demeritos' && <motion.div layoutId="pestañaActiva" className="absolute inset-0 bg-white rounded-xl shadow-md border border-slate-100 z-[-1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <AlertTriangle size={18} className={pestaña === 'demeritos' ? 'text-rose-600' : 'text-slate-400'} />
              <span className={pestaña === 'demeritos' ? 'text-slate-900' : 'text-slate-500'}>Deméritos</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 print:hidden">
        
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div key={pestaña} initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} transition={{ duration: 0.3 }} className="bg-white/60 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white h-full">
              
              <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${pestaña === 'actas' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                  <Plus size={24} />
                </div>
                Generar {pestaña === 'actas' ? 'Acta' : 'Demérito'}
              </h2>
              
              <form onSubmit={guardarRegistro} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                  <div className="relative group">
                    <GraduationCap className={`absolute left-4 top-4 transition-colors ${pestaña === 'actas' ? 'group-focus-within:text-blue-500' : 'group-focus-within:text-rose-500'} text-slate-400`} size={20} />
                    <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Carlos Roberto Méndez" className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-20 outline-none transition-all font-medium focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Grado</label>
                    <input type="text" required value={grado} onChange={(e) => setGrado(e.target.value)} placeholder="1er Año" className="w-full px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-20 outline-none transition-all font-medium focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sección</label>
                    <input type="text" required value={seccion} onChange={(e) => setSeccion(e.target.value)} placeholder="A" className="w-full px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-20 outline-none transition-all font-black uppercase focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Motivo de la Infracción</label>
                  <textarea required value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Describe el hecho ocurrido..." rows={3} className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-20 outline-none transition-all font-medium resize-none focus:ring-blue-500"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cantidad Aplicada</label>
                  <input type="number" min="1" required value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={`w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-opacity-20 outline-none transition-all font-black text-xl ${pestaña === 'actas' ? 'focus:ring-blue-500 text-blue-600' : 'focus:ring-rose-500 text-rose-600'}`} />
                </div>

                <motion.button whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }} type="submit" className={`w-full py-4 rounded-2xl font-black tracking-wide transition-all flex justify-center items-center gap-2 shadow-xl mt-6 border ${pestaña === 'actas' ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/30 border-blue-400' : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-500/30 border-rose-400'}`}>
                  PROCESAR DOCUMENTO <FileText size={20} />
                </motion.button>

                <AnimatePresence>
                  {mensaje && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-4 bg-emerald-500/10 backdrop-blur-md text-emerald-700 rounded-2xl flex items-center gap-3 text-sm font-bold border border-emerald-500/20">
                      <CheckCircle2 size={20} className="text-emerald-500" /> Registro guardado en MySQL.
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white/60 backdrop-blur-3xl p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-white h-full max-h-[85vh] flex flex-col">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-500"><History size={24} /></div>
              Base de Datos: {pestaña === 'actas' ? 'Actas Emitidas' : 'Deméritos'}
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4 pb-10">
              {((pestaña === 'actas' ? actas : demeritos).length === 0) ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-slate-300">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-slate-400" /></div>
                  <p className="text-slate-500 font-bold text-lg">No hay registros almacenados.</p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {(pestaña === 'actas' ? actas : demeritos).map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.9, x: 50 }} 
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all duration-300"
                    >
                      <div>
                        <h3 className="font-black text-slate-800 text-xl tracking-tight">{item.nombre}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">Grado: {item.grado} "{item.seccion}"</span>
                          <span className="text-slate-400 text-xs font-semibold">{item.fecha}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <span className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-inner ${pestaña === 'actas' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          {item.cantidad} {pestaña === 'actas' ? (item.cantidad === '1' ? 'Acta' : 'Actas') : 'PTS'}
                        </span>
                        
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDocImprimir(item)} className="flex-1 md:flex-none bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-slate-900/20">
                          <Printer size={16} /> Imprimir
                        </motion.button>
                        
                        <motion.button whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => eliminarRegistro(item.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                          <X size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {docImprimir && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md print:bg-white print:p-0 print:block">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className={`bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none border-t-[16px] print:border-none relative ${docImprimir.tipo === 'actas' ? 'border-blue-600' : 'border-rose-600'}`}>
              
              <div className="absolute top-4 right-4 flex gap-2 print:hidden z-10">
                <button onClick={() => window.print()} className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-slate-900/20 transition-transform active:scale-95">
                  <Printer size={18} /> Imprimir Formato
                </button>
                <button onClick={() => setDocImprimir(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-3 rounded-xl font-bold transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Se ajustó el padding interior (print:p-10) para que no rebase la página */}
              <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar print:overflow-visible print:p-10">
                
                <div className="text-center mb-8 border-b-2 border-slate-200 print:border-black pb-8">
                  <img src="/logo.png" alt="Logo C.E. Jutta Steiner" className="w-28 h-32 mx-auto mb-4 object-contain" />
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">C.E. "Jutta Steiner de Toruño"</h2>
                  <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mt-1 print:text-black">Dirección y Control Disciplinario</h3>
                  <p className="text-slate-400 mt-2 font-black uppercase text-sm tracking-wider print:text-black">
                    {docImprimir.tipo === 'actas' ? 'ACTA DISCIPLINARIA OFICIAL' : 'BOLETA DE SANCIÓN (DEMÉRITOS)'} • FOLIO NO. {docImprimir.id.toString().slice(-6)}
                  </p>
                </div>

                <div className="space-y-6">
                  <p className="text-md text-slate-700 print:text-black leading-relaxed text-justify font-medium">
                    En la dirección de este centro educativo, con fecha <strong className="text-slate-900 print:text-black">{docImprimir.fecha}</strong>, se emite el presente documento para dejar constancia de la falta incurrida por el alumno descrito a continuación:
                  </p>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 print:bg-transparent print:border-2 print:border-black">
                    <div className="grid grid-cols-2 gap-y-6">
                      <div className="col-span-2">
                        <p className="text-xs font-black text-slate-400 print:text-slate-600 uppercase tracking-widest mb-1">Nombre Completo del Estudiante</p>
                        <p className="text-2xl font-black text-slate-900 print:text-black uppercase tracking-tight">{docImprimir.nombre}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 print:text-slate-600 uppercase tracking-widest mb-1">Grado</p>
                        <p className="text-xl font-bold text-slate-800 print:text-black uppercase">{docImprimir.grado}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 print:text-slate-600 uppercase tracking-widest mb-1">Sección</p>
                        <p className="text-xl font-bold text-slate-800 print:text-black uppercase">"{docImprimir.seccion}"</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-800 print:text-black uppercase tracking-widest mb-3">Motivo / Descripción de los hechos:</p>
                    <p className="text-md text-slate-700 print:text-black bg-white p-5 rounded-2xl border border-slate-200 print:border-none print:p-0 italic leading-relaxed text-justify font-medium">
                      "{docImprimir.motivo}"
                    </p>
                  </div>

                  <div className={`p-6 rounded-3xl border print:bg-transparent print:border-2 print:border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 ${docImprimir.tipo === 'actas' ? 'bg-blue-50/50 border-blue-100' : 'bg-rose-50/50 border-rose-100'}`}>
                    <div>
                      <p className="font-bold text-slate-800 print:text-black text-lg tracking-tight">Sanción disciplinaria aplicada:</p>
                      <p className="text-sm text-slate-500 print:text-black mt-1 font-medium">Conforme al reglamento interno escolar.</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-3xl font-black uppercase tracking-tight print:text-black ${docImprimir.tipo === 'actas' ? 'text-blue-600' : 'text-rose-600'}`}>
                        {docImprimir.cantidad} {docImprimir.tipo === 'actas' ? (docImprimir.cantidad === '1' ? 'ACTA' : 'ACTAS') : 'DEMÉRITOS'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* FIRMAS: Forzamos el bloque negro (bg-black) para que nunca desaparezcan las líneas */}
                <div className="flex justify-between mt-12 px-2 print:mt-16">
                  <div className="text-center w-40">
                    <div className="w-full h-[2px] bg-slate-800 print:bg-black mb-2"></div>
                    <p className="font-black text-xs uppercase text-slate-800 print:text-black tracking-wider">Dirección</p>
                  </div>
                  <div className="text-center w-40">
                    <div className="w-full h-[2px] bg-slate-800 print:bg-black mb-2"></div>
                    <p className="font-black text-xs uppercase text-slate-800 print:text-black tracking-wider">Estudiante</p>
                  </div>
                  <div className="text-center w-40">
                    <div className="w-full h-[2px] bg-slate-800 print:bg-black mb-2"></div>
                    <p className="font-black text-xs uppercase text-slate-800 print:text-black tracking-wider">Madre/Padre</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}