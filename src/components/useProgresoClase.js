import { createContext, useContext } from 'react';

export const ContextoProgreso = createContext(null);

export function useProgresoClase() {
  const contexto = useContext(ContextoProgreso);
  if (!contexto) throw new Error('Este componente debe estar dentro de ProgresoClase.');
  return contexto;
}

export const EXTERNAS = ['monitor', 'teclado', 'mouse', 'gabinete'];
export const INTERNAS = ['procesador', 'ram', 'almacenamiento'];
export const RESPUESTAS = ['teclado', 'mouse', 'monitor', 'gabinete'];

export function practicaInicial() {
  return { indice: 0, seleccion: '', intentos: 0, terminada: false };
}

export function progresoInicial() {
  return { version: 1, externas: [], internas: [], practica: practicaInicial() };
}

export function retosResueltos(practica) {
  return practica.terminada ? 4 : practica.indice +
    (practica.seleccion === RESPUESTAS[practica.indice] ? 1 : 0);
}

// Recupera únicamente datos válidos de esta versión de la clase.
export function validarProgreso(datos) {
  const limpio = progresoInicial();
  if (!datos || datos.version !== 1) return limpio;
  for (const [clave, permitidos] of [['externas', EXTERNAS], ['internas', INTERNAS]]) {
    if (Array.isArray(datos[clave])) {
      limpio[clave] = [...new Set(datos[clave].filter((id) => permitidos.includes(id)))];
    }
  }
  const p = datos.practica;
  if (p && Number.isInteger(p.indice) && p.indice >= 0 && p.indice < 4 &&
      Number.isSafeInteger(p.intentos) && p.intentos >= 0 &&
      (p.seleccion === '' || EXTERNAS.includes(p.seleccion)) &&
      typeof p.terminada === 'boolean') {
    const minimo = p.indice + (p.seleccion ? 1 : 0);
    const finalValido = !p.terminada || (p.indice === 3 && p.seleccion === RESPUESTAS[3]);
    if (p.intentos >= minimo && finalValido) {
      limpio.practica = {
        indice: p.indice, seleccion: p.seleccion,
        intentos: p.intentos, terminada: p.terminada,
      };
    }
  }
  return limpio;
}
