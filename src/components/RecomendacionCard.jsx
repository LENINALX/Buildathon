export default function RecomendacionCard({ titulo, texto, tipo }) {
  return (
    <section className={`mb-3 rounded-2xl border p-4 shadow-[0_8px_18px_rgba(25,75,85,0.05)] ${tipo === "boletin" ? "border-[#cbddea] bg-[#f4faff]" : tipo === "alerta" ? "border-[#f0c5b8] bg-[#fff2ed]" : "border-[#eedcae] bg-[#fffaf0]"}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-full text-sm ${tipo === "boletin" ? "bg-[#dceefa]" : tipo === "alerta" ? "bg-[#ffd9cb]" : "bg-[#ffe9ae]"}`} aria-hidden="true">{tipo === "boletin" ? "◉" : tipo === "alerta" ? "!" : "💡"}</span>
        <p className={`text-xs font-extrabold uppercase tracking-[0.1em] ${tipo === "boletin" ? "text-[#35718b]" : tipo === "alerta" ? "text-[#a94d39]" : "text-[#9a6814]"}`}>{titulo}</p>
      </div>
      <p className="text-sm leading-relaxed text-[#24414b]">{texto}</p>
    </section>
  );
}
