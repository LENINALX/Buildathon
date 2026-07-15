export default function DatosMarCards({ altura_ola, velocidad_viento, temp_mar }) {
  const datos = [
    { label: "Oleaje", valor: `${altura_ola} m`, icono: "≋", tono: "text-[#1977a3] bg-[#e5f5fb]" },
    { label: "Viento", valor: `${velocidad_viento} km/h`, icono: "≋", tono: "text-[#b16b13] bg-[#fff3d8]" },
    { label: "Temp. mar", valor: `${temp_mar}°C`, icono: "☀", tono: "text-[#d16b32] bg-[#fff0e5]" },
  ];

  return (
    <section className="mb-6">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.13em] text-[#5b7a83]">Condiciones actuales</p>
      <div className="grid grid-cols-3 gap-2.5">
      {datos.map((d) => (
        <div key={d.label} className="rounded-2xl border border-white bg-white/85 p-3 text-center shadow-[0_8px_18px_rgba(25,75,85,0.07)]">
          <span className={`mx-auto mb-2 grid h-7 w-7 place-items-center rounded-full text-lg font-bold ${d.tono}`} aria-hidden="true">{d.icono}</span>
          <p className="text-[11px] font-semibold text-[#6c858b]">{d.label}</p>
          <p className="mt-0.5 text-base font-extrabold tracking-tight text-[#153b48]">{d.valor}</p>
        </div>
      ))}
      </div>
    </section>
  );
}
