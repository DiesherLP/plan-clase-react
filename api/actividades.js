export default async function handler(req, res) {
  try {
    const respuesta = await fetch(process.env.NOCODB_URL, {
      headers: { "xc-token": process.env.NOCODB_TOKEN }
    });

    if (!respuesta.ok) {
      return res.status(502).json({ error: "NocoDB no pudo cargar las actividades" });
    }

    const datos = await respuesta.json();
    return res.status(200).json(datos);
  } catch {
    return res.status(502).json({ error: "No se pudo conectar con NocoDB" });
  }
}