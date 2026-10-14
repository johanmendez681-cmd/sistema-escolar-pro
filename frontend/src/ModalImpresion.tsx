import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X } from 'lucide-react';

interface ModalImpresionProps {
  docImprimir: any;
  onClose: () => void;
}

export default function ModalImpresion({ docImprimir, onClose }: ModalImpresionProps) {
  return (
    <AnimatePresence>
      {docImprimir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl print:bg-white print:p-0 print:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`bg-white text-slate-900 rounded-[2rem] shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none border-t-[16px] print:border-none relative ${
              docImprimir.tipo === 'actas' ? 'border-blue-600' : 'border-rose-600'
            }`}
          >
            <div className="absolute top-4 right-4 flex gap-2 print:hidden z-10">
              <button
                onClick={() => window.print()}
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl transition-transform active:scale-95"
              >
                <Printer size={18} /> Imprimir Formato
              </button>
              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl font-bold transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar print:overflow-visible print:p-10">
              
              <div className="text-center mb-8 border-b-2 border-slate-200 print:border-black pb-8">
                <img src="/logo.png" alt="Logo C.E. Jutta Steiner" className="w-28 h-32 mx-auto mb-4 object-contain" />
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">C.E. "Jutta Steiner de Toruño"</h2>
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest mt-1 print:text-black">Dirección y Control Disciplinario</h3>
                <p className="text-slate-400 mt-2 font-black uppercase text-sm tracking-wider print:text-black">
                  {docImprimir.tipo === 'actas' ? 'ACTA DISCIPLINARIA OFICIAL' : 'BOLETA DE SANCIÓN (DEMÉRITOS)'} • FOLIO NO. {docImprimir.id}
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-md text-slate-700 print:text-black leading-relaxed text-justify font-medium">
                  En la dirección de este centro educativo, con fecha <strong className="text-slate-900 print:text-black">{docImprimir.fecha}</strong>, se emite el presente documento oficial por parte de <strong className="text-slate-900 print:text-black">{docImprimir.emitido_por || 'Dirección Académica'}</strong> para dejar constancia de la falta incurrida por el estudiante:
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

                <div className={`p-6 rounded-3xl border print:bg-transparent print:border-2 print:border-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 ${
                  docImprimir.tipo === 'actas' ? 'bg-blue-50/50 border-blue-100' : 'bg-rose-50/50 border-rose-100'
                }`}>
                  <div>
                    <p className="font-bold text-slate-800 print:text-black text-lg tracking-tight">Sanción disciplinaria aplicada:</p>
                    <p className="text-sm text-slate-500 print:text-black mt-1 font-medium">Conforme al reglamento interno escolar.</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-black uppercase tracking-tight print:text-black ${
                      docImprimir.tipo === 'actas' ? 'text-blue-600' : 'text-rose-600'
                    }`}>
                      {docImprimir.cantidad} {docImprimir.tipo === 'actas' ? (docImprimir.cantidad === '1' ? 'ACTA' : 'ACTAS') : 'DEMÉRITOS'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* FIRMAS INDESTRUCTIBLES */}
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
  );
}