import { Form, Formik } from "formik";
import {
  createAsistenciasRequest,
  getAsistenciaByIdRequest,
  updateAsistenciasRequest,
} from "../services/asistencias.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistAsistencias() {
  const navigate = useNavigate();

  const [asistencia, setAsistencia] = useState({
    jornada: "Mañana",
    asistencia_ingreso: 1,
    asistencia_actividad: 1,
  }); // Estado para almacenar la asistencia si es necesario, aunque no se usa en este ejemplo

  const params = useParams();

  useEffect(() => {
    const fetchAsistencia = async () => {
      if (params.id) {
        try {
          const dataAsistencia = await getAsistenciaByIdRequest(params.id);
          console.log("Asistencia encontrada:", dataAsistencia);
          const {
            alumno: _alumno,
            actividad: _actividad,
            entrada: _entrada,
            salida: _salida,
            ...filtered
          } = dataAsistencia.data; // nombre y rut is assigned but not used. Solucion
          console.log("Asistencia filtrada:", filtered);
          setAsistencia(filtered);
        } catch (error) {
          console.error("Error al obtener la asistencia:", error);
        }
      }
    };
    fetchAsistencia();
  }, [params.id]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id
              ? "Editar datos de la asistencia"
              : "Registrar nueva asistencia"}
          </h1>

          <Formik
            initialValues={asistencia}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values) => {
              try {
                if (params.id) {
                  await updateAsistenciasRequest(params.id, values);
                  console.log("Asistencia actualizada:", values);
                } else {
                  const response = await createAsistenciasRequest(values);
                  console.log("Asistencia creada:", response.data);
                }
                setAsistencia({
                  jornada: "Mañana",
                  asistencia_ingreso: 1,
                  asistencia_actividad: 1,
                });
                navigate("/attendance"); // Redirigir a la lista de asistencias después de crear o actualizar
              } catch (error) {
                console.error("Error al crear asistencia:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="jornada" className="form-label">
                    Jornada
                  </label>
                  <select
                    name="jornada"
                    className="form-select"
                    onChange={handleChange}
                    value={values.jornada}
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="asistencia_ingreso" className="form-label">
                    ID Ingreso
                  </label>
                  <input
                    type="number"
                    name="asistencia_ingreso"
                    className="form-control"
                    onChange={handleChange}
                    value={values.asistencia_ingreso}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="asistencia_actividad" className="form-label">
                    ID Actividad
                  </label>
                  <input
                    type="number"
                    name="asistencia_actividad"
                    className="form-control"
                    onChange={handleChange}
                    value={values.asistencia_actividad}
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
