import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';

function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha';

    const valorFecha = new Date(fecha);
    if (Number.isNaN(valorFecha.getTime())) return fecha;

    return valorFecha.toLocaleDateString('es-CL', { timeZone: 'UTC' });
}

function DetalleAvance() {
    const [avance, setavance] = useState(null);
    const [cargando, setcargando] = useState(true);

    const {alumnoId, numero} = useParams();
    
    useEffect(() => {
        const Obtenerdatos = async() => {
            try{
                const respuesta = await fetch(`http://localhost:8080/api/alumnos/${alumnoId}/avances`);
                const todosAvances = await respuesta.json();
                if(respuesta.ok){
                    const avanceEspec = todosAvances.avances.find((a) => String(a.numero) === String(numero));
                    setavance(avanceEspec || null);
                    console.log(avanceEspec);
                }

            }
            catch(error){
                console.error('No se encontro el avance');
            }finally{
                setcargando(false);
            }
        };
        if(alumnoId && numero){
            Obtenerdatos();
        }

        }, [alumnoId, numero]);
    
        return(
            <main className="page-container">
                <Link className="back-button" to={`/alumnos/${alumnoId}`}>← Volver a mis avances</Link>
                <header className="page-heading detail-heading">
                    <div>
                        <h1>Detalle del avance #{numero}</h1>
                    </div>
                </header>

                {cargando && <p>Cargando informacion</p>}

                {!cargando && !avance && <p>No se encontro el avance</p>}

                {!cargando && avance && (
                    <section className="content-card detail-card">
          <p><strong>Rol del Alumno:</strong> {alumnoId}</p>
          <p><strong>Número de Avance:</strong> {avance.numero}</p>
          <p><strong>Objetivo:</strong> {avance.objetivo}</p>
          <p><strong>Fecha de subida:</strong> {formatearFecha(avance.fechaSubida)}</p>
          <p><strong>Comentario del Alumno:</strong> {avance.comentarioAlumno}</p>
          <p>
            <strong>Documento adjunto:</strong>{avance.rutaDocumento}
            
          </p>
          {avance.fechaEvaluacion || avance.estado === 'APROBADO' || avance.estado === 'REPROBADO' || avance.retroalimentacion?.trim() ? (
            <>
              <p><strong>Nota:</strong> {avance.nota ?? 'Sin nota'}</p>
              <p><strong>Retroalimentación:</strong> {avance.retroalimentacion?.trim() || 'Sin retroalimentación'}</p>
            </>
          ) : (
            <p><strong>Evaluación:</strong> No evaluado</p>
          )}
                    </section>
                )}
            </main>

        )

    }




export default DetalleAvance;
