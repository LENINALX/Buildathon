import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function normalizarCaleta(caleta) {
  return caleta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
}

export function useRiesgo(caleta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      if (!supabase) {
        if (activo) { setError("La conexión con el servicio no está configurada."); setCargando(false); }
        return;
      }
      setCargando(true);
      setError(null);
      const { data, error: errorFuncion } = await supabase.functions.invoke("evaluar-riesgo", { body: { ubicacion: normalizarCaleta(caleta) } });
      if (!activo) return;
      if (errorFuncion || !data?.nivel_riesgo || !Array.isArray(data?.mejores_horarios)) {
        setDatos(null);
        setError("No podemos confirmar las condiciones del mar ahora. No recomendamos zarpar sin una fuente oficial.");
      } else {
        setDatos({ ...data, actualizado_en: new Date(data.actualizado_en) });
      }
      setCargando(false);
    }
    cargar();
    return () => { activo = false; };
  }, [caleta, recarga]);

  return { datos, cargando, error, recargar: () => setRecarga((valor) => valor + 1) };
}
