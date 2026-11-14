import EvaluacionForm from './EvaluacionForm';
import { useProgresoClase } from './useProgresoClase';
import { motion, useReducedMotion } from 'framer-motion';
import './PracticaComputadora.css';

const opciones = [
  { id: 'monitor', nombre: 'Monitor' },
  { id: 'teclado', nombre: 'Teclado' },
  { id: 'mouse', nombre: 'Mouse' },
  { id: 'gabinete', nombre: 'Gabinete' },
];

const retos = [
  {
    titulo: 'Tu primera presentación',
    situacion:
      'Estás preparando una presentación y necesitas escribir tu nombre. ¿Qué componente utilizas?',
    respuesta: 'teclado',
    pista: 'Busca el dispositivo que permite introducir letras y números.',
    explicacion:
      'El teclado permite ingresar texto. Sus teclas sirven para escribir tu nombre y el contenido de la presentación.',
  },
  {
    titulo: 'Elige una imagen',
    situacion:
      'Hay varias imágenes en la pantalla. Quieres mover el puntero y seleccionar una con un clic. ¿Qué componente utilizas?',
    respuesta: 'mouse',
    pista: 'Piensa en el dispositivo que mueves sobre la mesa para controlar el puntero.',
    explicacion:
      'El mouse permite mover el puntero y seleccionar elementos mediante clics.',
  },
  {
    titulo: 'Observa el resultado',
    situacion:
      'Tu compañero abre un video educativo. ¿Qué componente muestra las imágenes del video?',
    respuesta: 'monitor',
    pista: 'Necesitas un dispositivo de salida que muestre información visual.',
    explicacion:
      'El monitor muestra imágenes, textos y videos. Por eso es un dispositivo de salida.',
  },
  {
    titulo: 'Protege el interior',
    situacion:
      'Observas una computadora de escritorio. ¿Qué estructura contiene y protege la placa madre, la memoria RAM y el procesador?',
    respuesta: 'gabinete',
    pista: 'Es la estructura que suele tener forma de torre. No es el procesador.',
    explicacion:
      'El gabinete protege los componentes internos. El procesador es una de las piezas que están dentro de él.',
  },
];

export default function PracticaComputadora() {
  const { progreso, actualizarPractica, reiniciarPractica } = useProgresoClase();
  const { indice, seleccion, intentos, terminada } = progreso.practica;
  const reducirMovimiento = useReducedMotion();

  const reto = retos[indice];
  const acierto = seleccion === reto.respuesta;
  const respondidas = terminada
    ? retos.length
    : indice + (acierto ? 1 : 0);

  function responder(id) {
    actualizarPractica((actual) => {
      if (actual.terminada || actual.seleccion === retos[actual.indice].respuesta) return actual;
      return { ...actual, seleccion: id, intentos: actual.intentos + 1 };
    });
  }

  function siguiente() {
    actualizarPractica((actual) => {
      if (actual.terminada || actual.seleccion !== retos[actual.indice].respuesta) return actual;
      if (actual.indice === retos.length - 1) return { ...actual, terminada: true };
      return { ...actual, indice: actual.indice + 1, seleccion: '' };
    });
  }

  function reiniciar() {
    reiniciarPractica();
  }

  return (
    <section id="seccion-practica" className="practica" aria-labelledby="titulo-practica">
      <div className="metas-encabezado">
        <span className="metas-numero" aria-hidden="true">
          03
        </span>

        <div>
          <p className="metas-etiqueta">Aprende haciendo</p>
          <h2 id="titulo-practica">Ponlo en práctica</h2>
        </div>
      </div>

      <p className="practica-introduccion">
        Lee cada situación y elige el componente adecuado.
        Si te equivocas, usa la pista y vuelve a intentarlo. Al finalizar verás tu resultado y un repaso de las respuestas.
      </p>

      <div className="practica-avance">
        <label htmlFor="avance-practica">
          Retos resueltos: {respondidas} de {retos.length}
        </label>

        <progress
          id="avance-practica"
          value={respondidas}
          max={retos.length}
        />
      </div>

      {terminada ? (
        <EvaluacionForm
          retos={retos}
          opciones={opciones}
          intentos={intentos}
          onRepetir={reiniciar}
        />
      ) : (
        <div className="practica-reto">
          <div aria-live="polite" aria-atomic="true">
            <motion.div
              key={indice}
              className="practica-enunciado"
              initial={reducirMovimiento ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <span className="practica-numero" aria-hidden="true">
                {String(indice + 1).padStart(2, '0')}
              </span>

              <div>
                <p className="metas-etiqueta">
                  Reto {indice + 1} de {retos.length}
                </p>
                <h3>{reto.titulo}</h3>
                <p>{reto.situacion}</p>
              </div>
            </motion.div>
          </div>

          <div
            className="practica-opciones"
            role="group"
            aria-label="Elige un componente"
          >
            {opciones.map((opcion, posicion) => {
              const elegida = seleccion === opcion.id;
              const estado = elegida
                ? acierto
                  ? 'correcta'
                  : 'incorrecta'
                : '';

              return (
                <motion.button
                  key={opcion.id}
                  type="button"
                  className={`practica-opcion ${estado}`}
                  aria-pressed={elegida}
                  aria-disabled={acierto}
                  onClick={() => responder(opcion.id)}
                  whileHover={
                    reducirMovimiento || acierto ? undefined : { y: -4 }
                  }
                  whileTap={
                    reducirMovimiento || acierto
                      ? undefined
                      : { scale: 0.98 }
                  }
                >
                  <span className="practica-letra">
                    {String.fromCharCode(65 + posicion)}
                  </span>
                  {opcion.nombre}
                </motion.button>
              );
            })}
          </div>

          <div aria-live="polite" aria-atomic="true">
            {seleccion && (
              <motion.div
                key={`${indice}-${intentos}`}
                className={`practica-respuesta ${
                  acierto ? 'es-acierto' : 'es-pista'
                }`}
                initial={
                  reducirMovimiento ? false : { opacity: 0, y: 8 }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  x: reducirMovimiento || acierto
                    ? 0
                    : [0, -5, 5, -3, 0],
                }}
                transition={{ duration: 0.3 }}
              >
                <h4>{acierto ? '¡Correcto!' : 'Prueba otra opción'}</h4>
                <p>{acierto ? reto.explicacion : reto.pista}</p>
              </motion.div>
            )}
          </div>

          <div className="practica-controles">
            <button
              type="button"
              className="boton-actividad"
              disabled={!acierto}
              onClick={siguiente}
            >
              {indice === retos.length - 1
                ? 'Ver resultado de la práctica'
                : 'Siguiente reto'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}