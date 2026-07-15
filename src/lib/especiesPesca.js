export function sugerirEspecies({ temp_mar, nivel_riesgo }) {
  if (nivel_riesgo === "alto") {
    return { especies: [], aviso: "Con riesgo alto no sugerimos especies: la prioridad es no salir al mar." };
  }

  if (temp_mar >= 26) {
    return { especies: ["Dorado", "Sierra", "Atún"], aviso: "Referencia por aguas cálidas y condiciones actuales." };
  }
  if (temp_mar >= 23) {
    return { especies: ["Corvina", "Sierra", "Pargo"], aviso: "Referencia para condiciones costeras templadas de Manabí." };
  }
  return { especies: ["Corvina", "Pargo", "Camotillo"], aviso: "Referencia para aguas más frescas y pesca costera." };
}
