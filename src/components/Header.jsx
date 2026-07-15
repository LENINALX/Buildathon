export default function Header({ caleta, setCaleta, actualizadoEn, onActualizar, cargando }) {
  const caletas = ["Manta", "Jaramijó", "San Mateo"];

  return (
    <header className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#075b72] text-xl shadow-[0_8px_18px_rgba(7,91,114,0.22)]" aria-hidden="true">⚓</div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#287385]">Estado del mar</p>
          <h1 className="text-lg font-extrabold leading-tight text-[#103d4d]">Pescador inteligente</h1>
          <p className="mt-0.5 text-xs capitalize text-[#5f7e86]">
            {new Date().toLocaleDateString("es-EC", { day: "numeric", month: "long" })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
      <button onClick={onActualizar} disabled={cargando} title="Actualizar condiciones" className="grid h-9 w-9 place-items-center rounded-xl border border-[#b9ddda] bg-white text-[#176277] shadow-sm transition hover:bg-[#effcfa] disabled:opacity-50" aria-label="Actualizar condiciones">↻</button>
      <select
        value={caleta}
        onChange={(e) => setCaleta(e.target.value)}
        aria-label="Seleccionar caleta"
        className="min-w-0 rounded-xl border border-[#b9ddda] bg-white px-2.5 py-2 text-sm font-semibold text-[#155267] shadow-sm outline-none transition focus:border-[#14849a] focus:ring-2 focus:ring-[#8de0db]"
      >
        {caletas.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      </div>
    </header>
  );
}
