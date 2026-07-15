export default function Landing({ onEntrar }) {
  return (
    <main className="landing-shell">
      <div className="landing-content">
        <nav className="landing-nav">
          <span className="landing-brand"><span aria-hidden="true">⚓</span> Pescador inteligente</span>
          <span className="landing-tag">Costa de Manabí</span>
        </nav>

        <section className="landing-hero">
          <p className="landing-eyebrow">TU COMPAÑERO ANTES DE ZARPAR</p>
          <h1>Pesca con más calma,<br /><em>decide con el mar.</em></h1>
          <p className="landing-copy">Consulta las condiciones de tu caleta en segundos y planifica una salida más segura para ti y tu tripulación.</p>
          <button className="landing-cta" onClick={onEntrar}>
            Ver condiciones del mar <span aria-hidden="true">→</span>
          </button>
          <p className="landing-note"><span aria-hidden="true">●</span> Datos meteorológicos actualizados durante el día</p>
        </section>

        <section className="landing-preview" aria-label="Resumen de información disponible">
          <div className="preview-top"><span>AHORA EN TU CALETA</span><span className="preview-status">● Consultando</span></div>
          <div className="preview-risk"><span className="preview-check">✓</span><div><small>RIESGO PARA ZARPAR</small><strong>Información clara</strong></div></div>
          <div className="preview-metrics"><span>≋ <b>Oleaje</b></span><span>〰 <b>Viento</b></span><span>◷ <b>Mejores horas</b></span></div>
        </section>

        <div className="landing-benefits">
          <span>◉ Riesgo fácil de entender</span><span>◉ Horas recomendadas</span><span>◉ Para pescadores locales</span>
        </div>
      </div>
    </main>
  );
}
