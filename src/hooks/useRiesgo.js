import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { obtenerDatosMar } from "../lib/openMeteo";
import { clasificarRiesgo, calcularMejoresHorarios, direccionComoTexto, generarExplicacion } from "../lib/calcularRiesgo";

function normalizarCaleta(caleta) {
  return caleta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

export function useRiesgo(caleta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        if (!supabase) throw new Error("Supabase no configurado");
        const { data, error: errorFuncion } = await supabase.functions.invoke("evaluar-riesgo", {
          body: { ubicacion: normalizarCaleta(caleta) },
        });
        if (errorFuncion || !data?.nivel_riesgo || !Array.isArray(data?.mejores_horarios)) throw new Error("Función no disponible");
        if (activo) setDatos({ ...data, actualizado_en: new Date(data.actualizado_en) });
      } catch {
        try {
          const respaldo = await cargarRespaldo(caleta);
          if (activo) setDatos(respaldo);
        } catch {
          if (activo) setError("No podemos confirmar las condiciones del mar ahora. No recomendamos zarpar sin una fuente oficial.");
        }
      }
      setCargando(false);
    }

    cargar();
    return () => { activo = false; };
  }, [caleta, recarga]);

  return { datos, cargando, error, recargar: () => setRecarga((valor) => valor + 1) };
}

async function cargarRespaldo(caleta) {
  const mar = await obtenerDatosMar(caleta);
  const nivel_riesgo = clasificarRiesgo(mar.altura_ola, mar.velocidad_viento);
  const mejores_horarios = calcularMejoresHorarios(mar.serie_altura_ola, mar.serie_viento, mar.horas);
  const { explicacion, recomendacion } = generarExplicacion(nivel_riesgo, mar);
  const inicio = indiceHoraActual(mar.horas);

  return {
    nivel_riesgo, explicacion, recomendacion,
    altura_ola: mar.altura_ola, velocidad_viento: mar.velocidad_viento,
    rafaga_viento: mar.rafaga_viento, temp_mar: mar.temp_mar,
    periodo_ola: mar.periodo_ola, direccion_ola: direccionComoTexto(mar.direccion_ola),
    mejores_horarios,
    pronostico: mar.horas.slice(inicio, inicio + 5).map((hora, i) => ({
      hora: new Date(hora).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      ola: mar.serie_altura_ola[inicio + i],
      viento: mar.serie_viento[inicio + i],
      riesgo: clasificarRiesgo(mar.serie_altura_ola[inicio + i], mar.serie_viento[inicio + i]),
    })),
    actualizado_en: new Date(),
    boletin_inocar: null,
    capitan_seguro: null,
    agente_no_disponible: true,
  };
}

function indiceHoraActual(horas) {
  const actual = new Date().toISOString().slice(0, 13);
  const indice = horas.findIndex((hora) => hora.startsWith(actual));
  return indice === -1 ? 0 : indice;
}
