import { useState } from 'react';
import { Link, useParams } from 'react-router';

function SubirAvance() {
  const { alumnoId } = useParams();
  const [numero, setNumero] = useState('');
  const [comentario, setComentario] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [rutaDocumento, setRutaDocumento] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  async function enviarAvance(event) {
    event.preventDefault();
    setError('');
    setMensaje('');
    setGuardando(true);

    try {
      const respuesta = await fetch(
        `http://localhost:8080/api/alumnos/${encodeURIComponent(alumnoId)}/avances`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            num: Number(numero),
            rutaDoc: rutaDocumento,
            obj: objetivo,
            comentarioA: comentario,
          }),
        },
      );
      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo subir el avance.');
      }

      setMensaje('El avance se subió correctamente.');
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'No se pudo conectar con el servidor.'
          : err.message || 'No se pudo subir el avance.',
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="page-container form-page">
      <Link className="back-button" to={`/alumnos/${alumnoId}`}>← Volver a mis avances</Link>
      <section className="content-card form-card">
        <h1>Subir nuevo avance</h1>
        <p className="form-description">Completa los datos de tu entrega para enviarla a tu profesor guía.</p>
        {mensaje ? (
          <p role="status">{mensaje}</p>
        ) : (
          <form onSubmit={enviarAvance}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="rutaDocumento">Ruta del documento:</label><br />
              <input
                id="rutaDocumento"
                type="text"
                value={rutaDocumento}
                onChange={(event) => setRutaDocumento(event.target.value)}
                placeholder="Ej: /documentos/avance.pdf"
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="comentario">Comentario para profesor:</label><br />
              <input
                id="comentario"
                type="text"
                value={comentario}
                onChange={(event) => setComentario(event.target.value)}
                placeholder="Ej: Se incorporaron las observaciones de la revisión anterior."
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="numero">Número de avance:</label><br />
              <input
                id="numero"
                type="number"
                min="1"
                step="1"
                value={numero}
                onChange={(event) => setNumero(event.target.value)}
                placeholder="Ej: 4"
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="objetivo">Objetivo del avance:</label><br />
              <input
                id="objetivo"
                type="text"
                value={objetivo}
                onChange={(event) => setObjetivo(event.target.value)}
                placeholder="Ej: Analizar los datos de la muestra para encontrar tendencias."
                required
              />
            </div>

            {error && <p role="alert">{error}</p>}

            <button className="primary-button" type="submit" disabled={guardando}>
              {guardando ? 'Enviando…' : 'Enviar avance'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default SubirAvance;
