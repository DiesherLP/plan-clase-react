import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './ForoClase.css';

function fechaVisible(valor) {
  if (!valor) return 'Fecha no disponible';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-GT', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Guatemala',
  }).format(fecha);
}

function nuevoId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `foro-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function unirComentarios(lista, nuevo) {
  return [...lista.filter((item) => String(item.id) !== String(nuevo.id)), nuevo];
}

function Aporte({ item, respuesta = false, onResponder, enviando }) {
  const iniciales = (item.nombre || 'Estudiante').trim().split(/\s+/)
    .slice(0, 2).map((parte) => parte[0]).join('').toUpperCase();
  return (
    <article className={`foro-aporte ${respuesta ? 'foro-respuesta' : ''}`}>
      <header className="foro-autor">
        <span className="foro-avatar" aria-hidden="true">{iniciales}</span>
        <div>
          <h4>{item.nombre || 'Estudiante'}</h4>
          <p>{item.codigo} <span aria-hidden="true">·</span> {fechaVisible(item.fecha)}</p>
        </div>
      </header>
      <p className="foro-mensaje">{item.comentario}</p>
      {!respuesta && (
        <button type="button" className="foro-responder" disabled={enviando}
          onClick={() => onResponder(item)} aria-label={`Responder al aporte de ${item.nombre}`}>
          Responder al aporte <span aria-hidden="true">↗</span>
        </button>
      )}
    </article>
  );
}

export default function ForoClase() {
  const reducirMovimiento = useReducedMotion();
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [recarga, setRecarga] = useState(0);
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [texto, setTexto] = useState('');
  const [destino, setDestino] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [aviso, setAviso] = useState('');
  const textarea = useRef(null);
  const ultimoEnvio = useRef(null);
  const bloqueoEnvio = useRef(false);
  const versionCarga = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const version = ++versionCarga.current;
    const limite = setTimeout(() => controller.abort(), 22000);
    let activo = true;
    setCargando(true);
    setErrorCarga('');
    async function cargar() {
      try {
        const respuesta = await fetch('/api/comentarios', {
          signal: controller.signal, cache: 'no-store',
        });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.error || 'No se pudieron cargar los aportes.');
        if (!Array.isArray(datos.comentarios)) throw new Error('La respuesta del foro no tiene el formato esperado.');
        if (activo && version === versionCarga.current) setComentarios(datos.comentarios);
      } catch (error) {
        if (activo && version === versionCarga.current) {
          setErrorCarga(error.name === 'AbortError'
            ? 'La consulta tardó demasiado. Pulsa Actualizar aportes para reintentar.'
            : error.message === 'Failed to fetch'
              ? 'No se pudo conectar. Revisa tu conexión y vuelve a actualizar los aportes.'
              : error.message);
        }
      } finally {
        clearTimeout(limite);
        if (activo && version === versionCarga.current) setCargando(false);
      }
    }
    cargar();
    return () => { activo = false; clearTimeout(limite); controller.abort(); };
  }, [recarga]);

  function responder(item) {
    setDestino(item);
    setAviso('');
    setErrorEnvio('');
    textarea.current?.focus({ preventScroll: true });
    document.getElementById('formulario-foro')?.scrollIntoView({
      behavior: reducirMovimiento ? 'auto' : 'smooth', block: 'start',
    });
  }

  async function publicar(evento) {
    evento.preventDefault();
    if (bloqueoEnvio.current) return;
    setErrorEnvio('');
    setAviso('');
    const contenido = {
      nombre: nombre.trim(), codigo: codigo.trim().toUpperCase(),
      comentario: texto.trim(), respuesta_a: destino ? Number(destino.id) : null,
    };
    if (contenido.nombre.length < 2 || contenido.nombre.length > 80 ||
        !/^[A-Z0-9_-]{3,20}$/.test(contenido.codigo) ||
        contenido.comentario.length < 15 || contenido.comentario.length > 1500) {
      setErrorEnvio('Revisa tu nombre, el código y el comentario. El aporte debe tener al menos 15 caracteres, sin contar los espacios de los extremos.');
      return;
    }
    const firma = JSON.stringify(contenido);
    if (!ultimoEnvio.current || ultimoEnvio.current.firma !== firma) {
      ultimoEnvio.current = { firma, publicacion_id: nuevoId() };
    }
    bloqueoEnvio.current = true;
    setEnviando(true);
    const controller = new AbortController();
    const limite = setTimeout(() => controller.abort(), 22000);
    try {
      const respuesta = await fetch('/api/comentarios', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ ...contenido, publicacion_id: ultimoEnvio.current.publicacion_id }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error || 'No se pudo guardar el comentario.');
      if (!datos.comentario || datos.comentario.id == null) throw new Error('No se recibió la confirmación del comentario.');
      // Una consulta anterior no debe borrar el aporte recién confirmado.
      versionCarga.current += 1;
      setComentarios((actuales) => unirComentarios(actuales, datos.comentario));
      setTexto('');
      setDestino(null);
      ultimoEnvio.current = null;
      setAviso(datos.yaExistia
        ? 'Tu aporte ya estaba guardado. Lo recuperamos sin volver a publicarlo.'
        : 'Tu aporte se guardó. Ya forma parte de la conversación.');
      setRecarga((actual) => actual + 1);
    } catch (error) {
      const detalle = error.name === 'AbortError'
        ? 'La conexión tardó demasiado.'
        : error.message === 'Failed to fetch' ? 'No se pudo conectar con el servidor.' : error.message;
      setErrorEnvio(`${detalle} Conservamos tu texto. Reintenta el envío sin modificarlo para comprobar si ya se guardó.`);
    } finally {
      clearTimeout(limite);
      bloqueoEnvio.current = false;
      setEnviando(false);
    }
  }

  const principales = comentarios.filter((item) => item.respuesta_a == null)
    .sort((a, b) => Number(b.id) - Number(a.id));
  const respuestas = comentarios.filter((item) => item.respuesta_a != null);
  const sinPadre = respuestas.filter((item) => !principales.some((p) => String(p.id) === String(item.respuesta_a)));

  return (
    <section id="foro-clase" className="foro-clase" aria-labelledby="titulo-foro">
      <div className="foro-portada">
        <div>
          <p className="foro-etiqueta">Conversa y construye</p>
          <h2 id="titulo-foro">Una tarea.<br />Muchas piezas trabajando.</h2>
          <p>Comparte una situación real y descubre cómo la explican tus compañeros.</p>
        </div>
        <svg className="foro-ilustracion" viewBox="0 0 220 170" aria-hidden="true" focusable="false">
          <path d="M12 15H165V98H66L40 122V98H12Z" fill="#e3eeed" />
          <path d="M77 77H208V143H179V166L152 143H77Z" fill="#e8bd54" />
          <path d="M32 38H139M32 55H120M32 72H91" stroke="#247b78" strokeWidth="6" />
          <circle cx="112" cy="110" r="6" fill="#123642" /><circle cx="142" cy="110" r="6" fill="#123642" /><circle cx="172" cy="110" r="6" fill="#123642" />
        </svg>
      </div>

      <div className="foro-consigna">
        <span aria-hidden="true">?</span>
        <div><h3>¿Qué ocurre dentro y fuera de tu computadora cuando haces una tarea?</h3>
          <p>Elige una tarea escolar. Explica qué componente externo y qué componente interno intervienen y qué hace cada uno.</p>
          <p>Después, responde a un compañero: complementa su explicación o hazle una pregunta sobre su ejemplo.</p>
        </div>
      </div>

      <div className="foro-distribucion">
        <div className="foro-escritura">
          <h3>Tu voz en la clase</h3>
          <p className="foro-ayuda">Usa tu nombre y el código acordado en clase. Identifican tu aporte; no son una cuenta ni una contraseña.</p>
          <form id="formulario-foro" onSubmit={publicar} aria-busy={enviando}>
            <fieldset disabled={enviando}>
              <legend className="foro-solo-lectores">Datos del aporte</legend>
              <label htmlFor="foro-nombre">Nombre</label>
              <input id="foro-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                required minLength={2} maxLength={80} autoComplete="off" placeholder="Ejemplo: Diego Pacay" />
              <label htmlFor="foro-codigo">Código del estudiante</label>
              <input id="foro-codigo" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                required minLength={3} maxLength={20} pattern="[A-Za-z0-9_\-]{3,20}" autoComplete="off"
                aria-describedby="foro-ayuda-codigo" placeholder="Ejemplo: DEMO-001" />
              <p id="foro-ayuda-codigo" className="foro-ayuda">De 3 a 20 letras, números o guiones. Usa un código de clase, no tu contraseña.</p>
              {destino && (
                <div className="foro-destino">
                  <p>Respondiendo a <strong>{destino.nombre}</strong></p>
                  <blockquote>{destino.comentario}</blockquote>
                  <button type="button" onClick={() => { setDestino(null); setErrorEnvio(''); }}>Volver a un aporte nuevo</button>
                </div>
              )}
              <label htmlFor="foro-texto">{destino ? 'Tu respuesta' : 'Tu aporte'}</label>
              <textarea id="foro-texto" ref={textarea} value={texto} onChange={(e) => setTexto(e.target.value)}
                required minLength={15} maxLength={1500} rows={7} aria-describedby="foro-ayuda-texto"
                placeholder={destino ? 'Puedo complementar tu ejemplo con…' : 'Cuando preparo una presentación, utilizo…'} />
              <p id="foro-ayuda-texto" className="foro-contador">{texto.length}/1500 caracteres · Mínimo 15</p>
              <button className="foro-publicar" type="submit">
                {enviando ? 'Guardando aporte…' : errorEnvio ? 'Reintentar envío' : destino ? 'Publicar respuesta' : 'Publicar aporte'}
                <span aria-hidden="true"> ↗</span>
              </button>
            </fieldset>
            {errorEnvio && <p className="foro-error" role="alert">{errorEnvio}</p>}
            <p className="foro-confirmacion" role="status">{aviso}</p>
          </form>
          <details className="foro-orientacion">
            <summary>¿Qué hace útil un aporte?</summary>
            <ul><li>Describe una tarea concreta.</li><li>Relaciona las piezas con su función.</li><li>Responde con respeto y aporta una idea propia.</li></ul>
            <p>Los mensajes serán visibles para quienes visiten esta página. Comparte solo información relacionada con la actividad.</p>
          </details>
        </div>

        <div className="foro-conversacion" aria-busy={cargando}>
          <div className="foro-lista-cabecera">
            <div><p className="foro-etiqueta">Ideas que se conectan</p><h3>La conversación</h3></div>
            <button type="button" onClick={() => setRecarga((actual) => actual + 1)} disabled={cargando || enviando}>
              {cargando ? 'Cargando…' : 'Actualizar aportes'}
            </button>
          </div>
          {errorCarga && <p className="foro-error" role="alert">{errorCarga} Puedes volver a intentar con “Actualizar aportes”.</p>}
          {!cargando && !errorCarga && comentarios.length === 0 && (
            <div className="foro-vacio"><span aria-hidden="true">01</span><h4>La primera idea puede ser tuya.</h4><p>Todavía no hay aportes. Elige una tarea que conozcas y abre la conversación.</p></div>
          )}
          {principales.map((item) => {
            const hilo = respuestas.filter((r) => String(r.respuesta_a) === String(item.id))
              .sort((a, b) => Number(a.id) - Number(b.id));
            return (
              <motion.div key={item.id} className="foro-hilo"
                initial={reducirMovimiento ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}>
                <Aporte item={item} onResponder={responder} enviando={enviando} />
                {hilo.length > 0 && <div className="foro-respuestas"><p className="foro-hilo-etiqueta">{hilo.length} {hilo.length === 1 ? 'respuesta' : 'respuestas'}</p>
                  {hilo.map((r) => <Aporte key={r.id} item={r} respuesta />)}
                </div>}
              </motion.div>
            );
          })}
          {sinPadre.length > 0 && <div className="foro-hilo"><p>Respuestas cuyo aporte original ya no está disponible:</p>
            {sinPadre.map((r) => <Aporte key={r.id} item={r} respuesta />)}
          </div>}
        </div>
      </div>
    </section>
  );
}
