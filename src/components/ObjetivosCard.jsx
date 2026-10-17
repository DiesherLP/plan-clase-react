function ObjetivosCard({ competencia, indicadorLogro }) {
    return (
        <section style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
            <h2>Metas de la sesión</h2>
            <p><strong>Competencia:</strong> {competencia}</p>
            <p><strong>Indicador de logro:</strong> {indicadorLogro}</p>
        </section>
    );
}

export default ObjetivosCard;