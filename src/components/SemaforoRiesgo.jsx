const NIVELES = {
  bajo: { fondo: "from-[#087c6d] to-[#035b69]", etiqueta: "Todo en calma", icono: "✓" },
  moderado: { fondo: "from-[#d68b15] to-[#b76112]", etiqueta: "Navega con cuidado", icono: "!" },
  alto: { fondo: "from-[#cf5848] to-[#a43235]", etiqueta: "Mejor no salir", icono: "✕" },
};

export default function SemaforoRiesgo({ nivel, explicacion }) {
  const estilo = NIVELES[nivel] || NIVELES.moderado;

  return (
    <section className={`mb-5 overflow-hidden rounded-[24px] bg-gradient-to-br ${estilo.fondo} p-5 text-white shadow-[0_16px_28px_rgba(11,74,86,0.22)]`}>
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-3xl font-bold shadow-inner">
          {estilo.icono}
        </div>
        <div className="pt-0.5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/75">Riesgo para zarpar</p>
          <p className="mt-1 text-2xl font-extrabold capitalize leading-none">{nivel}</p>
          <p className="mt-1 text-sm font-medium text-white/90">{estilo.etiqueta}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-white/20 pt-3 text-sm leading-relaxed text-white/95">{explicacion}</div>
    </section>
  );
}
