import { sugerirEspecies } from "../lib/especiesPesca";

const ICONOS = { Dorado: "🐟", Sierra: "〰", Atún: "◉", Corvina: "🐠", Pargo: "◈", Camotillo: "◌" };

export default function EspeciesSugeridas({ datos }) {
  const { especies, aviso } = sugerirEspecies(datos);
  return (
    <section className="mb-5 rounded-2xl border border-[#cfe3ef] bg-[#f5fbff] p-4 shadow-[0_7px_16px_rgba(25,75,85,0.05)]">
      <div className="flex items-start gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#dbeef8] text-sm" aria-hidden="true">🐟</span><div><p className="text-sm font-extrabold text-[#24536b]">Especies posibles hoy</p><p className="mt-0.5 text-xs leading-relaxed text-[#5b7a86]">{aviso}</p></div></div>
      {especies.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{especies.map((especie) => <div key={especie} className="rounded-xl bg-white px-2 py-2.5 text-center shadow-sm"><span className="text-base" aria-hidden="true">{ICONOS[especie]}</span><p className="mt-1 text-xs font-extrabold text-[#25536a]">{especie}</p></div>)}</div>}
      <p className="mt-3 border-t border-[#dcebf2] pt-2.5 text-[11px] leading-relaxed text-[#6f858b]">Orientativo: no garantiza captura. Confirma vedas, tallas permitidas y zonas autorizadas con fuentes oficiales y experiencia local.</p>
    </section>
  );
}
