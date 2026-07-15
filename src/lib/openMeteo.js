import { CALETAS } from "./caletas";

export async function obtenerDatosMar(nombreCaleta) {
  const coords = CALETAS[nombreCaleta];
  if (!coords) throw new Error(`Caleta no encontrada: ${nombreCaleta}`);

  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${coords.lat}&longitude=${coords.lon}&hourly=wave_height,wave_period,wave_direction,sea_surface_temperature&timezone=auto&forecast_days=1`;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=wind_speed_10m,wind_gusts_10m&timezone=auto&forecast_days=1`;

  const [marineRes, weatherRes] = await Promise.all([
    fetch(marineUrl),
    fetch(weatherUrl),
  ]);

  if (!marineRes.ok || !weatherRes.ok) {
    throw new Error("No se pudo obtener el clima marino");
  }

  const marine = await marineRes.json();
  const weather = await weatherRes.json();

  // Índice de la hora actual dentro del array horario
  const horaActualISO = new Date().toISOString().slice(0, 13);
  let indiceActual = marine.hourly.time.findIndex((t) =>
    t.startsWith(horaActualISO)
  );
  if (indiceActual === -1) indiceActual = 0;

  return {
    altura_ola: marine.hourly.wave_height[indiceActual],
    periodo_ola: marine.hourly.wave_period[indiceActual],
    direccion_ola: marine.hourly.wave_direction[indiceActual],
    temp_mar: marine.hourly.sea_surface_temperature[indiceActual],
    velocidad_viento: weather.hourly.wind_speed_10m[indiceActual],
    rafaga_viento: weather.hourly.wind_gusts_10m[indiceActual],
    // arrays completos de 24h, para calcular mejores horarios
    horas: marine.hourly.time,
    serie_altura_ola: marine.hourly.wave_height,
    serie_viento: weather.hourly.wind_speed_10m,
  };
}