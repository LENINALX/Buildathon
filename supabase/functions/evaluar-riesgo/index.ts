import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { obtenerDatosMar } from "./mareas.ts";

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const respuestaSchema = {
  name: "consejo_capitan_seguro",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      mensaje: { type: "string" },
      checklist: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
      pregunta_sugerida: { type: "string" },
    },
    required: ["mensaje", "checklist", "pregunta_sugerida"],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!OPENAI_KEY) return json({ error: "El asistente no está configurado" }, 503);

  try {
    const { ubicacion = "manta" } = await req.json();
    const datos = await obtenerDatosMar(ubicacion);
    const nivel_riesgo = clasificarRiesgo(datos.altura_ola, datos.velocidad_viento);
    const mejores_horas = calcularMejoresHoras(datos.horas, datos.serie_altura_ola, datos.serie_viento);

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") || "gpt-5-mini",
        messages: [
          { role: "system", content: "Eres Capitán Seguro, asistente de seguridad para pesca artesanal en Manabí. Explicas datos en español sencillo. No cambias el nivel de riesgo calculado ni afirmas que sea seguro zarpar. Si el riesgo es alto, refuerzas que no se debe salir." },
          { role: "user", content: `Datos confirmados de ${ubicacion}: riesgo calculado ${nivel_riesgo}; oleaje ${datos.altura_ola} m; período ${datos.periodo_ola} s; viento ${datos.velocidad_viento} km/h; ráfagas ${datos.rafaga_viento} km/h; mejores ventanas ${mejores_horas}. Genera un consejo breve basado solo en estos datos.` },
        ],
        response_format: { type: "json_schema", json_schema: respuestaSchema },
      }),
    });
    if (!gptRes.ok) throw new Error("OpenAI no respondió correctamente");
    const gptData = await gptRes.json();
    const ia = validarRespuesta(JSON.parse(gptData.choices?.[0]?.message?.content ?? ""));

    // El registro no debe impedir que el pescador reciba el consejo si la bitácora falla.
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      await supabase.from("reportes").insert({ ubicacion, lat: datos.lat, lon: datos.lon, ola_altura: datos.altura_ola, ola_periodo: datos.periodo_ola, viento_velocidad: datos.velocidad_viento, viento_direccion: datos.direccion_ola, temp_mar: datos.temp_mar, nivel_riesgo, mejores_horas, explicacion: ia.mensaje, raw_data: datos });
    }

    return json({ ubicacion, nivel_riesgo, mejores_horas, datos, ...ia });
  } catch (error) {
    return json({ error: "El Capitán Seguro no está disponible. Consulta las condiciones y fuentes oficiales." }, 503);
  }
});

function clasificarRiesgo(ola: number, viento: number) { if (ola < 1 && viento < 15) return "bajo"; if (ola <= 1.8 && viento <= 25) return "moderado"; return "alto"; }
function calcularMejoresHoras(horas: string[], olas: number[], vientos: number[]) { return horas.map((hora, i) => ({ hora, puntuacion: olas[i] + vientos[i] / 20 })).sort((a, b) => a.puntuacion - b.puntuacion).slice(0, 2).map(({ hora }) => new Date(hora).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })).join(" y "); }
function validarRespuesta(valor: unknown) { const r = valor as { mensaje?: unknown; checklist?: unknown; pregunta_sugerida?: unknown }; if (typeof r?.mensaje !== "string" || !Array.isArray(r.checklist) || !r.checklist.every((item) => typeof item === "string") || typeof r.pregunta_sugerida !== "string") throw new Error("Respuesta estructurada inválida"); return { mensaje: r.mensaje, checklist: r.checklist, pregunta_sugerida: r.pregunta_sugerida }; }
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(), "Content-Type": "application/json" } }); }
function corsHeaders() { return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" }; }
