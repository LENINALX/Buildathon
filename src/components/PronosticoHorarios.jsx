const NIVELES = { bajo: "bg-[#dff5e8] text-[#16705b]", moderado: "bg-[#fff0cd] text-[#a76611]", alto: "bg-[#ffe0db] text-[#aa453d]" };

export default function PronosticoHorarios({ horas = [] }) {
  if (!horas.length) return null;
  return (
    <section className="mb-5">
      <div className="mb-2.5 flex items-end justify-between"><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#5b7a83]">Próximas horas</p><span className="text-[11px] text-[#64818a]">Ola · viento</span></div>
      <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {horas.map((hora) => (
          <div key={hora.hora} className="min-w-[88px] flex-1 rounded-2xl border border-white bg-white/85 px-2.5 py-3 text-center shadow-[0_6px_15px_rgba(25,75,85,0.06)]">
            <p className="text-xs font-extrabold text-[#244b59]">{hora.hora}</p>
            <p className="mt-2 text-xs font-bold text-[#25759a]">≋ {hora.ola} m</p>
            <p className="mt-1 text-xs font-bold text-[#b1731e]">〰 {hora.viento}</p>
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${NIVELES[hora.riesgo]}`}>{hora.riesgo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
