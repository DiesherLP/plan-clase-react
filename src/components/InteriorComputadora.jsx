import { useProgresoClase } from './useProgresoClase';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './InteriorComputadora.css';

const componentes = [
  {
    id: 'procesador',
    nombre: 'Procesador',
    nombreCorto: 'CPU',
    funcion: 'Ejecuta instrucciones',
    descripcion:
      'Realiza cálculos y ejecuta las instrucciones de los programas. Trabaja junto con la memoria y los demás componentes.',
    ejemplo:
      'Cuando una hoja de cálculo suma dos cantidades, el procesador ejecuta las instrucciones necesarias para obtener el resultado.',
    recordatorio:
      'El procesador es una pieza dentro del gabinete. No es el nombre de toda la torre.',
  },
  {
    id: 'ram',
    nombre: 'Memoria RAM',
    nombreCorto: 'RAM',
    funcion: 'Mantiene datos en uso',
    descripcion:
      'Mantiene temporalmente los datos y las instrucciones que los programas necesitan mientras están funcionando.',
    ejemplo:
      'Mientras editas una presentación, parte de la información con la que trabajas se mantiene en la memoria RAM.',
    recordatorio:
      'Su contenido se pierde cuando se interrumpe la energía. Por eso es importante guardar tu trabajo.',
  },
  {
    id: 'almacenamiento',
    nombre: 'Almacenamiento',
    nombreCorto: 'SSD',
    funcion: 'Conserva archivos',
    descripcion:
      'Conserva los programas y los archivos guardados, incluso cuando apagas la computadora. Puede ser una unidad SSD o un disco duro.',
    ejemplo:
      'Cuando guardas una presentación en la unidad de tu computadora, podrás abrirla después de apagar y encender el equipo.',
    recordatorio:
      'Guardar archivos es diferente de mantener información temporalmente en la memoria RAM.',
  },
];

export default function InteriorComputadora() {
  const [abierto, setAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState('procesador');
  const reducirMovimiento = useReducedMotion();
  const { progreso, registrarInterna } = useProgresoClase();

  const componente = componentes.find(
    (elemento) => elemento.id === seleccionado
  );

  function elegirComponente(id) {
    setSeleccionado(id);
    registrarInterna(id);
  }

  function colorPieza(id) {
    return seleccionado === id ? '#e8bd54' : '#92bcb1';
  }

  return (
    <section
      id="seccion-interna"
      className="interior"
      aria-labelledby="titulo-interior"
    >
      <div className="interior-titulo">
        <p className="metas-etiqueta">Exploración del interior</p>
        <h2 id="titulo-interior">¿Qué hay dentro del gabinete?</h2>
        <p>
          La computadora tiene piezas que no vemos a simple vista.
          Abre esta ilustración y descubre tres de ellas.
        </p>
      </div>

      <div className="interior-distribucion">
        <div className="interior-modelo">
          <div className="interior-dibujo">
            <svg
              viewBox="0 0 360 400"
              role="img"
              aria-label={
                abierto
                  ? `Gabinete abierto. Se destaca: ${componente.nombre}.`
                  : 'Gabinete cerrado'
              }
            >
              {/* Estructura del gabinete */}
              <path
                d="M65 25 H282 L305 48 V370 H65 Z"
                fill="#123642"
              />
              <path
                d="M282 25 L305 48 V370 H282 Z"
                fill="#53676d"
              />

              {/* Placa madre */}
              <rect
                x="82"
                y="48"
                width="184"
                height="240"
                fill="#315e60"
              />

              {/* Conexiones simplificadas */}
              <path
                d="M155 125 V220 H231
                   M155 175 H110 V260
                   M195 125 H230
                   M155 220 V318"
                fill="none"
                stroke="#6faaa3"
                strokeWidth="5"
              />

              {/* Procesador */}
              <rect
                x="115"
                y="86"
                width="80"
                height="80"
                fill="#123642"
                stroke={colorPieza('procesador')}
                strokeWidth={seleccionado === 'procesador' ? 5 : 2}
              />
              <rect
                x="130"
                y="101"
                width="50"
                height="50"
                fill={colorPieza('procesador')}
              />
              <text
                x="155"
                y="131"
                textAnchor="middle"
                fill="#123642"
                fontSize="16"
                fontWeight="700"
              >
                CPU
              </text>

              {/* Memoria RAM */}
              <rect
                x="218"
                y="78"
                width="24"
                height="130"
                fill={colorPieza('ram')}
              />
              {[90, 115, 140, 165].map((y) => (
                <rect
                  key={y}
                  x="223"
                  y={y}
                  width="14"
                  height="17"
                  fill="#123642"
                />
              ))}

              {/* Almacenamiento */}
              <rect
                x="104"
                y="302"
                width="142"
                height="48"
                fill={colorPieza('almacenamiento')}
              />
              <text
                x="175"
                y="332"
                textAnchor="middle"
                fill="#123642"
                fontSize="18"
                fontWeight="700"
              >
                SSD
              </text>

              {/* Tapa que se retira */}
              <motion.g
                initial={false}
                animate={{
                  x: abierto && !reducirMovimiento ? -42 : 0,
                  opacity: abierto ? 0 : 1,
                }}
                transition={{
                  duration: reducirMovimiento ? 0 : 0.45,
                }}
              >
                <rect
                  x="76"
                  y="38"
                  width="198"
                  height="320"
                  fill="#247b78"
                />
                <path
                  d="M104 90 H246 M104 108 H246 M104 126 H246"
                  stroke="#92bcb1"
                  strokeWidth="6"
                />
                <circle cx="175" cy="265" r="18" fill="#e8bd54" />
                <path
                  d="M175 253 V267"
                  stroke="#123642"
                  strokeWidth="3"
                />
              </motion.g>
            </svg>
          </div>

          <button
            type="button"
            className="interior-boton"
            aria-expanded={abierto}
            aria-controls="interior-contenido"
            onClick={() => {
              if (!abierto) registrarInterna(seleccionado);
              setAbierto((valor) => !valor);
            }}
          >
            {abierto ? 'Cerrar ilustración' : 'Explorar el interior'}
          </button>

          <p className="interior-nota">
            Esquema simplificado. La ubicación y forma de las piezas
            varían según el equipo.
          </p>
        </div>

        <div className="interior-informacion" id="interior-contenido">
          {abierto ? (
            <>
              <div
                className="interior-selector"
                role="group"
                aria-label="Selecciona un componente interno"
              >
                {componentes.map((elemento) => (
                  <button
                    key={elemento.id}
                    type="button"
                    aria-pressed={seleccionado === elemento.id}
                    onClick={() => elegirComponente(elemento.id)}
                  >
                    {elemento.nombreCorto}
                    {progreso.internas.includes(elemento.id) && (
                      <span aria-label="Consultado"> ✓</span>
                    )}
                  </button>
                ))}
              </div>

              <div aria-live="polite" aria-atomic="true">
                <motion.div
                  key={componente.id}
                  initial={
                    reducirMovimiento ? false : { opacity: 0, y: 12 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="interior-funcion">
                    {componente.funcion}
                  </p>

                  <h3>{componente.nombre}</h3>
                  <p>{componente.descripcion}</p>

                  <div className="interior-ejemplo">
                    <h4>Un ejemplo cercano</h4>
                    <p>{componente.ejemplo}</p>
                  </div>

                  <p className="interior-recordatorio">
                    {componente.recordatorio}
                  </p>
                </motion.div>
              </div>
            </>
          ) : (
            <div className="interior-invitacion">
              <span aria-hidden="true">?</span>
              <h3>Por fuera ves una torre.</h3>
              <p>
                Por dentro, varios componentes trabajan juntos.
                Pulsa “Explorar el interior” para conocerlos.
              </p>
            </div>
          )}
        </div>
      </div>

      <p role="status">
        Componentes internos consultados: {progreso.internas.length} de 3.
      </p>

      {abierto && (
        <div className="interior-comparacion">
          <h3>Una diferencia importante</h3>
          <p>
            La RAM mantiene información temporal mientras trabajas.
            El almacenamiento conserva los archivos que guardas.
            El procesador ejecuta las instrucciones de los programas.
          </p>
        </div>
      )}
    </section>
  );
}