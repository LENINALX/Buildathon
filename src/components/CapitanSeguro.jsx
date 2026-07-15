import { useState } from "react";
import { consultarCapitanSeguro } from "../lib/capitanSeguro";

export default function CapitanSeguro({ caleta, nivelRiesgo }) {
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function consultar() {
    setCargando(true);
    setError("");
    try {
      setRespuesta(await consultarCapitanSeguro(caleta));
    } catch (err) {
      setRespuesta(null);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="mb-5 overflow-hidden rounded-[22px] border border-[#b9dde3] bg-[#edfafd] shadow-[0_10px_20px_rgba(25,91,109,0.08)]">
      <div className="flex items-center gap-3 bg-[#0b6177] px-4 py-3 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-xl" aria-hidden="true">⚓</span>
        <div><p className="text-sm font-extrabold">Capitán Seguro</p><p className="text-[11px] text-white/75">Asistente para pesca artesanal</p></div>
      </div>
      <div className="p-4">
        {!respuesta && !error && <p className="text-sm leading-relaxed text-[#315d69]">Te explica las condiciones de <b>{caleta}</b> y te recuerda qué revisar antes de zarpar. No reemplaza el cálculo de seguridad ni fuentes oficiales.</p>}
        {respuesta && <div className="text-sm leading-relaxed text-[#244852]"><p className="font-semibold">{respuesta.mensaje}</p><p className="mt-3 text-xs font-extrabold uppercase tracking-[.1em] text-[#3c7080]">Antes de zarpar</p><ul className="mt-1.5 space-y-1">{respuesta.checklist.map((item) => <li key={item}>✓ {item}</li>)}</ul>{respuesta.pregunta_sugerida && <p className="mt-3 rounded-lg bg-white/75 p-2 text-xs text-[#4c6d75]">Siguiente consulta: {respuesta.pregunta_sugerida}</p>}</div>}
        {error && <p className="text-sm leading-relaxed text-[#a2483c]">{error}</p>}
        <button onClick={consultar} disabled={cargando || nivelRiesgo === "alto"} className="mt-4 w-full rounded-xl bg-[#0b6177] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#084e61] disabled:cursor-not-allowed disabled:bg-[#8aaeb5]">
          {cargando ? "Consultando al Capitán…" : nivelRiesgo === "alto" ? "Riesgo alto: no consultar para zarpar" : respuesta ? "Actualizar consejo" : "Consultar al Capitán Seguro"}
        </button>
      </div>
    </section>
  );
}
