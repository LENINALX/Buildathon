import { useState, useEffect } from "react";
import { obtenerDatosMar } from "../lib/openMeteo";
import {
  clasificarRiesgo,
  calcularMejoresHorarios,
  generarExplicacion,
} from "../lib/calcularRiesgo";

export function useRiesgo(caleta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
        const { explicacion, recomendacion } = generarExplicacion(nivel_riesgo);

        setDatos({
          nivel_riesgo,
          explicacion,
          recomendacion,
          altura_ola: mar.altura_ola,
          velocidad_viento: mar.velocidad_viento,
          temp_mar: mar.temp_mar,
          mejores_horarios,
          boletin_inocar: null, // se llena manualmente si hay uno vigente
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [caleta]);

  return { datos, cargando, error };
}