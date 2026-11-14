import { useProgresoClase } from './useProgresoClase';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const partes = [
  {
    id: 'monitor',
    nombre: 'Monitor',
    categoria: 'Dispositivo de salida',
    descripcion:
      'Muestra la información de la computadora mediante textos, imágenes y videos.',
    ejemplo:
      'Cuando lees las instrucciones de esta actividad, estás utilizando el monitor.',
    pregunta: '¿Qué información aparece ahora en tu monitor?',
  },
  {
    id: 'teclado',
    nombre: 'Teclado',
    categoria: 'Dispositivo de entrada',
    descripcion:
      'Permite introducir letras, números y símbolos. Algunas teclas también sirven para dar instrucciones.',
    ejemplo:
      'Para escribir tu nombre en una actividad, utilizas las teclas del teclado.',
    pregunta: '¿Qué tecla utilizarías para separar dos palabras?',
  },
  {
    id: 'mouse',
    nombre: 'Mouse',
    categoria: 'Dispositivo de entrada',
    descripcion:
      'Permite mover el puntero, seleccionar elementos y realizar acciones mediante clics.',
    ejemplo:
      'Cuando seleccionas una parte de la computadora en esta página, puedes hacerlo con el mouse.',
    pregunta: '¿Qué sucede con el puntero cuando mueves el mouse?',
  },
  {
    id: 'gabinete',
    nombre: 'Gabinete',
    categoria: 'Protección de componentes internos',
    descripcion:
      'Es la estructura que contiene y protege componentes como la placa madre, el procesador, la memoria RAM y la unidad de almacenamiento.',
    ejemplo:
      'En muchas computadoras de escritorio es la torre ubicada junto al monitor o debajo de la mesa.',
    pregunta:
      'El gabinete y el procesador no son lo mismo. ¿Cuál de los dos está dentro del otro?',
  },
];

function DibujoParte({ tipo }) {
  return (
    <svg
      viewBox="0 0 160 120"
      aria-hidden="true"
      focusable="false"
    >
      {tipo === 'monitor' && (
        <>
          <path
            d="M72 84 H88 V105 H72 Z"
            fill="#53676d"
          />

          <path
            d="M52 104 H108 V111 H52 Z"
            fill="#123642"
          />

          <rect
            x="15"
            y="12"
            width="130"
            height="78"
            fill="#123642"
          />

          <rect
            x="22"
            y="19"
            width="116"
            height="60"
            fill="#e3eeed"
          />

          <rect
            x="22"
            y="19"
            width="116"
            height="12"
            fill="#247b78"
          />

          <rect
            x="31"
            y="41"
            width="34"
            height="28"
            fill="#92bcb1"
          />

          <path
            d="M75 44 H126 M75 54 H118 M75 64 H122"
            stroke="#247b78"
            strokeWidth="5"
          />
        </>
      )}

      {tipo === 'teclado' && (
        <>
          <rect
            x="6"
            y="37"
            width="148"
            height="58"
            fill="#123642"
          />

          {[0, 1, 2].map((fila) =>
            Array.from({ length: 10 }, (_, columna) => (
              <rect
                key={`${fila}-${columna}`}
                x={14 + columna * 13}
                y={45 + fila * 12}
                width="9"
                height="8"
                fill="#e3eeed"
              />
            ))
          )}

          <rect
            x="47"
            y="82"
            width="65"
            height="6"
            fill="#e8bd54"
          />
        </>
      )}

      {tipo === 'mouse' && (
        <>
          <path
            d="M80 30 V18 Q80 7 105 7"
            fill="none"
            stroke="#53676d"
            strokeWidth="4"
          />

          <rect
            x="49"
            y="28"
            width="62"
            height="80"
            rx="30"
            fill="#123642"
          />

          <path
            d="M80 30 V62 M51 63 H109"
            stroke="#92bcb1"
            strokeWidth="2"
          />

          <rect
            x="76"
            y="39"
            width="8"
            height="17"
            rx="4"
            fill="#e8bd54"
          />
        </>
      )}

      {tipo === 'gabinete' && (
        <>
          <path
            d="M45 12 H105 L120 23 V108 H45 Z"
            fill="#123642"
          />

          <path
            d="M105 12 L120 23 V108 H105 Z"
            fill="#53676d"
          />

          <rect
            x="54"
            y="24"
            width="42"
            height="10"
            fill="#92bcb1"
          />

          <rect
            x="54"
            y="41"
            width="42"
            height="5"
            fill="#53676d"
          />

          <circle
            cx="75"
            cy="62"
            r="7"
            fill="#e8bd54"
          />

          <path
            d="M56 82 H94 M56 89 H94 M56 96 H94"
            stroke="#92bcb1"
            strokeWidth="3"
          />
        </>
      )}
    </svg>
  );
}

export default function ExploradorComputadora() {
  const [seleccionada, setSeleccionada] = useState('monitor');
  const { progreso, registrarExterna } = useProgresoClase();
  const visitadas = progreso.externas;

  const reducirMovimiento = useReducedMotion();

  const parteActual = partes.find(
    (parte) => parte.id === seleccionada
  );

  function seleccionarParte(id) {
    setSeleccionada(id);

    registrarExterna(id);
  }

  return (
    <section
      id="seccion-externa"
      className="explorador"
      aria-labelledby="titulo-explorador"
    >
      <div className="metas-encabezado">
        <span
          className="metas-numero"
          aria-hidden="true"
        >
          02
        </span>

        <div>
          <p className="metas-etiqueta">
            Observa y descubre
          </p>

          <h2 id="titulo-explorador">
            Explora tu computadora
          </h2>
        </div>
      </div>

      <p className="explorador-instruccion">
        Selecciona cada componente para descubrir su función.
        También puedes usar Tab y Enter para recorrer las opciones.
      </p>

      <div className="explorador-opciones">
        {partes.map((parte, indice) => (
          <motion.button
            key={parte.id}
            type="button"
            className="explorador-opcion"
            aria-pressed={seleccionada === parte.id}
            aria-controls="detalle-componente"
            onClick={() => seleccionarParte(parte.id)}
            initial="reposo"
            animate={
              seleccionada === parte.id
                ? 'seleccionado'
                : 'reposo'
            }
            whileHover={
              reducirMovimiento ? undefined : 'activo'
            }
            whileFocus={
              reducirMovimiento ? undefined : 'activo'
            }
            whileTap={
              reducirMovimiento
                ? undefined
                : { scale: 0.97 }
            }
          >
            <span className="explorador-indice">
              {String(indice + 1).padStart(2, '0')}
            </span>

            <motion.div
              variants={{
                reposo: {
                  y: 0,
                  rotate: 0,
                  scale: 1,
                },

                seleccionado: {
                  y: reducirMovimiento ? 0 : -5,
                  rotate: 0,
                  scale: reducirMovimiento ? 1 : 1.06,
                },

                activo: {
                  y: reducirMovimiento ? 0 : -10,
                  rotate: reducirMovimiento
                    ? 0
                    : parte.id === 'teclado'
                      ? -4
                      : parte.id === 'mouse'
                        ? 6
                        : -2,
                  scale: reducirMovimiento ? 1 : 1.08,
                },
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 18,
              }}
            >
              <DibujoParte tipo={parte.id} />
            </motion.div>

            <span className="explorador-nombre">
              {parte.nombre}
            </span>

            <span className="explorador-estado">
              {visitadas.includes(parte.id)
                ? 'Explorado'
                : 'Por explorar'}
            </span>
          </motion.button>
        ))}
      </div>

      <div
        id="detalle-componente"
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.div
          key={parteActual.id}
          className="explorador-detalle"
          initial={
            reducirMovimiento
              ? false
              : { opacity: 0, y: 10 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="explorador-explicacion">
            <p className="metas-etiqueta">
              {parteActual.categoria}
            </p>

            <h3>{parteActual.nombre}</h3>

            <p>{parteActual.descripcion}</p>
          </div>

          <div className="explorador-ejemplo">
            <h4>En tu día a día</h4>
            <p>{parteActual.ejemplo}</p>

            <h4>Piensa un momento</h4>
            <p>{parteActual.pregunta}</p>
          </div>
        </motion.div>
      </div>

      <div className="explorador-progreso">
        <label htmlFor="progreso-exploracion">
          Componentes explorados: {visitadas.length} de {partes.length}
        </label>

        <progress
          id="progreso-exploracion"
          value={visitadas.length}
          max={partes.length}
        />

        {visitadas.length === partes.length && (
          <p role="status">
            Ya recorriste los cuatro componentes.
            Puedes volver a consultarlos.
          </p>
        )}
      </div>
    </section>
  );
}