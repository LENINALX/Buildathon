export default function MejoresHorarios({ horarios }) {
  return (
    <section className="mb-5 rounded-2xl border border-[#cce8df] bg-[#f2fbf7] p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d8f2e7] text-sm" aria-hidden="true">◷</span>
        <p className="text-sm font-extrabold text-[#245c58]">Mejores horarios para salir</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {horarios.map((h) => (
          <span key={h} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#167063] shadow-sm ring-1 ring-[#d4eee3]">
            {h}
          </span>
        ))}
      </div>
    </section>
  );
}
