import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './HeaderClase.css';

function HeaderClase({ tituloTema, nombreDocente, horario }) {
  const [encendida, setEncendida] = useState(false);
  const [texto, setTexto] = useState('');
  const reducirMovimiento = useReducedMotion();

  function cambiarEncendido() {
    setEncendida((valor) => !valor);
    setTexto('');
  }

  function escribir(letra) {
    if (!encendida) return;
    setTexto((actual) => (actual + letra).slice(0, 12));
  }

  function comenzarClase() {
    const destino = document.getElementById('titulo-avance-clase');

    if (destino) {
      destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
      const seccion = destino.closest('aside') || destino;
      seccion.scrollIntoView({
        behavior: reducirMovimiento ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  }

  return (
    <header className="portada">
      <div className="portada-texto">
        <p className="portada-asignatura">
          Tecnología del Aprendizaje y la Comunicación
        </p>

        <p className="portada-nivel">Primero básico</p>

        <motion.h1
          initial={reducirMovimiento ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {tituloTema}
        </motion.h1>

        <p className="portada-descripcion">
          Una tecla, una instrucción, una respuesta.
          Descubre las piezas que hacen posible lo que ves en pantalla.
        </p>

        <button
          type="button"
          className="portada-comenzar"
          onClick={comenzarClase}
        >
          Comenzar clase <span aria-hidden="true">↗</span>
        </button>

        <div className="portada-datos">
          <span>{horario}</span>
          <span>Explora · Practica · Comparte</span>
        </div>

        <p className="portada-docente">
          Docente: {nombreDocente}
        </p>
      </div>

      <div className="portada-laboratorio">
        <div className="portada-demo-titulo">
          <span className="portada-demo-numero">LAB / 01</span>
          <span>Prueba antes de empezar</span>
        </div>

        <div className="portada-computadora">
          <div className="portada-monitor">
            <div className="portada-pantalla">
              {encendida ? (
                <motion.div
                  className="portada-escritorio"
                  initial={reducirMovimiento ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="portada-ventana-barra">
                    <span>Mi primera instrucción</span>
                    <span aria-hidden="true">— □</span>
                  </div>

                  <div className="portada-documento">
                    <p>Lo que escribes aparece aquí</p>

                    <div
                      className="portada-texto-pantalla"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      <span>{texto || '...'}</span>
                      <span
                        className="portada-cursor"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="portada-lineas" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="portada-apagada">
                  <svg
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M32 8 V30 M19 17 A22 22 0 1 0 45 17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Todo comienza con una acción</span>
                </div>
              )}
            </div>

            <div className="portada-monitor-base">
              <span>COMPUTACIÓN / BÁSICO</span>
              <span
                className={`portada-led ${encendida ? 'encendido' : ''}`}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="portada-soporte" aria-hidden="true" />
          <div className="portada-pie" aria-hidden="true" />

          <div
            className="portada-teclado"
            role="group"
            aria-label="Teclado de demostración"
          >
            {['H', 'O', 'L', 'A'].map((letra) => (
              <motion.button
                key={letra}
                type="button"
                disabled={!encendida || texto.length >= 12}
                aria-label={`Escribir ${letra}`}
                onClick={() => escribir(letra)}
                whileTap={
                  reducirMovimiento ? undefined : { y: 3, scale: 0.94 }
                }
              >
                {letra}
              </motion.button>
            ))}

            <button
              type="button"
              className="portada-borrar"
              disabled={!encendida || !texto}
              onClick={() => setTexto('')}
            >
              Borrar
            </button>
          </div>
        </div>

        <div className="portada-demo-controles">
          <button
            type="button"
            className="portada-encender"
            aria-pressed={encendida}
            onClick={cambiarEncendido}
          >
            {encendida ? 'Apagar demostración' : 'Encender computadora'}
          </button>

          <p role="status">
            {encendida
              ? 'Pulsa las teclas: introduces datos y el monitor los muestra.'
              : 'Enciende la computadora ilustrada para probar el teclado.'}
          </p>
        </div>

        <div className="portada-recorrido" aria-label="Proceso representado">
          <span>Teclado: entrada</span>
          <span aria-hidden="true">→</span>
          <span>Monitor: salida</span>
        </div>

        <p className="portada-demo-nota">
          El procesador ejecuta las instrucciones del programa y la RAM
          mantiene información en uso. Esta demostración simplifica el proceso.
        </p>
      </div>
    </header>
  );
}

export default HeaderClase;