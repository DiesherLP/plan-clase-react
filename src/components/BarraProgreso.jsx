import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { retosResueltos, useProgresoClase } from './useProgresoClase';
import './BarraProgreso.css';

export default function BarraProgreso() {
  const { progreso, guardado, reiniciarTodo } = useProgresoClase();
  const [confirmando, setConfirmando] = useState(false);
  const reducirMovimiento = useReducedMotion();
  const etapas = [
    { nombre: 'Exterior', cantidad: progreso.externas.length, total: 4, destino: 'seccion-externa' },
    { nombre: 'Interior', cantidad: progreso.internas.length, total: 3, destino: 'seccion-interna' },
    { nombre: 'Práctica', cantidad: retosResueltos(progreso.practica), total: 4, destino: 'seccion-practica' },
  ];
  const completadas = etapas.reduce((total, etapa) => total + etapa.cantidad, 0);
  const porcentaje = Math.round(completadas / 11 * 100);
  const siguiente = etapas.find((etapa) => etapa.cantidad < etapa.total);

  function irA(id) {
    const seccion = document.getElementById(id);
    if (!seccion) return;
    const titulo = seccion.querySelector('h2');
    if (titulo) {
      titulo.setAttribute('tabindex', '-1');
      titulo.focus({ preventScroll: true });
    }
    seccion.scrollIntoView({ behavior: reducirMovimiento ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <aside className="avance-clase" aria-labelledby="titulo-avance-clase">
      <div className="avance-clase-cabecera">
        <div>
          <h2 id="titulo-avance-clase">Tu recorrido</h2>
          <p>Explora, consulta y resuelve. Este avance no es una calificación.</p>
        </div>
        <strong className="avance-clase-porcentaje" aria-live="polite" aria-atomic="true">
          {porcentaje}<span>%</span>
        </strong>
      </div>

      <div className="avance-clase-medidor" role="progressbar"
        aria-label="Avance del recorrido" aria-valuemin={0} aria-valuemax={11}
        aria-valuenow={completadas} aria-valuetext={`${completadas} de 11 acciones completadas`}>
        <motion.div initial={false} animate={{ width: `${porcentaje}%` }}
          transition={{ duration: reducirMovimiento ? 0 : 0.35 }} />
      </div>

      <nav className="avance-clase-etapas" aria-label="Etapas del recorrido">
        {etapas.map((etapa, indice) => (
          <button key={etapa.destino} type="button" onClick={() => irA(etapa.destino)}
            className={etapa.cantidad === etapa.total ? 'etapa-completa' : ''}
            aria-label={`${etapa.nombre}: ${etapa.cantidad} de ${etapa.total}. Ir a esta sección`}>
            <span className="avance-clase-indice" aria-hidden="true">
              {etapa.cantidad === etapa.total ? '✓' : `0${indice + 1}`}
            </span>
            <span>{etapa.nombre}</span>
            <strong>{etapa.cantidad}/{etapa.total}</strong>
          </button>
        ))}
      </nav>

      <div className="avance-clase-pie">
        {siguiente ? (
          <button type="button" className="avance-clase-continuar" onClick={() => irA(siguiente.destino)}>
            Continuar: {siguiente.nombre} <span aria-hidden="true">→</span>
          </button>
        ) : (
          <p className="avance-clase-completo" role="status">Recorrido completado. Puedes volver a practicar.</p>
        )}
        <button className="avance-clase-reiniciar" type="button"
          aria-expanded={confirmando} aria-controls="confirmacion-reinicio"
          onClick={() => setConfirmando((actual) => !actual)}>
          Empezar de nuevo
        </button>
      </div>

      <p className="avance-clase-nota" role="status">
        {guardado
          ? 'Avance guardado en este navegador. Si otro estudiante usa el equipo, selecciona “Empezar de nuevo”.'
          : 'El avance no se está guardando en este navegador. Puedes continuar, pero se perderá al recargar.'}
      </p>

      <div id="confirmacion-reinicio" hidden={!confirmando} className="avance-clase-confirmacion">
        <p>Se borrarán el recorrido y los intentos de esta práctica en este navegador. ¿Quieres comenzar desde cero?</p>
        <div>
          <button type="button" className="avance-clase-confirmar" onClick={() => {
            reiniciarTodo();
            requestAnimationFrame(() => document.querySelector('.avance-clase-reiniciar')?.focus());
          }}>Sí, reiniciar recorrido</button>
          <button type="button" onClick={() => {
            setConfirmando(false);
            document.querySelector('.avance-clase-reiniciar')?.focus();
          }}>Conservar mi avance</button>
        </div>
      </div>
    </aside>
  );
}
