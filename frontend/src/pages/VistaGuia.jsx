import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';

function VistaGuia() {
  const { guiaId } = useParams();
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const memoriasPendientes = alumnos.filter((alumno) => alumno.idMemoria != null && alumno.nota == null);

  useEffect(() => {
    const controller = new AbortController();

    const cargarAlumnos = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:8080/api/guias/${encodeURIComponent(guiaId)}/memorias`,
          { signal: controller.signal },
        );
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.error || 'No se pudo cargar la lista de alumnos.');
        }

        setAlumnos(datos.alumnos);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(
          err instanceof TypeError
            ? 'No se pudo conectar con el servidor.'
            : err.message || 'No se pudo cargar la lista de alumnos.',
        );
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargarAlumnos();
    return () => controller.abort();
  }, [guiaId]);

  return (
    <main className="page-container">
      <Link className="back-button" to="/">Volver al inicio</Link>
      <header className="page-heading">
        <div>
          <h1>Alumnos asignados</h1>
          <p>Selecciona un alumno para revisar su memoria y sus avances.</p>
        </div>
      </header>

      <section className="content-card" aria-labelledby="students-title">
        <h2 id="students-title">Alumnos</h2>
        {cargando && <p role="status">Cargando alumnos…</p>}
        {error && <p role="alert">{error}</p>}
        {!cargando && !error && alumnos.length === 0 && (
          <p role="status">No hay alumnos a cargo.</p>
        )}
        {!error && alumnos.length > 0 && (
          <ul className="advance-list">
            {alumnos.map((alumno) => (
              <li className="advance-item" key={alumno.rol}>
                <Link
                  className="advance-link"
                  to={`/guias/${guiaId}/alumnos/${alumno.rol}`}
                  state={{ nombreAlumno: alumno.nombre }}
                >
                  {alumno.nombre} ({alumno.rol})
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="content-card" aria-labelledby="final-submissions-title">
        <h2 id="final-submissions-title">Memorias por evaluar</h2>
        {cargando && <p role="status">Cargando memorias…</p>}
        {error && <p role="alert">{error}</p>}
        {!cargando && !error && memoriasPendientes.length === 0 && (
          <p role="status">No tienes entregas finales pendientes.</p>
        )}
        {!error && memoriasPendientes.length > 0 && (
          <ul className="advance-list">
            {memoriasPendientes.map((alumno) => (
              <li className="advance-item" key={alumno.rol}>
                <Link
                  className="advance-link"
                  to={`/guias/${guiaId}/alumnos/${alumno.rol}`}
                  state={{ nombreAlumno: alumno.nombre }}
                >
                  <span>
                    <strong>{alumno.titulo}</strong>
                    <small>{alumno.nombre}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default VistaGuia;
