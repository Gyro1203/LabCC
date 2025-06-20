import { Form, Formik } from "formik";
import {
  createAlumnosRequest,
  getAlumnoByIdRequest,
  updateAlumnosRequest,
} from "../services/alumnos.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistAlumnos() {
  const navigate = useNavigate();

  const [alumno, setAlumno] = useState({
    nombre: "",
    rut: "",
    carrera: "",
    facultad: "",
    departamento: "",
  });

  const params = useParams();

  useEffect(() => {
    const fetchAlumno = async () => {
      if (params.id) {
        try {
          const dataAlumno = await getAlumnoByIdRequest(params.id);
          console.log("Alumno encontrado:", dataAlumno);
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
                  const response = await updateAlumnosRequest(
                    params.id,
                    values
                  );
                  console.log(response);
                  console.log("Alumno actualizado:", values);
                } else {
                  const response = await createAlumnosRequest(values);
                  console.log("Alumno creado:", response.data);
                }
                setAlumno({
                  nombre: "",
                  rut: "",
                  carrera: "",
                  facultad: "",
                  departamento: "",
                });
                navigate("/students"); // Redirigir a la lista de alumnos después de crear o actualizar
              } catch (error) {
                console.error("Error al crear alumno:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
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
                  <label htmlFor="rut" className="form-label">Rut</label>
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
                  <label htmlFor="carrera" className="form-label">Carrera</label>
                  <input
                    type="text"
                    name="carrera"
                    className="form-control"
                    placeholder="Ingenieria en..."
                    onChange={handleChange}
                    value={values.carrera}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="facultad" className="form-label">Facultad</label>
                  <input
                    type="text"
                    name="facultad"
                    className="form-control"
                    placeholder=""
                    onChange={handleChange}
                    value={values.facultad}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="departamento" className="form-label">Departamento</label>
                  <textarea
                    type="text"
                    name="departamento"
                    className="form-control"
                    placeholder=""
                    onChange={handleChange}
                    value={values.departamento}
                  />
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
