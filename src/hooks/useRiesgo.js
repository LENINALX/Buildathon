import { useState, useEffect } from "react";
import { obtenerDatosMar } from "../lib/openMeteo";
import {
  clasificarRiesgo,
  calcularMejoresHorarios,
  generarExplicacion,
  direccionComoTexto,
} from "../lib/calcularRiesgo";

export function useRiesgo(caleta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const mar = await obtenerDatosMar(caleta);
        const nivel_riesgo = clasificarRiesgo(mar.altura_ola, mar.velocidad_viento);
        const mejores_horarios = calcularMejoresHorarios(
          mar.serie_altura_ola,
          mar.serie_viento,
          mar.horas
        );
        const { explicacion, recomendacion } = generarExplicacion(nivel_riesgo, mar);
        const pronostico = mar.horas.slice(indiceHoraActual(mar.horas), indiceHoraActual(mar.horas) + 5).map((hora, i) => {
          const indice = indiceHoraActual(mar.horas) + i;
          return {
            hora: new Date(hora).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
            ola: mar.serie_altura_ola[indice],
            viento: mar.serie_viento[indice],
            riesgo: clasificarRiesgo(mar.serie_altura_ola[indice], mar.serie_viento[indice]),
          };
        });

        setDatos({
          nivel_riesgo,
          explicacion,
          recomendacion,
          altura_ola: mar.altura_ola,
          velocidad_viento: mar.velocidad_viento,
          rafaga_viento: mar.rafaga_viento,
          temp_mar: mar.temp_mar,
          periodo_ola: mar.periodo_ola,
          direccion_ola: direccionComoTexto(mar.direccion_ola),
          mejores_horarios,
          pronostico,
          actualizado_en: new Date(),
          boletin_inocar: null, // se llena manualmente si hay uno vigente
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [caleta, recarga]);

  return { datos, cargando, error, recargar: () => setRecarga((valor) => valor + 1) };
}

function indiceHoraActual(horas) {
  const actual = new Date().toISOString().slice(0, 13);
  const indice = horas.findIndex((hora) => hora.startsWith(actual));
  return indice === -1 ? 0 : indice;
}
