import { Fragment, useEffect, useState } from 'react';
import {
  ContextoProgreso, EXTERNAS, INTERNAS, practicaInicial,
  progresoInicial, validarProgreso,
} from './useProgresoClase';

const CLAVE = 'plan-computadora:avance:v1';

function recuperar() {
  try {
    return validarProgreso(JSON.parse(localStorage.getItem(CLAVE)));
  } catch {
    return progresoInicial();
  }
}

export default function ProgresoClase({ children }) {
  const [progreso, setProgreso] = useState(recuperar);
  const [guardado, setGuardado] = useState(false);
  const [sesion, setSesion] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(progreso));
      setGuardado(true);
    } catch {
      setGuardado(false);
    }
  }, [progreso]);

  function registrar(clave, id, permitidos) {
    if (!permitidos.includes(id)) return;
    setProgreso((actual) => actual[clave].includes(id) ? actual : {
      ...actual, [clave]: [...actual[clave], id],
    });
  }

  function actualizarPractica(cambio) {
    setProgreso((actual) => {
      const practica = cambio(actual.practica);
      return practica === actual.practica ? actual : { ...actual, practica };
    });
  }

  function reiniciarTodo() {
    setProgreso(progresoInicial());
    // Restablece también las selecciones y las ilustraciones abiertas.
    setSesion((actual) => actual + 1);
  }

  return (
    <ContextoProgreso.Provider value={{
      progreso, guardado,
      registrarExterna: (id) => registrar('externas', id, EXTERNAS),
      registrarInterna: (id) => registrar('internas', id, INTERNAS),
      actualizarPractica,
      reiniciarPractica: () => actualizarPractica(() => practicaInicial()),
      reiniciarTodo,
    }}>
      <Fragment key={sesion}>{children}</Fragment>
    </ContextoProgreso.Provider>
  );
}
