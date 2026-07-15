import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SemaforoRiesgo from "./components/SemaforoRiesgo";
import DatosMarCards from "./components/DatosMarCards";
import MejoresHorarios from "./components/MejoresHorarios";
import RecomendacionCard from "./components/RecomendacionCard";
import { useRiesgo } from "./hooks/useRiesgo";

export default function App() {
  const [caleta, setCaleta] = useState("Manta");
  const { datos, cargando, error } = useRiesgo(caleta);

  return (
    <main className="app-shell">
      <div className="app-content">
        <Header caleta={caleta} setCaleta={setCaleta} />

        {cargando && <p className="loading-state">Consultando las condiciones del mar…</p>}
        {error && <p className="error-state">{error}</p>}

        {datos && (
          <>
            <SemaforoRiesgo nivel={datos.nivel_riesgo} explicacion={datos.explicacion} />
            <DatosMarCards altura_ola={datos.altura_ola} velocidad_viento={datos.velocidad_viento} temp_mar={datos.temp_mar} />
            <MejoresHorarios horarios={datos.mejores_horarios} />
            <RecomendacionCard titulo="Recomendación para hoy" texto={datos.recomendacion} />
            {datos.boletin_inocar && <RecomendacionCard titulo="Boletín INOCAR" texto={datos.boletin_inocar} tipo="boletin" />}
          </>
        )}
        <p className="app-footer">Consulta las condiciones antes de zarpar.</p>
      </div>
    </main>
  );
}
