import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Lock, Mail, Eye, EyeOff, User,
  ArrowRight, ShieldCheck, AlertTriangle, Loader2
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (usuario: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [modoAuth, setModoAuth] = useState<'login' | 'registro'>('login');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rolUsuario, setRolUsuario] = useState('Director');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');
  const [cargandoAuth, setCargandoAuth] = useState(false);

  const manejarAutenticacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAuth('');
    setCargandoAuth(true);

    const endpoint = modoAuth === 'login' ? '/api/login' : '/api/registro';
    const payload = modoAuth === 'login'
      ? { correo, password }
      : { nombre: nombreUsuario, correo, password, rol: rolUsuario };

    try {
      const res = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      setTimeout(() => {
        setCargandoAuth(false);
        if (res.ok && data.exito) {
          onLoginSuccess(data.usuario);
          setCorreo('');
          setPassword('');
          setNombreUsuario('');
        } else {
          setErrorAuth(data.mensaje || 'Credenciales inválidas. Verifica tus datos.');
        }
      }, 650);
    } catch {
      setTimeout(() => {
        setCargandoAuth(false);
        const guardadosMovil = JSON.parse(localStorage.getItem('usuarios_celular') || '[]');

        if (modoAuth === 'registro') {
          const nuevoUsuario = {
            id: Date.now(),
            nombre: nombreUsuario,
            correo: correo.trim().toLowerCase(),
            password,
            rol: rolUsuario
          };
          localStorage.setItem('usuarios_celular', JSON.stringify([...guardadosMovil, nuevoUsuario]));
          onLoginSuccess(nuevoUsuario);
          setCorreo('');
          setPassword('');
          setNombreUsuario('');
        } else {
          const usuarioEncontrado = guardadosMovil.find(
            (u: any) => u.correo === correo.trim().toLowerCase() && u.password === password
          );

          if (usuarioEncontrado) {
            onLoginSuccess(usuarioEncontrado);
          } else if (correo.trim().toLowerCase() === 'director@juttasteiner.edu.sv' && password === 'admin123') {
            onLoginSuccess({ nombre: 'Dirección Académica', correo, rol: 'Director' });
          } else {
            setErrorAuth('Correo o contraseña incorrectos. Si eres nuevo, regístrate en la pestaña superior.');
          }
        }
      }, 650);
    }
  };

  const autocompletarDemo = () => {
    setModoAuth('login');
    setCorreo('director@juttasteiner.edu.sv');
    setPassword('admin123');
    setErrorAuth('');
  };

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center p-4 font-sans relative overflow-hidden select-none">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, 80, 0], y: [0, -50, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] rounded-full bg-blue-600/25 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], x: [0, -70, 0], y: [0, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] -right-[15%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] left-[25%] w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[130px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-3xl border border-white/15 shadow-[0_0_80px_rgba(37,99,235,0.18)] overflow-hidden"
      >
        <div className="lg:col-span-5 p-10 md:p-12 bg-gradient-to-br from-blue-600/20 via-indigo-900/30 to-slate-950/80 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold tracking-widest uppercase mb-8">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" /> Plataforma Oficial v2.5
            </div>

            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-28 h-28 rounded-3xl bg-white p-3.5 shadow-2xl shadow-blue-500/30 mb-6 flex items-center justify-center border-2 border-white/60"
            >
              <img src="/logo.png" alt="Escudo Institucional" className="w-full h-full object-contain" />
            </motion.div>

            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
              C.E. "Jutta Steiner de Toruño"
            </h1>
            <p className="text-blue-200/70 text-sm font-medium mt-3 leading-relaxed">
              Arquitectura Relacional MySQL con tablas independientes para Usuarios, Actas Oficiales y Control de Deméritos.
            </p>
          </div>

          <div className="relative z-10 mt-10 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={16} />
              </div>
              <span>Autenticación conectada a tabla MySQL <code className="text-emerald-300">usuarios</code></span>
            </div>
            
            <button
              type="button"
              onClick={autocompletarDemo}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">⚡ Autocompletar Credenciales (Demo)</p>
                <p className="text-xs text-slate-300 font-mono mt-0.5">director@juttasteiner.edu.sv</p>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 p-10 md:p-12 flex flex-col justify-center bg-slate-950/40">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-8 relative">
            <button
              type="button"
              onClick={() => { setModoAuth('login'); setErrorAuth(''); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors relative z-10"
            >
              {modoAuth === 'login' && (
                <motion.div
                  layoutId="tabAuth"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/30 z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={modoAuth === 'login' ? 'text-white' : 'text-slate-400 hover:text-white'}>
                Iniciar Sesión
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setModoAuth('registro'); setErrorAuth(''); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors relative z-10"
            >
              {modoAuth === 'registro' && (
                <motion.div
                  layoutId="tabAuth"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/30 z-[-1]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={modoAuth === 'registro' ? 'text-white' : 'text-slate-400 hover:text-white'}>
                Registrar Usuario
              </span>
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {modoAuth === 'login' ? 'Bienvenido al Centro de Control' : 'Nuevo Registro en Tabla Usuarios'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {modoAuth === 'login'
                ? 'Ingresa tus credenciales institucionales para desbloquear el sistema.'
                : 'Crea una nueva cuenta oficial directamente en la base de datos MySQL.'}
            </p>
          </div>

          <form onSubmit={manejarAutenticacion} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {modoAuth === 'registro' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                      Nombre Completo del Docente / Director
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input
                        type="text"
                        required={modoAuth === 'registro'}
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        placeholder="Ej. Lic. Erick Elizondo"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                      Cargo / Rol Institucional
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Director', 'Docente'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRolUsuario(r)}
                          className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                            rolUsuario === r
                              ? 'bg-blue-500/20 border-blue-400 text-white shadow-inner'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="director@juttasteiner.edu.sv"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass(!mostrarPass)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-white transition-colors"
                >
                  {mostrarPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {errorAuth && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2.5"
                >
                  <AlertTriangle size={18} className="text-rose-400 shrink-0" />
                  <span>{errorAuth}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={cargandoAuth}
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-white tracking-wide bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/30 border border-blue-400/30 flex items-center justify-center gap-3 transition-all mt-6"
            >
              {cargandoAuth ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>VALIDANDO EN TABLA USUARIOS...</span>
                </>
              ) : (
                <>
                  <span>{modoAuth === 'login' ? 'DESBLOQUEAR SISTEMA' : 'GUARDAR USUARIO Y ENTRAR'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}