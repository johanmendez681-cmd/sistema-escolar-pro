import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer, Plus, X, GraduationCap, FileText, AlertTriangle,
  CheckCircle2, History, LogOut, Search, Database, Award, ShieldAlert
} from 'lucide-react';
import Login from './Login';
import ModalImpresion from './ModalImpresion';

export default function App() {
  const [usuarioActivo, setUsuarioActivo] = useState<any>(null);
  const [pestaña, setPestaña] = useState<'actas' | 'demeritos'>('actas');
  const [nombre, setNombre] = useState('');
  const [grado, setGrado] = useState('');
  const [seccion, setSeccion] = useState('');
  const [motivo, setMotivo] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [busqueda, setBusqueda] = useState('');

  const [actas, setActas] = useState<any[]>([]);
  const [demeritos, setDemeritos] = useState<any[]>([]);
  const [docImprimir, setDocImprimir] = useState<any>(null);
  const [mensaje, setMensaje] = useState(false);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem('sesionEscolarPro');
    if (sesionGuardada) {
      setUsuarioActivo(JSON.parse(sesionGuardada));
    }
  }, []);

  const cargarDatos = async () => {
    try {
      const [resActas, resDemeritos] = await Promise.all([
        fetch('http://localhost:3000/api/actas'),
        fetch('http://localhost:3000/api/demeritos')
      ]);

      if (resActas.ok) {
        const dataActas = await resActas.json();
        setActas(dataActas.map((a: any) => ({ ...a, tipo: 'actas' })));
      }
      if (resDemeritos.ok) {
        const dataDem = await resDemeritos.json();
        setDemeritos(dataDem.map((d: any) => ({ ...d, tipo: 'demeritos' })));
      }
    } catch (error) {
      console.error('Error conectando con las tablas de MySQL:', error);
    }
  };

  useEffect(() => {
    if (usuarioActivo) {
      cargarDatos();
    }
  }, [usuarioActivo]);

  const cerrarSesion = () => {
    localStorage.removeItem('sesionEscolarPro');
    setUsuarioActivo(null);
  };

  const guardarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoRegistro = {
      fecha: new Date().toLocaleDateString('es-SV', { year: 'numeric', month: 'long', day: 'numeric' }),
      nombre,
      grado,
      seccion,
      motivo,
      cantidad,
      emitido_por: usuarioActivo?.nombre || 'Dirección Académica'
    };

    const endpoint = pestaña === 'actas' ? '/api/actas' : '/api/demeritos';

    try {
      await fetch(`http://localhost:3000${endpoint}`, {
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

  const eliminarRegistro = async (id: number, tipo: 'actas' | 'demeritos') => {
    const endpoint = tipo === 'actas' ? `/api/actas/${id}` : `/api/demeritos/${id}`;
    try {
      await fetch(`http://localhost:3000${endpoint}`, { method: 'DELETE' });
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (!usuarioActivo) {
    return (
      <Login
        onLoginSuccess={(usuario) => {
          setUsuarioActivo(usuario);
          localStorage.setItem('sesionEscolarPro', JSON.stringify(usuario));
        }}
      />
    );
  }

  const esActas = pestaña === 'actas';
  const listaActual = esActas ? actas : demeritos;
  const listaFiltrada = listaActual.filter((item) =>
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.grado?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.seccion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.motivo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPuntosActivos = listaActual.reduce((acc, item) => acc + (parseInt(item.cantidad) || 0), 0);

  return (
    <div className="min-h-screen bg-[#060913] flex flex-col font-sans relative overflow-hidden text-white">
      
      {/* MAGIA CSS: IMPRESIÓN EN PAPEL BLANCO PURO */}
      <style>
        {`
          @media print {
            @page { margin: 0; }
            body { background: #ffffff !important; color: #000000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}
      </style>

      {/* AURORA BOREAL REACTIVA SEGÚN LA PESTAÑA ACTIVA + MALLA CIBERNÉTICA */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden print:hidden">
        <motion.div
          animate={{ scale: [1, 1.25, 1], x: [0, 70, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -top-[15%] -left-[10%] w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 ${
            esActas ? 'bg-blue-600/25' : 'bg-rose-600/25'
          }`}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -60, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[20%] -right-[10%] w-[650px] h-[650px] rounded-full blur-[160px] transition-colors duration-1000 ${
            esActas ? 'bg-indigo-600/20' : 'bg-orange-600/20'
          }`}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute -bottom-[15%] left-[25%] w-[550px] h-[550px] rounded-full blur-[140px] transition-colors duration-1000 ${
            esActas ? 'bg-cyan-500/15' : 'bg-pink-600/15'
          }`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* CABECERA SUPERIOR HOLOGRÁFICA */}
      <header className="relative z-10 px-6 pt-6 pb-2 print:hidden">
        <div className="max-w-7xl mx-auto bg-white/[0.04] backdrop-blur-3xl border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.5)] rounded-[2rem] p-4 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Identidad Institucional */}
          <div className="flex items-center gap-4 pl-2">
            <motion.div whileHover={{ rotate: 8, scale: 1.06 }} className="w-14 h-14 rounded-2xl shadow-lg bg-white flex items-center justify-center p-2 border-2 border-white/40">
              <img src="/logo.png" alt="Logo Institución" className="w-full h-full object-contain" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">C.E. "Jutta Steiner de Toruño"</h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> MySQL Activo
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mt-0.5">
                <Database size={13} className="text-cyan-400" />
                <span>Arquitectura Multi-Tabla: <code className="text-slate-300">usuarios</code> • <code className="text-blue-400">actas</code> • <code className="text-rose-400">demeritos</code></span>
              </p>
            </div>
          </div>

          {/* Selector de Tablas con Píldora Elástica (Actas vs Deméritos) */}
          <div className="flex bg-slate-950/70 p-1.5 rounded-2xl border border-white/10 relative">
            <button
              onClick={() => setPestaña('actas')}
              className="relative px-7 py-3 rounded-xl font-bold text-sm transition-colors z-10 flex items-center gap-2.5"
            >
              {esActas && (
                <motion.div
                  layoutId="pestañaActiva"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/40 border border-blue-400/40 z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <FileText size={18} className={esActas ? 'text-white' : 'text-slate-400'} />
              <span className={esActas ? 'text-white' : 'text-slate-400 hover:text-white'}>Módulo de Actas</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-black ${esActas ? 'bg-black/25 text-blue-100' : 'bg-white/5 text-slate-400'}`}>
                {actas.length}
              </span>
            </button>

            <button
              onClick={() => setPestaña('demeritos')}
              className="relative px-7 py-3 rounded-xl font-bold text-sm transition-colors z-10 flex items-center gap-2.5"
            >
              {!esActas && (
                <motion.div
                  layoutId="pestañaActiva"
                  className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl shadow-lg shadow-rose-600/40 border border-rose-400/40 z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <AlertTriangle size={18} className={!esActas ? 'text-white' : 'text-slate-400'} />
              <span className={!esActas ? 'text-white' : 'text-slate-400 hover:text-white'}>Módulo de Deméritos</span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-black ${!esActas ? 'bg-black/25 text-rose-100' : 'bg-white/5 text-slate-400'}`}>
                {demeritos.length}
              </span>
            </button>
          </div>

          {/* Mini-Perfil del Usuario Logueado */}
          <div className="flex items-center gap-3 bg-white/[0.05] px-4 py-2.5 rounded-2xl border border-white/10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg ${
              esActas ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-blue-500/20' : 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-rose-500/20'
            }`}>
              {usuarioActivo.nombre ? usuarioActivo.nombre.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="pr-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{usuarioActivo.rol || 'Director'}</p>
              <p className="text-sm font-bold text-white leading-tight">{usuarioActivo.nombre || usuarioActivo.correo}</p>
            </div>
            <button
              onClick={cerrarSesion}
              title="Cerrar Sesión"
              className="p-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>

        </div>
      </header>

      {/* BARRA DE MÉTRICAS EN VIVO (KPI CARDS) */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-6 pt-4 pb-2 grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <motion.div whileHover={{ y: -3 }} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tabla MySQL: <code className="text-blue-400">actas</code></p>
            <p className="text-2xl font-black text-white mt-1">{actas.length} <span className="text-xs font-semibold text-slate-400">expedientes</span></p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/20">
            <FileText size={24} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Tabla MySQL: <code className="text-rose-400">demeritos</code></p>
            <p className="text-2xl font-black text-white mt-1">{demeritos.length} <span className="text-xs font-semibold text-slate-400">boletas</span></p>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/20">
            <ShieldAlert size={24} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Total Sanciones ({esActas ? 'Actas' : 'Puntos'})</p>
            <p className={`text-2xl font-black mt-1 ${esActas ? 'text-cyan-400' : 'text-rose-400'}`}>
              {totalPuntosActivos} <span className="text-xs font-semibold text-slate-400">acumulados</span>
            </p>
          </div>
          <div className={`p-3.5 rounded-2xl border ${esActas ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' : 'bg-amber-500/15 text-amber-400 border-amber-500/20'}`}>
            <Award size={24} />
          </div>
        </motion.div>
      </section>

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 print:hidden">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO HOLOGRÁFICO CON BARRA DE NEÓN */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={pestaña}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              transition={{ duration: 0.3 }}
              className={`bg-white/[0.04] backdrop-blur-3xl p-8 rounded-[2.2rem] border shadow-2xl h-full relative overflow-hidden ${
                esActas
                  ? 'border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.12)]'
                  : 'border-rose-500/30 shadow-[0_0_60px_rgba(225,29,72,0.12)]'
              }`}
            >
              {/* Barra luminosa superior */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                esActas ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500' : 'bg-gradient-to-r from-rose-500 via-amber-400 to-pink-500'
              }`} />

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl border ${
                    esActas ? 'bg-blue-500/20 border-blue-400/30 text-blue-400' : 'bg-rose-500/20 border-rose-400/30 text-rose-400'
                  }`}>
                    <Plus size={22} />
                  </div>
                  <span>Emitir {esActas ? 'Acta Oficial' : 'Boleta Demérito'}</span>
                </h2>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  INSERT INTO {esActas ? 'actas' : 'demeritos'}
                </span>
              </div>

              <form onSubmit={guardarRegistro} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Nombre Completo del Alumno (Nombres y 2 Apellidos)
                  </label>
                  <div className="relative">
                    <GraduationCap className={`absolute left-4 top-4 ${esActas ? 'text-blue-400' : 'text-rose-400'}`} size={20} />
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Carlos Roberto Méndez Saravia"
                      className="w-full pl-12 pr-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/[0.09] focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Grado</label>
                    <input
                      type="text"
                      required
                      value={grado}
                      onChange={(e) => setGrado(e.target.value)}
                      placeholder="Ej. 3er Año"
                      className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/[0.09] focus:border-blue-400 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Sección</label>
                    <input
                      type="text"
                      required
                      value={seccion}
                      onChange={(e) => setSeccion(e.target.value)}
                      placeholder="Ej. A"
                      className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/[0.09] focus:border-blue-400 outline-none transition-all font-black uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Motivo / Descripción de la Falta
                  </label>
                  <textarea
                    required
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Describa detalladamente la falta cometida..."
                    rows={3}
                    className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/[0.09] focus:border-blue-400 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest">
                      Cantidad de {esActas ? 'Actas' : 'Deméritos'} a Aplicar
                    </label>
                    <div className="flex gap-1.5">
                      {['1', '2', '3', '5'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCantidad(num)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                            cantidad === num
                              ? esActas ? 'bg-blue-500 text-white' : 'bg-rose-500 text-white'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          +{num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className={`w-full px-5 py-3.5 bg-white/[0.05] border border-white/10 rounded-2xl outline-none transition-all font-black text-xl ${
                      esActas ? 'text-cyan-400 focus:border-blue-400' : 'text-rose-400 focus:border-rose-400'
                    }`}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-black tracking-wide transition-all flex justify-center items-center gap-2.5 shadow-xl mt-4 border text-white ${
                    esActas
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 shadow-blue-600/30 border-blue-400/40'
                      : 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 shadow-rose-600/30 border-rose-400/40'
                  }`}
                >
                  <span>GUARDAR EN TABLA {esActas ? 'ACTAS' : 'DEMÉRITOS'}</span>
                  <FileText size={20} />
                </motion.button>

                <AnimatePresence>
                  {mensaje && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 bg-emerald-500/15 backdrop-blur-md text-emerald-300 rounded-2xl flex items-center gap-3 text-xs font-bold border border-emerald-500/30"
                    >
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                      <span>Guardado exitosamente en la tabla MySQL <code className="underline">{esActas ? 'actas' : 'demeritos'}</code>.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL DE BASE DE DATOS Y BUSCADOR */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.04] backdrop-blur-3xl p-8 rounded-[2.2rem] border border-white/10 shadow-2xl h-full max-h-[82vh] flex flex-col">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
                    <History size={22} />
                  </div>
                  <span>Registros en <code className={esActas ? 'text-blue-400' : 'text-rose-400'}>{esActas ? 'actas' : 'demeritos'}</code></span>
                </h2>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar alumno o grado..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:border-cyan-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3.5 pb-6">
              {listaFiltrada.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <AlertTriangle size={28} />
                  </div>
                  <p className="text-slate-300 font-bold text-base">No hay registros en la tabla <code className="text-cyan-400">{esActas ? 'actas' : 'demeritos'}</code>.</p>
                  <p className="text-slate-500 text-xs mt-1">Completa el formulario de la izquierda para insertar el primer folio.</p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {listaFiltrada.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 40 }}
                      transition={{ delay: index * 0.04 }}
                      className="group bg-white/[0.04] hover:bg-white/[0.08] p-5 rounded-3xl border border-white/10 hover:border-white/25 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all duration-300 shadow-lg"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                            #{item.id}
                          </span>
                          <h3 className="font-black text-white text-lg tracking-tight">{item.nombre}</h3>
                        </div>

                        <p className="text-slate-300 text-xs italic line-clamp-1">"{item.motivo}"</p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="bg-white/10 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                            Grado: {item.grado} "{item.seccion}"
                          </span>
                          <span className="text-slate-400 text-[11px] font-medium">• {item.fecha}</span>
                          {item.emitido_por && (
                            <span className="text-cyan-400/90 text-[11px] font-semibold">• Por: {item.emitido_por}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${
                          esActas
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                        }`}>
                          {item.cantidad} {esActas ? (item.cantidad === '1' ? 'Acta' : 'Actas') : 'PTS'}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDocImprimir(item)}
                          className="flex-1 md:flex-none bg-white text-slate-950 hover:bg-cyan-300 px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                          <Printer size={15} /> Imprimir
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 8 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => eliminarRegistro(item.id, pestaña)}
                          className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-xl transition-colors"
                          title="Eliminar de MySQL"
                        >
                          <X size={18} />
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

      {/* COMPONENTE DEL MODAL DE IMPRESIÓN */}
      <ModalImpresion docImprimir={docImprimir} onClose={() => setDocImprimir(null)} />

    </div>
  );
}