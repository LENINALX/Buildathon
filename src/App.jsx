import { useState } from "react";
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
    <div className="max-w-md mx-auto p-5">
      <Header caleta={caleta} setCaleta={setCaleta} />

      {cargando && <p className="text-sm text-gray-400 text-center py-8">Consultando el mar…</p>}
      {error && <p className="text-sm text-red-500 text-center py-8">{error}</p>}

      {datos && (
        <>
          <SemaforoRiesgo nivel={datos.nivel_riesgo} explicacion={datos.explicacion} />
          <DatosMarCards
            altura_ola={datos.altura_ola}
            velocidad_viento={datos.velocidad_viento}
            temp_mar={datos.temp_mar}
          />
          <MejoresHorarios horarios={datos.mejores_horarios} />
          <RecomendacionCard titulo="Recomendación" texto={datos.recomendacion} />
          {datos.boletin_inocar && (
            <RecomendacionCard titulo="Boletín INOCAR" texto={datos.boletin_inocar} />
          )}
        </>
      )}
    </div>
  );
}