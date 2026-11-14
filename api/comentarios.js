function limpiarTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function mostrarRegistro(registro) {
  const campos = registro.fields || {};
  return {
    id: registro.id,
    nombre: campos.nombre || '',
    codigo: campos.codigo || '',
    comentario: campos.comentario || '',
    respuesta_a: campos.respuesta_a ?? null,
    publicacion_id: campos.publicacion_id || '',
    fecha: campos.fecha || campos.CreatedAt || null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }

  const endpoint = process.env.NOCODB_COMENTARIOS_URL;
  const token = process.env.NOCODB_TOKEN;
  if (!endpoint || !token) {
    return res.status(500).json({ error: 'Falta configurar la URL del foro o el token en el servidor.' });
  }

  let campos;
  if (req.method === 'POST') {
    let cuerpo;
    try {
      cuerpo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'El contenido enviado no es válido.' });
    }
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return res.status(400).json({ error: 'Debes enviar los datos del comentario.' });
    }
    campos = {
      nombre: limpiarTexto(cuerpo.nombre),
      codigo: limpiarTexto(cuerpo.codigo).toUpperCase(),
      comentario: limpiarTexto(cuerpo.comentario),
      publicacion_id: limpiarTexto(cuerpo.publicacion_id),
      respuesta_a: cuerpo.respuesta_a ?? null,
    };
    if (campos.nombre.length < 2 || campos.nombre.length > 80) {
      return res.status(400).json({ error: 'Escribe un nombre de 2 a 80 caracteres.' });
    }
    if (!/^[A-Z0-9_-]{3,20}$/.test(campos.codigo)) {
      return res.status(400).json({ error: 'El código debe tener de 3 a 20 letras, números o guiones.' });
    }
    if (campos.comentario.length < 15 || campos.comentario.length > 1500) {
      return res.status(400).json({ error: 'Escribe un comentario de 15 a 1500 caracteres.' });
    }
    if (!/^[a-zA-Z0-9_-]{16,80}$/.test(campos.publicacion_id)) {
      return res.status(400).json({ error: 'El identificador del envío no es válido.' });
    }
    if (campos.respuesta_a !== null &&
        (!Number.isSafeInteger(campos.respuesta_a) || campos.respuesta_a < 1)) {
      return res.status(400).json({ error: 'El comentario al que respondes no es válido.' });
    }
  }

  try {
    const base = new URL(endpoint);
    if (base.protocol !== 'https:' || base.hostname !== 'app.nocodb.com') {
      return res.status(500).json({ error: 'Revisa la URL configurada para el foro.' });
    }
    base.search = '';
    base.hash = '';
    // Un tiempo límite para toda la operación, incluidas las páginas adicionales.
    const signal = AbortSignal.timeout(15000);

    async function solicitar(url, opciones = {}) {
      const respuesta = await fetch(url, {
        ...opciones,
        headers: { 'xc-token': token, 'Content-Type': 'application/json' },
        redirect: 'error',
        signal,
      });
      if (!respuesta.ok) {
        const error = new Error('Respuesta de NocoDB no satisfactoria.');
        error.estadoNoco = respuesta.status;
        throw error;
      }
      const datos = await respuesta.json();
      if (!Array.isArray(datos.records)) throw new Error('Formato de respuesta inesperado.');
      return datos;
    }

    // Reúne las páginas para incluir también las respuestas a comentarios anteriores.
    let siguiente = new URL(base);
    siguiente.searchParams.set('pageSize', '100');
    const registros = [];
    const visitadas = new Set();
    while (siguiente) {
      if (visitadas.size >= 20 || visitadas.has(siguiente.href)) {
        throw new Error('No fue posible completar la consulta paginada.');
      }
      // Nunca se reenvía el token a otro sitio o a otra tabla.
      if (siguiente.origin !== base.origin || siguiente.pathname !== base.pathname) {
        throw new Error('Enlace de paginación no válido.');
      }
      visitadas.add(siguiente.href);
      const datos = await solicitar(siguiente);
      registros.push(...datos.records.map(mostrarRegistro));
      siguiente = datos.next ? new URL(datos.next, base) : null;
    }

    if (req.method === 'GET') {
      return res.status(200).json({ comentarios: registros });
    }

    // Reconoce reintentos de un envío que ya se guardó.
    const existente = registros.find((item) => item.publicacion_id === campos.publicacion_id);
    if (existente) {
      const coincide = ['nombre', 'codigo', 'comentario'].every((clave) => existente[clave] === campos[clave]) &&
        (existente.respuesta_a == null ? null : Number(existente.respuesta_a)) === campos.respuesta_a;
      if (!coincide) return res.status(409).json({ error: 'Ese envío ya existe con otros datos.' });
      return res.status(200).json({ comentario: existente, yaExistia: true });
    }

    if (campos.respuesta_a !== null) {
      const padre = registros.find((item) => Number(item.id) === campos.respuesta_a);
      if (!padre) return res.status(400).json({ error: 'El comentario al que respondes ya no está disponible.' });
      if (padre.respuesta_a != null) {
        return res.status(400).json({ error: 'Responde al aporte principal de esta conversación.' });
      }
    }

    const datos = await solicitar(base, {
      method: 'POST',
      body: JSON.stringify([{ fields: { Title: campos.nombre, ...campos } }]),
    });
    const creado = datos.records[0];
    if (!creado || creado.id == null) throw new Error('No se recibió el registro creado.');
    return res.status(201).json({ comentario: mostrarRegistro(creado), yaExistia: false });
  } catch (error) {
    // No se envían credenciales ni respuestas internas de NocoDB al navegador.
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return res.status(504).json({ error: 'La conexión tardó demasiado. Reintenta sin cambiar tu comentario.' });
    }
    if ([401, 403].includes(error.estadoNoco)) {
      return res.status(502).json({ error: 'NocoDB rechazó el acceso. Revisa los permisos del token para consultar y crear registros.' });
    }
    return res.status(502).json({ error: 'No se pudo completar la operación con NocoDB. Conserva tu comentario e inténtalo otra vez.' });
  }
}
