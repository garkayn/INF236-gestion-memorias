import { useState, useEffect, use } from 'react';
import { Link, useParams } from 'react-router';


function VistaMemorista() {
  const { alumnoId }= useParams();
  const [avances, setavances] = useState([]);
  const [cargando, setcargando] = useState(true);

  useEffect(() =>{
    const Manejodatos = async () =>{
      try{
        const respuesta = await fetch(`http://localhost:8080/api/alumnos/${alumnoId}/avances`);
        const datos = await respuesta.json();
        console.log("Lo que llegó del backend:", datos);
        if(respuesta.ok){
          setavances(datos.avances);
        }
      } 
      catch(error){
        console.error('No se pudo conectar.');
      } finally{
        setcargando(false);
      }
    };
    Manejodatos();
  }, []);


  return (
    <main className="page-container">
      <Link className="back-button" to="/">Volver al inicio</Link>
      <header className="page-heading">
        <div>
          <h1>Mis avances</h1>
          <p>Revisa el estado y el detalle de tus entregas.</p>
        </div>
        <Link className="primary-link" to={`/alumnos/${alumnoId}/avances`}>
          Subir avance
        </Link>
      </header>

      <section className="content-card" aria-labelledby="advances-title">
        <h2 id="advances-title">Avances subidos</h2>
        {cargando && <p role="status">Cargando datos…</p>}

        {!cargando && avances.length === 0 && (
          <p className="empty-state">Todavía no has subido avances.</p>
        )}
        {!cargando && avances.length > 0 && (
          <ul className="advance-list">
            {[...avances].sort((a, b) => a.numero - b.numero).map((avance) => (
              <li className="advance-item" key={avance.numero}>
                <Link className="advance-link" to={`/alumnos/${alumnoId}/avances/${avance.numero}`}>
                  <span>
                    <strong>Avance #{avance.numero}</strong>
                    <small>{avance.objetivo}</small>
                  </span>
                </Link>
                {avance.comentarioAlumno && (
                  <p className="advance-comment">Comentario: {avance.comentarioAlumno}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default VistaMemorista;
