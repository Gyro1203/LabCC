import { Form, Formik } from "formik";
import {
  createIngresosRequest,
  getIngresoByIdRequest,
  updateIngresosRequest,
} from "../services/ingresos.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistIngresos() {
  const navigate = useNavigate();

  const [ingreso, setIngreso] = useState({
    rut: "",
    motivo: "",
    titulo: "",
    profesor_guia: "",
    profesor_asignatura: "",
    semestre: "",
    vigente: true,
    ingreso_alumno: "1",
  }); // Estado para almacenar el ingreso si es necesario
  const [fecha, setFecha] = useState("");
  const params = useParams();

  useEffect(() => {
    const fetchIngreso = async () => {
      const fechaActual = new Date().toISOString().split("T")[0].split("-")[0];
      console.log(fechaActual);
      setFecha(fechaActual);
      if (params.id) {
        try {
          const dataIngreso = await getIngresoByIdRequest(params.id);
          //console.log('Ingreso encontrado:', dataIngreso);
          const {
            nombre: _nombre,
            ingreso_alumno: _ingreso_alumno,
            ...filtered
          } = dataIngreso.data; // nombre y rut is assigned but not used. Solucion
          // console.log("Ingreso filtrado:", filtered);
          setIngreso(filtered);
        } catch (error) {
          console.error("Error al obtener el ingreso:", error);
        }
      }
    };
    fetchIngreso();
  }, [params.id]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start">
        <button
          className="btn btn-secondary mb-4"
          onClick={() => navigate(`/entry`)}
        >
          Volver
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id ? "Editar datos del ingreso" : "Registrar nuevo ingreso"}
          </h1>

          <Formik
            initialValues={ingreso}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values) => {
              try {
                if (params.id) {
                  await updateIngresosRequest(params.id, values);
                } else {
                  await createIngresosRequest(values);
                }
                setIngreso({
                  rut: "",
                  motivo: "",
                  titulo: "",
                  profesor_guia: "",
                  profesor_asignatura: "",
                  semestre: "",
                  vigente: true,
                  ingreso_alumno: "1",
                });
                navigate("/entry"); // Redirigir a la lista de ingresos después de crear o actualizar
              } catch (error) {
                console.error("Error al crear ingreso:", error);
              }
            }}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="rut" className="form-label">
                    Rut del alumno
                  </label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    onChange={handleChange}
                    value={values.rut}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="motivo" className="form-label">
                    Motivo de ingreso
                  </label>
                  <select
                    name="motivo"
                    className="form-select"
                    onChange={handleChange}
                    value={values.motivo}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opción
                    </option>
                    <option value="Seminario Aplicado">
                      Seminario Aplicado
                    </option>
                    <option value="Tesis o Proyecto de Titulo">
                      Tesis o Proyecto de Titulo
                    </option>
                    <option value="Proyecto de Investigación">
                      Proyecto de Investigación
                    </option>
                    <option value="Practica I">Practica I</option>
                    <option value="Practica II">Practica II</option>
                    <option value="Practica III">Practica III</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="titulo" className="form-label">
                    Título del proyecto
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    className="form-control"
                    onChange={handleChange}
                    value={values.titulo}
                  />
                  <small className="form-text text-muted">
                    Si no tiene, dejar este campo en blanco
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="profesor_guia" className="form-label">
                    Profesor Guía
                  </label>
                  <input
                    type="text"
                    name="profesor_guia"
                    className="form-control"
                    onChange={handleChange}
                    value={values.profesor_guia}
                  />
                  <small className="form-text text-muted">
                    Si no tiene, dejar este campo en blanco
                  </small>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="profesor_asignatura" className="form-label">
                    Profesor Asignatura
                  </label>
                  <input
                    type="text"
                    name="profesor_asignatura"
                    className="form-control"
                    onChange={handleChange}
                    value={values.profesor_asignatura}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="semestre" className="form-label">
                    Semestre
                  </label>
                  <select
                    name="semestre"
                    className="form-control"
                    onChange={handleChange}
                    value={values.semestre}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opción
                    </option>
                    <option value={`${fecha}-1`}>{`${fecha}-1`}</option>
                    <option value={`${fecha}-2`}>{`${fecha}-2`}</option>
                  </select>
                </div>

                {params.id ? (
                  <div className="form-group mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="vigente"
                        name="vigente"
                        checked={Boolean(values.vigente)} // Convierte 1/0 a true/false
                        onChange={() =>
                          setFieldValue("vigente", !values.vigente)
                        }
                      />
                      <label className="form-check-label" htmlFor="vigente">
                        {values.vigente ? "Vigente" : "No Vigente"}
                      </label>
                    </div>
                  </div>
                ) : null}

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
