import { motion, useReducedMotion } from 'framer-motion';
import './EvaluacionForm.css';

// Evaluación formativa de la práctica: no envía datos ni necesita otra tabla.
export default function EvaluacionForm({ retos, opciones, intentos, onRepetir }) {
  const reducirMovimiento = useReducedMotion();
  const incorrectas = Math.max(0, intentos - retos.length);
  const nombres = Object.fromEntries(opciones.map(({ id, nombre }) => [id, nombre]));

  return (
    <motion.div
      className="evaluacion-cierre"
      initial={reducirMovimiento ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div role="status" aria-live="polite">
        <p className="metas-etiqueta">Resultado de tu práctica</p>
        <h3>Cuatro funciones que ya puedes reconocer</h3>
        <p>
          {incorrectas === 0
            ? 'Resolviste todos los retos sin respuestas incorrectas. Ahora explica con tus palabras para qué sirve cada componente.'
            : 'Completaste los retos después de practicar con las pistas. Repasa las explicaciones y vuelve a intentarlo cuando te sientas preparado.'}
        </p>
        <dl className="evaluacion-datos">
          <div><dt>Retos resueltos</dt><dd>{retos.length}/{retos.length}</dd></div>
          <div><dt>Intentos totales</dt><dd>{intentos}</dd></div>
          <div><dt>Respuestas incorrectas</dt><dd>{incorrectas}</dd></div>
        </dl>
        <p className="evaluacion-nota">
          Este resultado incluye tus reintentos. Completar los retos no equivale a
          acertarlos todos a la primera ni representa una calificación oficial.
        </p>
      </div>

      <h4>Repasa lo que aprendiste</h4>
      <ol className="evaluacion-repaso">
        {retos.map((reto) => (
          <li key={reto.respuesta}>
            <details>
              <summary>{reto.titulo}: {nombres[reto.respuesta]}</summary>
              <p>{reto.explicacion}</p>
            </details>
          </li>
        ))}
      </ol>

      <div className="evaluacion-transferencia">
        <h4>Conecta las piezas</h4>
        <p>
          Para escribir una presentación introduces texto con el teclado y ves el
          resultado en el monitor. Dentro del gabinete, el procesador ejecuta las
          instrucciones y la RAM mantiene información en uso. Al guardar el archivo,
          el almacenamiento permite conservarlo después de apagar el equipo.
        </p>
      </div>

      <div className="evaluacion-acciones">
        <button type="button" className="boton-actividad" onClick={onRepetir}>
          Repetir práctica
        </button>
        <a href="#seccion-externa">Repasar componentes externos</a>
      </div>
      <p className="evaluacion-nota">
        Al repetir, se reinician únicamente estos cuatro retos y sus intentos.
        Tu recorrido por los componentes se conserva.
      </p>
    </motion.div>
  );
}
