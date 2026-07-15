import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SemaforoRiesgo from "./components/SemaforoRiesgo";
import DatosMarCards from "./components/DatosMarCards";
import MejoresHorarios from "./components/MejoresHorarios";
import RecomendacionCard from "./components/RecomendacionCard";
import Landing from "./components/Landing";
import PronosticoHorarios from "./components/PronosticoHorarios";
import CapitanSeguro from "./components/CapitanSeguro";
import { useRiesgo } from "./hooks/useRiesgo";

export default function App() {
  const [caleta, setCaleta] = useState("Manta");
  const [verPanel, setVerPanel] = useState(false);
  const { datos, cargando, error, recargar } = useRiesgo(caleta);

  if (!verPanel) return <Landing onEntrar={() => setVerPanel(true)} />;

  return (
    <main className="app-shell">
      <div className="app-content">
        <Header caleta={caleta} setCaleta={setCaleta} actualizadoEn={datos?.actualizado_en} onActualizar={recargar} cargando={cargando} />

        {datos?.actualizado_en && <p className="mb-3 -mt-3 text-right text-[11px] text-[#66838b]">Actualizado: {datos.actualizado_en.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}</p>}

        {cargando && !datos && <p className="loading-state">Consultando las condiciones del mar…</p>}
        {error && !datos && <section className="error-state"><span className="text-3xl" aria-hidden="true">◌</span><p className="mt-2 font-bold">Datos no disponibles</p><p className="mt-1 text-sm text-[#8b5a4f]">No podemos confirmar las condiciones del mar ahora. No recomendamos zarpar sin una fuente oficial.</p><button onClick={recargar} className="mt-4 rounded-xl bg-[#a94d39] px-4 py-2 text-sm font-bold text-white">Intentar de nuevo</button></section>}

        {datos && (
          <>
            <SemaforoRiesgo nivel={datos.nivel_riesgo} explicacion={datos.explicacion} />
            <section className="mb-5 rounded-2xl border border-[#cce2df] bg-white/80 p-3.5 shadow-[0_6px_15px_rgba(25,75,85,0.05)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a7d83]">La recomendación se basa en</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-[#225262]"><span className="rounded-lg bg-[#e3f4f8] px-2.5 py-1.5">≋ Oleaje {datos.altura_ola} m</span><span className="rounded-lg bg-[#fff2d9] px-2.5 py-1.5">〰 Viento {datos.velocidad_viento} km/h</span><span className="rounded-lg bg-[#fff2d9] px-2.5 py-1.5">Ráfagas {datos.rafaga_viento} km/h</span></div>
            </section>
            <DatosMarCards {...datos} />
            <MejoresHorarios horarios={datos.mejores_horarios} />
            <PronosticoHorarios horas={datos.pronostico} />
            {datos.nivel_riesgo !== "bajo" && <RecomendacionCard titulo="Embarcaciones pequeñas" texto="Por las condiciones actuales, revisa el equipo de seguridad, informa tu ruta y evita alejarte de la costa." tipo="alerta" />}
            <RecomendacionCard titulo="Recomendación para hoy" texto={datos.recomendacion} />
            <CapitanSeguro caleta={caleta} nivelRiesgo={datos.nivel_riesgo} />
            {datos.boletin_inocar && <RecomendacionCard titulo="Boletín INOCAR" texto={datos.boletin_inocar} tipo="boletin" />}
          </>
        )}
        <p className="app-footer">Consulta las condiciones antes de zarpar.</p>
      </div>
    </main>
  );
}
