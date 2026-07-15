export default function CapitanSeguro({ consejo }) {
  if (!consejo) return null;

  return (
    <section className="mb-5 overflow-hidden rounded-[22px] border border-[#b9dde3] bg-[#edfafd] shadow-[0_10px_20px_rgba(25,91,109,0.08)]">
      <div className="flex items-center gap-3 bg-[#0b6177] px-4 py-3 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-xl" aria-hidden="true">⚓</span>
        <div><p className="text-sm font-extrabold">Capitán Seguro</p><p className="text-[11px] text-white/75">Consejo generado con las condiciones actuales</p></div>
      </div>
      <div className="p-4 text-sm leading-relaxed text-[#244852]">
        <p className="font-semibold">{consejo.recomendacion}</p>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-[.1em] text-[#3c7080]">Antes de zarpar</p>
        <ul className="mt-1.5 space-y-1">{consejo.checklist.map((item) => <li key={item}>✓ {item}</li>)}</ul>
        <p className="mt-3 rounded-lg bg-white/75 p-2 text-xs text-[#4c6d75]">Siguiente consulta: {consejo.pregunta_sugerida}</p>
      </div>
    </section>
  );
}
