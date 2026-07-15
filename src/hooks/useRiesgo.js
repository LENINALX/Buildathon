import { useState, useEffect } from "react";

export function useRiesgo(caleta) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        // Cuando tengan el backend de Supabase listo, reemplacen esta URL
      import mockDatos from "../mock/datos.mock.json";

      // ...dentro del useEffect:
      await new  Promise((r) => setTimeout(r, 500)); // simula carga
        setDatos(mockDatos);
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