import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark border-body navbar-dark">
      <div className="container-fluid">

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <span className="navbar-brand mb-0 h1">
          Lab. Ciencias de la Construccion
        </span>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav">
            <button className="nav-item btn btn-dark me-2" type="button">
              <a className="nav-link" href="/students">
                Alumnos
              </a>
            </button>
            <button className="nav-item btn btn-dark me-2" type="button">
              <a className="nav-link" href="/essay">
                Ensayos
              </a>
            </button>
            <button className="nav-item btn btn-dark me-2" type="button">
              <a className="nav-link" href="/entry">
                Ingresos
              </a>
            </button>
            <button className="nav-item btn btn-dark me-2" type="button">
              <a className="nav-link" href="/activity">
                Actividades
              </a>
            </button>
            <button className="nav-item btn btn-dark me-2" type="button">
              <a className="nav-link" href="/attendance">
                Asistencias
              </a>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
