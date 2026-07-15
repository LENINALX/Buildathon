import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { obtenerDatosMar } from "./mareas.ts";

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const respuestaSchema = { name: "consejo_capitan_seguro", strict: true, schema: { type: "object", additionalProperties: false, properties: { explicacion: { type: "string" }, recomendacion: { type: "string" }, checklist: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 }, pregunta_sugerida: { type: "string" } }, required: ["explicacion", "recomendacion", "checklist", "pregunta_sugerida"] } };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!OPENAI_KEY) return json({ error: "El asistente no está configurado" }, 503);
  try {
    const { ubicacion = "manta" } = await req.json();
    const datos = await obtenerDatosMar(ubicacion);
    const nivel_riesgo = clasificarRiesgo(datos.altura_ola, datos.velocidad_viento, datos.rafaga_viento);
    const mejores_horarios = calcularMejoresHorarios(datos.horas, datos.serie_altura_ola, datos.serie_viento);
    const pronostico = construirPronostico(datos.horas, datos.serie_altura_ola, datos.serie_viento);
    const ia = await generarConsejo(ubicacion, datos, nivel_riesgo, mejores_horarios);
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await supabase.from("reportes").insert({ ubicacion, lat: datos.lat, lon: datos.lon, ola_altura: datos.altura_ola, ola_periodo: datos.periodo_ola, viento_velocidad: datos.velocidad_viento, viento_direccion: datos.direccion_ola, temp_mar: datos.temp_mar, nivel_riesgo, mejores_horas: mejores_horarios.join(" y "), explicacion: ia.explicacion, raw_data: datos });
    }
    return json({ nivel_riesgo, explicacion: ia.explicacion, recomendacion: ia.recomendacion, altura_ola: datos.altura_ola, velocidad_viento: datos.velocidad_viento, rafaga_viento: datos.rafaga_viento, temp_mar: datos.temp_mar, periodo_ola: datos.periodo_ola, direccion_ola: direccionComoTexto(datos.direccion_ola), mejores_horarios, pronostico, actualizado_en: new Date().toISOString(), boletin_inocar: null, capitan_seguro: ia });
  } catch { return json({ error: "No fue posible confirmar las condiciones del mar. No recomendamos zarpar sin una fuente oficial." }, 503); }
});

async function generarConsejo(ubicacion: string, datos: Awaited<ReturnType<typeof obtenerDatosMar>>, nivel: string, horarios: string[]) {
  const respuesta = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` }, body: JSON.stringify({ model: Deno.env.get("OPENAI_MODEL") || "gpt-5-mini", messages: [{ role: "system", content: "Eres Capitán Seguro, asistente de seguridad para pescadores artesanales de Manabí. Escribe en español claro y breve. No inventes información, no contradigas el nivel de riesgo calculado y no afirmes que sea seguro zarpar. Si el riesgo es alto, recomienda no salir." }, { role: "user", content: `Datos confirmados de ${ubicacion}: riesgo ${nivel}; oleaje ${datos.altura_ola} m; período ${datos.periodo_ola} s; viento ${datos.velocidad_viento} km/h; ráfagas ${datos.rafaga_viento} km/h; mejores horarios ${horarios.join(", ")}. Genera el consejo solo con estos datos.` }], response_format: { type: "json_schema", json_schema: respuestaSchema } }) });
  if (!respuesta.ok) throw new Error("OpenAI no respondió correctamente");
  const body = await respuesta.json();
  return validarRespuesta(JSON.parse(body.choices?.[0]?.message?.content ?? ""));
}
function clasificarRiesgo(ola: number, viento: number, rafaga: number) { if (ola < 1 && viento < 15 && rafaga < 22) return "bajo"; if (ola <= 1.8 && viento <= 25 && rafaga <= 32) return "moderado"; return "alto"; }
function clasificarRiesgoPronostico(ola: number, viento: number) { if (ola < 1 && viento < 15) return "bajo"; if (ola <= 1.8 && viento <= 25) return "moderado"; return "alto"; }
function indiceHoraActual(horas: string[]) { const ahora = new Date().toISOString().slice(0, 13); const indice = horas.findIndex((hora) => hora.startsWith(ahora)); return indice === -1 ? 0 : indice; }
function horaLocal(iso: string) { return new Date(iso).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }); }
function calcularMejoresHorarios(horas: string[], olas: number[], vientos: number[]) { return horas.map((hora, i) => ({ hora, puntuacion: olas[i] + vientos[i] / 20 })).sort((a, b) => a.puntuacion - b.puntuacion).slice(0, 2).sort((a, b) => a.hora.localeCompare(b.hora)).map(({ hora }) => { const inicio = new Date(hora); const fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000); return `${horaLocal(inicio.toISOString())}-${horaLocal(fin.toISOString())}`; }); }
function construirPronostico(horas: string[], olas: number[], vientos: number[]) { const inicio = indiceHoraActual(horas); return horas.slice(inicio, inicio + 5).map((hora, i) => ({ hora: horaLocal(hora), ola: olas[inicio + i], viento: vientos[inicio + i], riesgo: clasificarRiesgoPronostico(olas[inicio + i], vientos[inicio + i]) })); }
function direccionComoTexto(grados: number) { const direcciones = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]; return direcciones[Math.round(grados / 45) % 8]; }
function validarRespuesta(valor: unknown) { const r = valor as { explicacion?: unknown; recomendacion?: unknown; checklist?: unknown; pregunta_sugerida?: unknown }; if (typeof r?.explicacion !== "string" || typeof r.recomendacion !== "string" || !Array.isArray(r.checklist) || !r.checklist.every((item) => typeof item === "string") || typeof r.pregunta_sugerida !== "string") throw new Error("Respuesta estructurada inválida"); return { explicacion: r.explicacion, recomendacion: r.recomendacion, checklist: r.checklist, pregunta_sugerida: r.pregunta_sugerida }; }
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(), "Content-Type": "application/json" } }); }
function corsHeaders() { return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" }; }
