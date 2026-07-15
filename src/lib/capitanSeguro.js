import { supabase } from "./supabase";

export async function consultarCapitanSeguro(caleta) {
  if (!supabase) throw new Error("El asistente no está configurado todavía.");

  const ubicacion = caleta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
  const { data, error } = await supabase.functions.invoke("evaluar-riesgo", { body: { ubicacion } });
  if (error) throw new Error("El Capitán Seguro no está disponible ahora. Usa las condiciones mostradas y fuentes oficiales.");
  if (!data?.mensaje || !Array.isArray(data?.checklist)) throw new Error("La respuesta del asistente no pudo validarse.");
  return data;
}
