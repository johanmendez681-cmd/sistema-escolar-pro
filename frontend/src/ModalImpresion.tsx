import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X } from 'lucide-react';

interface ModalImpresionProps {
  docImprimir: any;
  onClose: () => void;
}

const LISTA_ASPECTOS_ACTA = [
  'Agresiones verbales.',
  'Inasistencia a clases y evasiones sin excusa alguna.',
  'Bajo rendimiento académico.',
  'Bajo rendimiento disciplinario.',
  'Falta de compromisos asignados.',
  'Mala presentación personal.',
  'Poca puntualidad a la hora de llegada a clases.',
  'Deficiencias en los procesos de formación.',
  'Falta de compromiso por parte del padre de familia.'
];

export default function ModalImpresion({ docImprimir, onClose }: ModalImpresionProps) {
  if (!docImprimir) return null;

  const esActa = docImprimir.tipo === 'actas';

  let aspectosMarcados: string[] = ['Bajo rendimiento disciplinario.'];
  try {
    if (Array.isArray(docImprimir.aspectos)) {
      aspectosMarcados = docImprimir.aspectos;
    } else if (typeof docImprimir.aspectos === 'string' && docImprimir.aspectos.startsWith('[')) {
      aspectosMarcados = JSON.parse(docImprimir.aspectos);
    }
  } catch {
    aspectosMarcados = ['Bajo rendimiento disciplinario.'];
  }

  const acudiente = docImprimir.acudiente || '';
  const observacionExtra = docImprimir.observacion || '';

  const centroEducativo = docImprimir.centro_educativo || 'Complejo Educativo "Jutta Steiner de Toruño"';
  const codigoCE = docImprimir.codigo_ce || '11177';
  const departamento = docImprimir.departamento || 'La Libertad';
  const municipio = docImprimir.municipio || 'La Libertad Oeste';
  const distrito = docImprimir.distrito || 'Sacacoyo';
  const nie = docImprimir.nie || '';
  const sexo = docImprimir.sexo || '';
  const turno = docImprimir.turno || 'Matutino';
  const literalDemerito = docImprimir.literal_demerito || 'A';
  const literalRedencion = docImprimir.literal_redencion || '';
  const literalReconocimiento = docImprimir.literal_reconocimiento || '';

  const ejecutarImpresion = () => {
    const win = window as any;
    if (win.AndroidPrint && typeof win.AndroidPrint.print === 'function') {
      win.AndroidPrint.print();
    } else {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl print:static print:bg-white print:p-0 print:block print:overflow-visible">
        <style>
          {`
            @media print {
              @page { size: letter portrait; margin: 0 !important; }
              html, body, #root, #root > div {
                background: #ffffff !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                height: auto !important;
                min-height: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}
        </style>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white text-black rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:block print:overflow-visible relative overflow-hidden"
        >
          <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 px-6 py-3 bg-slate-900 text-white print:hidden">
            <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-600 uppercase">
                {esActa ? 'Acta de Compromiso Oficial' : 'Instrumento No. 001 MINED'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={ejecutarImpresion}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Printer size={17} /> Imprimir / Guardar PDF
              </button>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-rose-600 text-white p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-10 overflow-y-auto print:overflow-visible print:px-14 print:py-10 bg-white text-black">
            {esActa ? (
              <div className="max-w-3xl mx-auto font-serif text-black leading-snug text-[13.5px]">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <img src="/logo.png" alt="Escudo" className="w-12 h-14 object-contain" />
                  <h1 className="text-xl sm:text-2xl font-bold italic text-center">
                    Complejo Educativo "Jutta Steiner de Toruño"
                  </h1>
                </div>

                <h2 className="text-center font-sans font-extrabold text-sm uppercase tracking-wider mt-2 mb-4">
                  ACTA DE COMPROMISO N° {String(docImprimir.id).padStart(2, '0')}
                </h2>

                <div className="space-y-2.5 mb-4 font-sans text-xs sm:text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div className="flex-1 min-w-[260px] flex items-baseline">
                      <span className="mr-2">Estudiante:</span>
                      <span className="flex-1 border-b border-black font-bold uppercase px-2">
                        {docImprimir.nombre}
                      </span>
                    </div>
                    <div className="w-44 flex items-baseline">
                      <span className="mr-2">Grado:</span>
                      <span className="flex-1 border-b border-black font-bold uppercase text-center">
                        {docImprimir.grado} "{docImprimir.seccion}"
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div className="flex-1 min-w-[260px] flex items-baseline">
                      <span className="mr-2">Nombre del acudiente:</span>
                      <span className="flex-1 border-b border-black font-bold uppercase px-2">
                        {acudiente}
                      </span>
                    </div>
                    <div className="w-44 flex items-baseline">
                      <span className="mr-2">Fecha:</span>
                      <span className="flex-1 border-b border-black font-semibold text-center text-xs">
                        {docImprimir.fecha}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-justify mb-3">
                  Teniendo en cuenta que La educación es un proceso de formación permanente, personal, cultural y social
                  que se fundamenta en una concepción integral de la persona humana, de su dignidad, de sus derechos y
                  de sus deberes; aclarando que es obligación del docente informar al padre de familia o acudiente del
                  estudiante sobre el rendimiento integral de su acudido se rinde informe parcial del desarrollo del
                  estudiante en el año escolar 2026.
                </p>

                <div className="mb-3">
                  <p className="mb-1">Con respecto a los siguientes aspectos seleccionados:</p>
                  <div className="space-y-0.5 pl-1">
                    {LISTA_ASPECTOS_ACTA.map((aspecto, idx) => {
                      const marcado = aspectosMarcados.includes(aspecto);
                      return (
                        <div key={idx} className="flex items-baseline gap-2">
                          <span className="inline-block w-6 border-b border-black text-center font-sans font-black text-xs">
                            {marcado ? 'X' : '\u00A0'}
                          </span>
                          <span className={marcado ? 'font-bold' : ''}>{aspecto}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="text-justify mb-3">
                  Por lo que se le informa al acudiente el rendimiento integral de su acudido y se compromete a establecer
                  normas en común, con el único objetivo de ayudar a la{' '}
                  <strong>superación personal, disciplinaria y académica</strong> de su hijo sin olvidar que:
                </p>

                <p className="text-justify mb-4">
                  <strong>Observación:</strong> Queda tajantemente extinto a la participación colectiva de actividades
                  recreativas hasta observar cambios significativos. Mas a lo contrario tiene que disponer actitud
                  colaborativa en las acciones informativas y formativas. De observarse continuidad a los actos que
                  peligra la imagen y las buenas costumbres de la institución será separado definitivamente. Asumiendo
                  toda responsabilidad a efecto de sus faltas al reglamento de la Institución Educativa.
                  {observacionExtra ? (
                    <span className="block mt-1.5 italic font-semibold">
                      Compromiso y detalle específico del caso: "{observacionExtra}"
                    </span>
                  ) : null}
                </p>

                <p className="text-center my-4">Para constancia firman los interesados:</p>

                <div className="grid grid-cols-2 gap-x-16 gap-y-12 mt-12 pt-4 px-6 font-serif text-sm break-inside-avoid">
                  <div className="text-center">
                    <div className="w-full h-8" />
                    <div className="w-full border-t border-black h-[1.5px] bg-black mb-1" />
                    <p>Estudiante</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-8" />
                    <div className="w-full border-t border-black h-[1.5px] bg-black mb-1" />
                    <p>Docente</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-8" />
                    <div className="w-full border-t border-black h-[1.5px] bg-black mb-1" />
                    <p>Acudiente</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-8" />
                    <div className="w-full border-t border-black h-[1.5px] bg-black mb-1" />
                    <p>Coordinador</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full font-sans text-black text-[11px] sm:text-[12px] leading-snug">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo C.E." className="w-12 h-14 object-contain" />
                  </div>
                  <div className="text-center flex-1 pt-2">
                    <h1 className="text-base sm:text-lg font-extrabold leading-tight">Instrumento No. 001</h1>
                    <h2 className="text-base sm:text-lg font-extrabold leading-tight">
                      Tarjeta de Deméritos del Estudiante
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 border-l-2 border-slate-700 pl-2.5 text-[9px] leading-tight">
                    <div>
                      <p className="font-bold uppercase">GOBIERNO DE EL SALVADOR</p>
                      <p className="uppercase">MINISTERIO DE EDUCACIÓN,</p>
                      <p className="uppercase">CIENCIA Y TECNOLOGÍA</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3 text-[11.5px]">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex-1 min-w-[260px] flex items-baseline">
                      <span>1. Nombre del Centro Educativo:</span>
                      <span className="flex-1 border-b border-black font-bold px-2">{centroEducativo}</span>
                    </div>
                    <div className="w-48 flex items-baseline">
                      <span>2. Código del C.E.</span>
                      <span className="flex-1 border-b border-black font-bold text-center px-1">{codigoCE}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex-1 min-w-[180px] flex items-baseline">
                      <span>3. Departamento del C.E</span>
                      <span className="flex-1 border-b border-black font-bold px-2">{departamento}</span>
                    </div>
                    <div className="flex-1 min-w-[180px] flex items-baseline">
                      <span>4. Municipio:</span>
                      <span className="flex-1 border-b border-black font-bold px-2">{municipio}</span>
                    </div>
                    <div className="w-48 flex items-baseline">
                      <span>5. Distrito:</span>
                      <span className="flex-1 border-b border-black font-bold px-2">{distrito}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex-1 min-w-[260px] flex items-baseline">
                      <span>6. Nombre del Estudiante:</span>
                      <span className="flex-1 border-b border-black font-bold uppercase px-2">{docImprimir.nombre}</span>
                    </div>
                    <div className="w-52 flex items-baseline">
                      <span>7. NIE:</span>
                      <span className="flex-1 border-b border-black font-bold text-center px-1">{nie}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="w-44 flex items-baseline">
                      <span>8. Sexo:</span>
                      <span className="flex-1 border-b border-black font-bold text-center px-1">{sexo}</span>
                    </div>
                    <div className="flex-1 min-w-[200px] flex items-baseline">
                      <span>9. Grado/Sección:</span>
                      <span className="flex-1 border-b border-black font-bold uppercase text-center px-2">
                        {docImprimir.grado} "{docImprimir.seccion}"
                      </span>
                    </div>
                    <div className="w-52 flex items-baseline">
                      <span>10. Turno:</span>
                      <span className="flex-1 border-b border-black font-bold text-center px-1">{turno}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 print:grid-cols-4 border border-black text-[10px] leading-tight mb-2">
                  <div className="p-2 border-b md:border-b-0 md:border-r print:border-b-0 print:border-r border-black space-y-1.5">
                    <p className="font-bold">Artículo 3. Asignación de deméritos</p>
                    <p>Los deméritos se asignarán en los siguientes casos:</p>
                    <p>A) No saludar al entrar o al salir del aula.</p>
                    <p>B) Omitir "Por favor" al hacer una petición.</p>
                    <p>C) Omitir "Gracias" al recibir un favor, material o atención.</p>
                    <p>D) Usar un tono grosero o irrespetuoso hacia compañeros, docentes o personal.</p>
                  </div>

                  <div className="p-2 border-b md:border-b-0 md:border-r print:border-b-0 print:border-r border-black space-y-1.5">
                    <p className="font-bold">Artículo 5. Escala de consecuencias</p>
                    <p>
                      <strong>- 3 deméritos:</strong> Advertencia verbal y reflexión escrita («La importancia de la cortesía»).
                    </p>
                    <p>
                      <strong>- 6 deméritos:</strong> comunicación a la familia y tarea correctiva (redactar un texto, elaborar un cartel o participar en una actividad sobre cortesía).
                    </p>
                    <p>
                      <strong>- 10 deméritos:</strong> suspensión de privilegios escolares (participación en juegos, cultura actividades les o recreativas).
                    </p>
                    <p>
                      <strong>- Más de 10 deméritos:</strong> reunión con la dirección y la familia, acompañada de una última advertencia para el estudiante.
                    </p>
                    <p>
                      <strong>- 15 deméritos:</strong> el estudiante no podrá ser promovido de grado.
                    </p>
                  </div>

                  <div className="p-2 border-b md:border-b-0 md:border-r print:border-b-0 print:border-r border-black space-y-1.5">
                    <p className="font-bold">Artículo 6. Redención de deméritos</p>
                    <p>Los estudiantes podrán eliminar deméritos acumulados de las siguientes maneras:</p>
                    <p>
                      <strong>A)</strong> Cumplir una semana completa con saludos y expresiones de cortesía ejemplares.
                    </p>
                    <p>
                      <strong>B)</strong> Apoyar voluntariamente en actividades de orden y limpieza escolar.
                    </p>
                    <p>
                      <strong>C)</strong> Participar en campañas de valores organizadas por el centro educativo.
                    </p>
                  </div>

                  <div className="p-2 space-y-1.5">
                    <p className="font-bold">Artículo 7. Reconocimientos</p>
                    <p>
                      Al final de cada mes, los estudiantes o las secciones con cero deméritos recibirán una Mención Honorífica de Cortesía Escolar.
                    </p>
                    <p>Se podrán otorgar:</p>
                    <p><strong>A)</strong> Diplomas</p>
                    <p><strong>B)</strong> Menciones en Murales Escolares</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 font-bold text-[10.5px] mb-1 pl-2">
                  <span>● 12. D: Deméritos,</span>
                  <span>13. R: Redención,</span>
                  <span>14. RC: Reconocimiento</span>
                </div>

                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    <tr className="text-center font-bold">
                      <th rowSpan={2} className="border border-black p-1 w-8">No.</th>
                      <th rowSpan={2} className="border border-black p-1 w-24">
                        11.<br />Fecha
                      </th>
                      <th colSpan={4} className="border border-black p-1">12. D</th>
                      <th colSpan={3} className="border border-black p-1">13. R</th>
                      <th colSpan={2} className="border border-black p-1">14. RC</th>
                      <th rowSpan={2} className="border border-black p-1 w-52">
                        15.<br />Nombre y firma de quien registra Demérito o Reconocimiento
                      </th>
                      <th rowSpan={2} className="border border-black p-1 w-52">
                        16.<br />Nombre y firma del Responsable de Cumplimiento de Redención
                      </th>
                      <th rowSpan={2} className="border border-black p-1 w-36">
                        17.<br />Firma del estudiante
                      </th>
                    </tr>
                    <tr className="text-center font-bold">
                      <th className="border border-black p-0.5 w-5 bg-slate-100 print:bg-slate-100">A</th>
                      <th className="border border-black p-0.5 w-5">B</th>
                      <th className="border border-black p-0.5 w-5 bg-slate-100 print:bg-slate-100">C</th>
                      <th className="border border-black p-0.5 w-5">D</th>
                      <th className="border border-black p-0.5 w-5">A</th>
                      <th className="border border-black p-0.5 w-5 bg-slate-100 print:bg-slate-100">B</th>
                      <th className="border border-black p-0.5 w-5">C</th>
                      <th className="border border-black p-0.5 w-5 bg-slate-100 print:bg-slate-100">A</th>
                      <th className="border border-black p-0.5 w-5">B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((fila) => {
                      const activa = fila === 1;
                      return (
                        <tr key={fila} className="h-8 text-center">
                          <td className="border border-black font-bold">{fila}</td>
                          <td className="border border-black text-[9.5px] font-semibold">
                            {activa ? docImprimir.fecha : ''}
                          </td>
                          <td className="border border-black bg-slate-50 font-black">
                            {activa && literalDemerito === 'A' ? 'X' : ''}
                          </td>
                          <td className="border border-black font-black">
                            {activa && literalDemerito === 'B' ? 'X' : ''}
                          </td>
                          <td className="border border-black bg-slate-50 font-black">
                            {activa && literalDemerito === 'C' ? 'X' : ''}
                          </td>
                          <td className="border border-black font-black">
                            {activa && literalDemerito === 'D' ? 'X' : ''}
                          </td>
                          <td className="border border-black font-black">
                            {activa && literalRedencion === 'A' ? 'X' : ''}
                          </td>
                          <td className="border border-black bg-slate-50 font-black">
                            {activa && literalRedencion === 'B' ? 'X' : ''}
                          </td>
                          <td className="border border-black font-black">
                            {activa && literalRedencion === 'C' ? 'X' : ''}
                          </td>
                          <td className="border border-black bg-slate-50 font-black">
                            {activa && literalReconocimiento === 'A' ? 'X' : ''}
                          </td>
                          <td className="border border-black font-black">
                            {activa && literalReconocimiento === 'B' ? 'X' : ''}
                          </td>
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}