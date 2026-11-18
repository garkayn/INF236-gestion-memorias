import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';

  const valorFecha = new Date(fecha);
  if (Number.isNaN(valorFecha.getTime())) return fecha;

  return valorFecha.toLocaleDateString('es-CL', { timeZone: 'UTC' });
}

function EvaluarAvance() {
  const { guiaId, alumnoId, numero } = useParams();
  const { state } = useLocation();
  const avance = state?.avance;
  const nombreAlumno = state?.nombreAlumno || `alumno ${alumnoId}`;
  const [avanceActual, setAvanceActual] = useState(avance);
  const [nota, setNota] = useState('');
  const [retroalimentacion, setRetroalimentacion] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const avanceValido = avanceActual && String(avanceActual.numero) === numero;

  async function guardarEvaluacion(event) {
    event.preventDefault();
    setError('');
    setMensaje('');
    setGuardando(true);

    try {
      const respuesta = await fetch(
        `http://localhost:8080/api/alumnos/${encodeURIComponent(alumnoId)}/avances/${encodeURIComponent(numero)}/evaluacion`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nota: Number(nota),
            retroalimentacion,
          }),
        },
      );
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(resultado.error || 'No se pudo guardar la evaluación.');
      }

      const retroalimentacionGuardada = retroalimentacion.trim();
      setAvanceActual((avanceAnterior) => ({
        ...avanceAnterior,
        nota: Number(nota),
        retroalimentacion: retroalimentacionGuardada,
        estado: resultado.estado,
      }));
      setMensaje('La evaluación se guardó correctamente.');
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor.'
          : err.message || 'No se pudo guardar la evaluación.',
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main>
      <Link to={`/guias/${guiaId}/alumnos/${alumnoId}/avances`}>
        Volver al historial del alumno
      </Link>
      <h1>Avance {numero} de {nombreAlumno}</h1>

      {avanceValido ? (
        <article>
          <p><strong>Objetivo:</strong> {avanceActual.objetivo}</p>
          <p><strong>Fecha de entrega:</strong> {formatearFecha(avanceActual.fechaSubida)}</p>
          <p><strong>Estado:</strong> {avanceActual.estado}</p>
          {avanceActual.comentarioAlumno && (
            <p><strong>Comentario del alumno:</strong> {avanceActual.comentarioAlumno}</p>
          )}
          {avanceActual.rutaDocumento && (
            <p><strong>Documento:</strong> {avanceActual.rutaDocumento}</p>
          )}
          {avanceActual.retroalimentacion && (
            <p><strong>Retroalimentación:</strong> {avanceActual.retroalimentacion}</p>
          )}
          {avanceActual.nota != null && (
            <p><strong>Nota:</strong> {avanceActual.nota}</p>
          )}
          {avanceActual.fechaEvaluacion && (
            <p><strong>Fecha de evaluación:</strong> {formatearFecha(avanceActual.fechaEvaluacion)}</p>
          )}
          {avanceActual.estado === 'ENTREGADO' ? (
            <form onSubmit={guardarEvaluacion}>
              <label htmlFor="nota">Nota (0 a 100)</label>
              <input
                id="nota"
                type="number"
                min="0"
                max="100"
                step="1"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                required
              />

              {error && <p role="alert">{error}</p>}

              <label htmlFor="retroalimentacion">Retroalimentación</label>
              <textarea
                id="retroalimentacion"
                value={retroalimentacion}
                onChange={(e) => setRetroalimentacion(e.target.value)}
                required
              />

              <button type="submit" disabled={guardando}>
                {guardando ? 'Guardando…' : 'Guardar evaluación'}
              </button>
            </form>
          ) : (
            <p>Este avance ya fue evaluado: {avanceActual.estado}</p>
          )}
          {mensaje && <p role="status">{mensaje}</p>}
        </article>
      ) : (
        <p role="alert">
          No se recibió la información de este avance. Vuelve al historial y
          selecciónalo desde ahí.
        </p>
      )}
    </main>
  );
}

export default EvaluarAvance;
