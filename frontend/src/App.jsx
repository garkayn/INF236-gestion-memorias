import { Link, Navigate, Route, Routes } from 'react-router';
import VistaMemorista from './pages/VistaMemorista';
import VistaGuia from './pages/VistaGuia';
import ResumenAvances from './pages/ResumenAvances';
import EvaluarAvance from './pages/EvaluarAvance';
import SubirAvance from './pages/SubirAvance';
import './App.css';
import DetalleAvance from './pages/DetalleAvance';

function SeleccionRol() {
  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <h1 id="login-title">Sistema de gestión de memorias</h1>
        <p className="login-description">Elige tu perfil para continuar.</p>
        <div className="selector-roles">
          <Link className="tarjeta-rol" to="/alumnos/202173001">
            <span className="role-copy">
              <strong>Memorista</strong>
            </span>
          </Link>
          <Link className="tarjeta-rol" to="/guias/1/alumnos">
            <span className="role-copy">
              <strong>Profesor guía</strong>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SeleccionRol />} />
      <Route path="/guias/:guiaId/alumnos" element={<VistaGuia />} />
      <Route path="/guias/:guiaId/alumnos/:alumnoId" element={<ResumenAvances />} />
      <Route path="/guias/:guiaId/alumnos/:alumnoId/avances" element={<ResumenAvances />}/>
      <Route path="/guias/:guiaId/alumnos/:alumnoId/avances/:numero" element={<EvaluarAvance />}/>
      <Route path="/alumnos/:alumnoId" element={<VistaMemorista />} />
      <Route path = "/alumnos/:alumnoId/avances" element={<SubirAvance/>}/>
      <Route path = "/alumnos/:alumnoId/avances/:numero" element= {<DetalleAvance/>}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
