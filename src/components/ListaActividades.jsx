import { useEffect, useState } from "react";

export default function ListaActividades() {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/actividades")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las actividades.");
        }
        return respuesta.json();
      })
      .then((datos) => setActividades(datos.records))
      .catch(() => setError("No se pudieron cargar las actividades."))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando actividades...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Actividades del plan de clase</h2>
      <ul>
        {actividades.map(({ id, fields }) => (
          <li key={id}>
            {fields.category}: {fields.title} ({fields.duration} minutos).
            Estado: {fields.completed ? "Completada" : "Pendiente"}
          </li>
        ))}
      </ul>
    </section>
  );
}