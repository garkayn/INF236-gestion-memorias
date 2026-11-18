import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';

  const valorFecha = new Date(fecha);
  if (Number.isNaN(valorFecha.getTime())) return fecha;

  return valorFecha.toLocaleDateString('es-CL', { timeZone: 'UTC' });
}

function ResumenAvances() {
  const { guiaId, alumnoId } = useParams();
  const location = useLocation();
  const [avances, setAvances] = useState([]);
  const [cargandoAvances, setCargandoAvances] = useState(true);
  const [errorAvances, setErrorAvances] = useState(null);
  const [memoria, setMemoria] = useState(null);
  const [cargandoMemoria, setCargandoMemoria] = useState(true);
  const [errorMemoria, setErrorMemoria] = useState('');
  const [nota, setNota] = useState('');
  const [guardandoNota, setGuardandoNota] = useState(false);
  const [errorNota, setErrorNota] = useState('');
  const [mensajeNota, setMensajeNota] = useState('');
  const nombreAlumno = location.state?.nombreAlumno || `alumno ${alumnoId}`;

  useEffect(() => {
    const controller = new AbortController();

    const cargarMemoria = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:8080/api/alumnos/${encodeURIComponent(alumnoId)}/memorias`,
          { signal: controller.signal },
        );
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.error || 'No se pudo cargar la memoria.');
        }

        setMemoria(datos);
        setNota(datos.nota == null ? '' : String(datos.nota));
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorMemoria(
          err instanceof TypeError
            ? 'No se pudo conectar con el servidor.'
            : err.message || 'No se pudo cargar la memoria.',
        );
      } finally {
        if (!controller.signal.aborted) setCargandoMemoria(false);
      }
    };

    cargarMemoria();
    return () => controller.abort();
  }, [alumnoId]);

  useEffect(() => {
    const controller = new AbortController();

    const cargarAvances = async () => {
      try {
        const respuesta = await fetch(
          `http://localhost:8080/api/alumnos/${encodeURIComponent(alumnoId)}/avances`,
          { signal: controller.signal },
        );
        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(datos.error || 'No se pudieron cargar los avances.');
        }

        if (!Array.isArray(datos.avances)) {
          throw new Error('El servidor devolvió una lista de avances no válida.');
        }

        setAvances(datos.avances);
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorAvances(
          err instanceof TypeError
            ? 'No se pudo conectar con el servidor.'
            : err.message || 'No se pudieron cargar los avances.',
        );
      } finally {
        if (!controller.signal.aborted) setCargandoAvances(false);
      }
    };

    cargarAvances();
    return () => controller.abort();
  }, [alumnoId]);

  async function guardarNotaFinal(event) {
    event.preventDefault();
    setErrorNota('');
    setMensajeNota('');
    setGuardandoNota(true);

    try {
      const respuesta = await fetch(
        `http://localhost:8080/api/alumnos/${encodeURIComponent(alumnoId)}/memorias`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notaFinal: Number(nota) }),
        },
      );
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.error || 'No se pudo guardar la nota.');
      }

      setMemoria((memoriaAnterior) => ({ ...memoriaAnterior, nota: Number(nota) }));
      setMensajeNota('La nota se guardó correctamente.');
    } catch (err) {
      setErrorNota(
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor.'
          : err.message || 'No se pudo guardar la nota.',
      );
    } finally {
      setGuardandoNota(false);
    }
  }

  return (
    <main className="page-container">
      <Link className="back-button" to={`/guias/${guiaId}/alumnos`}>
        Volver a los alumnos
      </Link>
      <header className="page-heading">
        <div>
          <h1>Memoria y avances de {nombreAlumno}</h1>
        </div>
      </header>

      <section className="content-card" aria-labelledby="memory-title">
        <h2 id="memory-title">Datos de la memoria</h2>
        {cargandoMemoria && <p role="status">Cargando memoria…</p>}
        {errorMemoria && <p role="alert">{errorMemoria}</p>}

        {memoria && (
          <>
            <p><strong>Título:</strong> {memoria.titulo}</p>
            <p><strong>Modalidad:</strong> {memoria.modalidad}</p>
            <p>
              <strong>Nota actual:</strong>{' '}
              {memoria.nota == null ? 'Pendiente de evaluación' : memoria.nota}
            </p>

            {memoria.nota == null && (
              <form onSubmit={guardarNotaFinal}>
                <label htmlFor="nota-memoria">Nota de la memoria (0 a 100)</label>
                <input
                  id="nota-memoria"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={nota}
                  onChange={(event) => setNota(event.target.value)}
                  required
                />
                <button type="submit" disabled={guardandoNota}>
                  {guardandoNota ? 'Guardando…' : 'Guardar nota'}
                </button>
              </form>
            )}
          </>
        )}

        {errorNota && <p role="alert">{errorNota}</p>}
        {mensajeNota && <p role="status">{mensajeNota}</p>}
      </section>

      <section className="content-card" aria-labelledby="advances-title">
        <h2 id="advances-title">Avances del alumno</h2>

        {cargandoAvances ? (
          <p role="status">Cargando avances…</p>
        ) : errorAvances ? (
          <p role="alert">{errorAvances}</p>
        ) : avances.length === 0 ? (
          <p role="status">Este alumno aún no registra avances.</p>
        ) : (
          <ul className="advance-list">
            {avances.map((avance) => (
              <li className="advance-item" key={`${avance.rolAlumno}-${avance.numero}`}>
                <article>
                  <h3>Avance {avance.numero}</h3>
                  <p><strong>Fecha de entrega:</strong> {formatearFecha(avance.fechaSubida)}</p>
                  <p><strong>Objetivo:</strong> {avance.objetivo}</p>
                  {avance.comentarioAlumno && (
                    <p><strong>Comentario:</strong> {avance.comentarioAlumno}</p>
                  )}
                  <Link
                    className="advance-link"
                    to={`/guias/${guiaId}/alumnos/${alumnoId}/avances/${avance.numero}`}
                    state={{ avance, nombreAlumno }}
                  >
                    Evaluar avance
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default ResumenAvances;
