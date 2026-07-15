export function clasificarRiesgo(altura_ola, velocidad_viento) {
  if (altura_ola < 1.0 && velocidad_viento < 15) return "bajo";
  if (altura_ola <= 1.8 && velocidad_viento <= 25) return "moderado";
  return "alto";
}

export function direccionComoTexto(grados) {
  if (grados === null || grados === undefined) return "No disponible";
  const direcciones = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return direcciones[Math.round(Number(grados) / 45) % 8];
}

export function calcularMejoresHorarios(serie_altura_ola, serie_viento, horas) {
  const puntuaciones = horas.map((hora, i) => ({
    hora,
    puntuacion: serie_altura_ola[i] + serie_viento[i] / 20,
  }));

  const mejores = puntuaciones
    .sort((a, b) => a.puntuacion - b.puntuacion)
    .slice(0, 2)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  return mejores.map((m) => {
    const h = new Date(m.hora).getHours();
    const hFin = (h + 2) % 24;
    return `${String(h).padStart(2, "0")}:00-${String(hFin).padStart(2, "0")}:00`;
  });
}

const MENSAJES = {
  bajo: "El mar está tranquilo hoy. Buenas condiciones para salir a pescar.",
  moderado: "El mar está algo agitado hoy. No es un día imposible, pero hay que tener cuidado, especialmente en botes pequeños.",
  alto: "El mar está peligroso hoy. Se recomienda no salir a pescar hasta que las condiciones mejoren.",
};

const RECOMENDACIONES = {
  bajo: "Es un buen día para salir, aprovecha las horas de la mañana.",
  moderado: "Sal temprano en la mañana y evita alejarte más de lo habitual de la costa.",
  alto: "Evita salir al mar hoy. Consulta el boletín de INOCAR antes de cualquier actividad.",
};

export function generarExplicacion(nivel, { altura_ola, velocidad_viento, rafaga_viento }) {
  const datos = `Oleaje: ${altura_ola} m · Viento: ${velocidad_viento} km/h · Ráfagas: ${rafaga_viento} km/h.`;
  return {
    explicacion: `${MENSAJES[nivel]} ${datos}`,
    recomendacion: RECOMENDACIONES[nivel],
  };
}
