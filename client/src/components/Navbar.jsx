import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  return (
    <header>
      <div className="header">
        <div className="header_midil">
          <div className="container">
            <div className="row d_flex">
              <div className="col-md-4 col-sm-4 d_none">
                <ul className="conta_icon">
                  <li>
                    <a href="#">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      Contactanos : +41 3111052
                    </a>{" "}
                  </li>
                </ul>
              </div>
              <div className="col-md-4 col-sm-4 ">
                <a className="logo" href="#">
                  <img src="images/LogoLabcon.png" alt="#" />
                </a>
              </div>
              <div className="col-md-4 col-sm-4 d_none">
                <ul className="conta_icon ">
                  <li>
                    <a href="#">
                      <i className="fa fa-envelope" aria-hidden="true"></i>{" "}
                      rcervante@ubiobio.cl
                    </a>{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="header_bo">
          <div className="container">
            <div className="row">
              <div className="col-md-9 col-sm-7">
                <nav className="navigation navbar navbar-expand-md navbar-dark ">
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mr-auto">
                      <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                        <a className="nav-link" href="/">
                          {" "}
                          Home
                        </a>
                      </li>
                      <li className={`nav-item ${location.pathname === '/students' ? 'active' : ''}`}>
                        <a className="nav-link" href="/students">
                          Alumnos
                        </a>
                      </li>
                      <li className={`nav-item ${location.pathname === '/essay' ? 'active' : ''}`}>
                        <a className="nav-link" href="/essay">
                          Ensayos
                        </a>
                      </li>
                      <li className={`nav-item ${location.pathname === '/entry' ? 'active' : ''}`}>
                        <a className="nav-link" href="/entry">
                          Ingresos
                        </a>
                      </li>
                      <li className={`nav-item ${location.pathname === '/activity' ? 'active' : ''}`}>
                        <a className="nav-link" href="/activity">
                          Actividades
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/attendance">
                          Asistencias
                        </a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="/reports">
                          Reportes{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>
              <div className="col-md-3 col-sm-5 d_none">
                <ul className="sign">
                  <li>
                    <a href="#">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a className="sign_btn" href="#">
                      Login
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
