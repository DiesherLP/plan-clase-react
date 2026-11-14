function ObjetivosCard({ competencia, indicadorLogro }) {
  return (
    <section className="metas-sesion" aria-labelledby="titulo-metas">
      <div className="metas-encabezado">
        <span className="metas-numero" aria-hidden="true">
          01
        </span>

        <div>
          <p className="metas-etiqueta">Nuestro punto de partida</p>
          <h2 id="titulo-metas">¿Qué vas a aprender?</h2>
        </div>
      </div>

      <div className="metas-contenido">
        <div className="meta">
          <h3>Tu objetivo</h3>
          <p>{competencia}</p>
        </div>

        <div className="meta">
          <h3>Al finalizar podrás</h3>
          <p>{indicadorLogro}</p>
        </div>
      </div>
    </section>
  );
}

export default ObjetivosCard;