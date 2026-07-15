import { useMemo, useState } from "react";

const PASOS = ["Chalecos para toda la tripulación", "Combustible y motor revisados", "Celular o radio con batería", "Ruta y hora de regreso avisadas"];

export default function ChecklistZarpe() {
  const [listo, setListo] = useState([]);
  const completados = listo.length;
  const progreso = useMemo(() => `${Math.round((completados / PASOS.length) * 100)}%`, [completados]);

  function alternar(paso) {
    setListo((actual) => actual.includes(paso) ? actual.filter((item) => item !== paso) : [...actual, paso]);
  }

  return (
    <section className="mb-5 rounded-2xl border border-[#d9e8e4] bg-white/85 p-4 shadow-[0_7px_16px_rgba(25,75,85,0.05)]">
      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-extrabold text-[#234b57]">Checklist antes de zarpar</p><p className="text-xs text-[#668087]">{completados} de {PASOS.length} revisados</p></div><span className="text-lg" aria-hidden="true">✓</span></div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e4efed]"><div className="h-full rounded-full bg-[#168070] transition-all" style={{ width: progreso }} /></div>
      <div className="mt-3 space-y-2">
        {PASOS.map((paso) => <label key={paso} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#36555e]"><input type="checkbox" checked={listo.includes(paso)} onChange={() => alternar(paso)} className="h-4 w-4 accent-[#168070]" /><span className={listo.includes(paso) ? "line-through text-[#789198]" : ""}>{paso}</span></label>)}
      </div>
      {completados === PASOS.length && <p className="mt-3 rounded-lg bg-[#e5f7ee] px-3 py-2 text-xs font-bold text-[#16705b]">Lista completada. Recuerda revisar las condiciones otra vez antes de salir.</p>}
    </section>
  );
}
