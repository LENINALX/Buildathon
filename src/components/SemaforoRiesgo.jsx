const NIVELES = {
  bajo: { bg: "bg-green-50", texto: "text-green-700", circulo: "bg-green-500", icono: "✓" },
  moderado: { bg: "bg-amber-50", texto: "text-amber-700", circulo: "bg-amber-500", icono: "!" },
  alto: { bg: "bg-red-50", texto: "text-red-700", circulo: "bg-red-500", icono: "✕" },
};

export default function SemaforoRiesgo({ nivel, explicacion }) {
  const estilo = NIVELES[nivel] || NIVELES.moderado;

  return (
    <div className={`${estilo.bg} rounded-xl p-5 text-center mb-4`}>
      <div className={`w-16 h-16 rounded-full ${estilo.circulo} mx-auto mb-2 flex items-center justify-center text-white text-2xl font-medium`}>
        {estilo.icono}
      </div>
      <p className={`font-medium text-lg ${estilo.texto} capitalize`}>
        Riesgo {nivel}
      </p>
      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
        {explicacion}
      </p>
    </div>
  );
}