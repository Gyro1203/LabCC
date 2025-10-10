import { Form, Formik } from "formik";
import {
  createAlumnosRequest,
  getAlumnoByIdRequest,
  updateAlumnosRequest,
} from "../services/alumnos.api";
import { getCarrerasRequest } from "../services/carreras.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistAlumnos() {
  const navigate = useNavigate();

  const [carreras, setCarreras] = useState([]);

  const [alumno, setAlumno] = useState({
    nombre: "",
    rut: "",
    alumno_carrera: 0,
    estado: "Activo",
  });

  const params = useParams();

  useEffect(() => {
    async function fetchCarreras() {
      try {
        const dataCarreras = await getCarrerasRequest();
        setCarreras(dataCarreras.data);
      } catch (error) {
        console.error("Error al obtener carreras:", error);
      }
    }
    fetchCarreras();
  }, []);

  useEffect(() => {
    const fetchAlumno = async () => {
      if (params.id) {
        try {
          const dataAlumno = await getAlumnoByIdRequest(params.id);
          setAlumno(dataAlumno.data);
        } catch (error) {
          console.error("Error al obtener el alumno:", error);
        }
      }
    };
    fetchAlumno();
  }, [params.id]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start">
        <button
          className="btn btn-secondary mb-4"
          onClick={() => navigate(`/students`)}
        >
          Volver
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id ? "Editar datos del alumno" : "Registrar nuevo alumno"}
          </h1>

          <Formik
            initialValues={alumno}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values) => {
              try {
                if (params.id) {
                  // UPDATE (id, body)
                  await updateAlumnosRequest(params.id, values);
                } else {
                  await createAlumnosRequest(values);
                }
                setAlumno({
                  nombre: "",
                  rut: "",
                  alumno_carrera: 0,
                  estado: "Activo",
                });
                navigate("/students"); // Redirigir a la lista de alumnos después de crear o actualizar
              } catch (error) {
                console.error("Error al crear alumno:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, setFieldValue, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Nombre del Alumno"
                    onChange={handleChange}
                    value={values.nombre}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="rut" className="form-label">
                    Rut
                  </label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    placeholder="12345678-9"
                    onChange={handleChange}
                    value={values.rut}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="alumno_carrera" className="form-label">
                    Carrera
                  </label>
                  <select
                    name="alumno_carrera"
                    className="form-select"
                    onChange={handleChange}
                    value={values.alumno_carrera}
                  >
                    <option value="0" disabled hidden>Selecciona una opción</option>
                    {carreras.map((carrera) => (
                      <option key={carrera.id_carrera} value={carrera.id_carrera}>
                        {carrera.carrera}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="estado" className="form-label">
                    Estado
                  </label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="estado"
                      name="estado"
                      checked={values.estado === "Activo"}
                      onChange={() =>
                        setFieldValue("estado", values.estado === "Activo" ? "Inactivo" : "Activo")
                      }
                      
                    />
                    <label className="form-check-label" htmlFor="estado">
                      {values.estado === "Activo" ? "Activo" : "Inactivo"}
                    </label>
                  </div>
                </div>

                <div className="d-flex flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary p-2"
                  >
                    {isSubmitting ? "Registrando..." : "Registrar"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
