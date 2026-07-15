import { useState } from "react";

export default function CompartirReporte({ caleta, datos }) {
  const [estado, setEstado] = useState("");
  const texto = `Pescador Inteligente — ${caleta}\nRiesgo: ${datos.nivel_riesgo.toUpperCase()}\nOleaje: ${datos.altura_ola} m | Viento: ${datos.velocidad_viento} km/h | Ráfagas: ${datos.rafaga_viento} km/h\n${datos.recomendacion}\nConsulta las condiciones antes de zarpar.`;

  async function compartir() {
    try {
      if (navigator.share) await navigator.share({ title: `Condiciones en ${caleta}`, text: texto });
      else { await navigator.clipboard.writeText(texto); setEstado("Reporte copiado"); setTimeout(() => setEstado(""), 2500); }
    } catch { /* El usuario puede cerrar el cuadro de compartir. */ }
  }

  return <button onClick={compartir} className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#bcdcd8] bg-white/75 px-4 py-2.5 text-sm font-bold text-[#176276] transition hover:bg-white">↗ Compartir condiciones {estado && <span className="text-[#168070]">· {estado}</span>}</button>;
}
