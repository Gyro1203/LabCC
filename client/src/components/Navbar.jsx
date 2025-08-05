import { useLocation } from "react-router-dom";
import "@styles/NavBar.css";
import { logoutRequest } from "../services/login.api.js";

function Navbar() {
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("usuario"));
  const userRol = user ? user.rol : null;

  const logoutSubmit = () => {
    try {
      logoutRequest();
      console.log("Sesión cerrada correctamente");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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
                      <li
                        className={`nav-item ${
                          location.pathname === "/" ? "active" : ""
                        }`}
                      >
                        <a className="nav-link" href="/">
                          {" "}
                          Home
                        </a>
                      </li>
                      {userRol === "Admin" && (
                        <>
                          <li
                            className={`nav-item ${
                              location.pathname === "/students" ? "active" : ""
                            }`}
                          >
                            <a className="nav-link" href="/students">
                              Alumnos
                            </a>
                          </li>
                          {/* <li className={`nav-item ${location.pathname === '/essay' ? 'active' : ''}`}>
                        <a className="nav-link" href="/essay">
                          Ensayosn
                        </a>
                      </li> */}
                          <li
                            className={`nav-item ${
                              location.pathname === "/entry" ? "active" : ""
                            }`}
                          >
                            <a className="nav-link" href="/entry">
                              Ingresos{" "}
                            </a>
                          </li>
                          {/* <li className={`nav-item ${location.pathname === '/activity' ? 'active' : ''}`}>
                        <a className="nav-link" href="/activity">
                          Actividades
                        </a>
                      </li> */}
                          <li className="nav-item">
                            <a className="nav-link" href="/attendance">
                              {" "}
                              Asistencias{" "}
                            </a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="/reports">
                              Reportes{" "}
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </nav>
              </div>
              {!user ? (
                <div className="col-md-3 col-sm-5 d_none">
                  <ul className="sign">
                    <li
                      className={`nav-item ${
                        location.pathname === "/login" ? "active" : ""
                      }`}
                    >
                      <a className="sign_btn" href="/login">
                        Login
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="col-md-3 col-sm-5 d_none">
                  <ul className="sign">
                    <button
                      className="btn btn-warning"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <i className="fa-solid fa-bars fa-xl"></i>
                    </button>
                    <div
                      className="offcanvas offcanvas-end"
                      tabIndex="-1"
                      id="offcanvasRight"
                      aria-labelledby="offcanvasRightLabel"
                    >
                      <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasRightLabel">
                          <i className="fa-solid fa-user-gear"></i>
                          Configuración
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="offcanvas-body">
                        <div className="user-info">
                          <p>
                            <strong>
                              <i className="fa-solid fa-user-check"></i>
                              Usuario:
                            </strong>{" "}
                            {user.nombre} {user.nombre_usuario}
                          </p>
                          <p>
                            <strong>
                              <i className="fa-solid fa-tachograph-digital"></i>
                              Rol:
                            </strong>{" "}
                            {user.rol}
                          </p>
                        </div>
                        <ul className="list-unstyled">
                          <li>
                            <a href="/essay">
                              <i className="fa-solid fa-folder-closed"></i>Ensayos
                            </a>
                          </li>
                          <li>
                            <a href="/activity">
                              <i className="fa-solid fa-building-user"></i>
                              Actividades
                            </a>
                          </li>
                          {userRol === "Admin" && (
                            <li>
                              <a href="/users">
                                <i className="fa-solid fa-user-gear"></i>Usuarios
                              </a>
                            </li>
                          )}
                          <li>
                            <a
                              href="/login"
                              onClick={(e) => {
                                e.preventDefault();
                                logoutSubmit();
                              }}
                            >
                              {" "}
                              <i className="fa-solid fa-right-from-bracket fa-lg"></i>{" "}
                              Cerrar sesión
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
