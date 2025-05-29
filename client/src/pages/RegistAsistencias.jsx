import { Form, Formik } from "formik";
import {
  createAsistenciasRequest,
  getAsistenciaByIdRequest,
  updateAsistenciasRequest
} from "../services/asistencias.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistAsistencias() {
  const navigate = useNavigate();

  const [asistencia, setAsistencia] = useState({
    jornada: "",
    asistencia_alumno: 0,
    asistencia_actividad: 0,
  }); // Estado para almacenar la asistencia si es necesario, aunque no se usa en este ejemplo

  const params = useParams();

  useEffect(() => {
    const fetchAsistencia = async () => {
      if (params.id) {
        try {
          const asistencia = await getAsistenciaByIdRequest(params.id);
          console.log('Asistencia encontrada:', asistencia);
          const { alumno: _alumno, actividad: _actividad, entrada: _entrada, salida: _salida, ...filtered } = asistencia; // nombre y rut is assigned but not used. Solucion
          console.log('Asistencia filtrada:', filtered);
          setAsistencia(filtered);
        } catch (error) {
          console.error("Error al obtener la asistencia:", error);
        }
      }
    };
    fetchAsistencia();
  }, [params.id]);

  return (
    <div>
      <h1>
        {params.id ? "Editar datos de la asistencia" : "Registrar nueva asistencia"}
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
              console.log("Asistencia creada:", response);
            }
            setAsistencia({
                jornada: "",
                asistencia_alumno: 0,
                asistencia_actividad: 0,
            });
            navigate("/attendance"); // Redirigir a la lista de asistencias después de crear o actualizar
          } catch (error) {
            console.error("Error al crear asistencia:", error);
          }
        }}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <label htmlFor="jornada">Jornada</label>
            <input
              type="text"
              name="jornada"
              onChange={handleChange}
              value={values.jornada}
            />

            <label htmlFor="asistencia_alumno">ID Alumno</label>
            <input
              type="number"
              name="asistencia_alumno"
              onChange={handleChange}
              value={values.asistencia_alumno}
            />

            <label htmlFor="asistencia_actividad">ID Actividad</label>
            <input
              type="number"
              name="asistencia_actividad"
              onChange={handleChange}
              value={values.asistencia_actividad}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : "Registrar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
