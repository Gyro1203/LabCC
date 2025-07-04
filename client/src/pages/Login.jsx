import { loginRequest } from "../services/login.api";
import { useNavigate } from "react-router-dom";
import loginImg from '../assets/Login/DSC_4014-1.jpg';
import { useState } from "react";

function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        setLoading(true);
        try {
            await loginRequest(email, password);
            setSuccess(true);
            setError(false);
            setTimeout(() => {
              setLoading(false);
              navigate("/");
            }, 1500);
        } catch (error) {
            setTimeout(() => {
              setLoading(false);
            }, 1500);
            setSuccess(false);
            setError(true);
            console.error("Error al iniciar sesión:", error);
        }
    }

    return (
      <section
        className="vh-100"
        style={{
          position: "relative",
          minHeight: "100vh",
          backgroundImage: `url(https://farcodi.ubiobio.cl/wp-content/uploads/2022/10/portada-laboratorio.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#014898",
            opacity: 0.7,
            zIndex: 1,
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-xl-10">
                <div className="card" style={{ borderRadius: "1rem" }}>
                  <div className="row g-0">
                    <div className="col-md-6 col-lg-5 d-none d-md-block">
                      <img
                        src={loginImg}
                        alt="login form"
                        className="img-fluid"
                        style={{ borderRadius: "1rem 0 0 1rem" }}
                      />
                    </div>
                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                      <div className="card-body p-4 p-lg-5 text-black">
                        {success && (
                          <div
                            className="alert alert-success text-center"
                            role="alert"
                          >
                            ¡Inicio de sesión exitoso!
                          </div>
                        )} 
                        {error && (
                          <div
                            className="alert alert-warning text-center"
                            role="alert"
                          >
                            Error al iniciar sesión. Por favor, verifica tus credenciales.
                          </div>
                        )}
                        <form onSubmit={handleLogin}>
                          <div className="d-flex align-items-center mb-3 pb-1">
                            <i
                              className="fas fa-cubes fa-2x me-3"
                              style={{ color: "#f9b214" }}
                            ></i>
                            <span className="h1 fw-bold mb-0">Logo</span>
                          </div>

                          <h5
                            className="fw-normal mb-3 pb-3"
                            style={{ letterSpacing: "1px" }}
                          >
                            Ingrese sus datos para iniciar sesión
                          </h5>

                          <div
                            data-mdb-input-init
                            className="form-outline mb-4"
                          >
                            <input
                              type="email"
                              id="form2Example17"
                              className="form-control form-control-lg"
                              name="email"
                            />
                            <label
                              className="form-label"
                              htmlFor="form2Example17"
                            >
                              Dirección de correo electrónico
                            </label>
                          </div>

                          <div
                            data-mdb-input-init
                            className="form-outline mb-4"
                          >
                            <input
                              type="password"
                              id="form2Example27"
                              className="form-control form-control-lg"
                              name="password"
                            />
                            <label
                              className="form-label"
                              htmlFor="form2Example27"
                            >
                              Contraseña
                            </label>
                          </div>

                          <div className="pt-1 mb-4">
                            <button
                              className="btn btn-dark btn-lg btn-block"
                              type="submit"
                              disabled={loading}
                            >
                              {loading ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              ) : (
                                "Ingresar"
                              )}
                            </button>
                          </div>

                          {/* <a className="small text-muted" href="#!">Forgot password?</a>
                  <p className="mb-5 pb-lg-2" style={{ color: "#393f81;" }}>Don't have an account? <a href="#!"
                      style={{ color: "#393f81;" }}>Register here</a></p>
                  <a href="#!" className="small text-muted">Terms of use.</a>
                  <a href="#!" className="small text-muted">Privacy policy</a> */}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default Login;