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
    motivo: "",
    titulo: "",
    profesor_guia: "",
    profesor_asignatura: "",
    semestre: "",
    vigente: "",
    ingreso_alumno: "",
  }); // Estado para almacenar el ingreso si es necesario, aunque no se usa en este ejemplo

  const params = useParams();

  useEffect(() => {
    const fetchIngreso = async () => {
      if (params.id) {
        try {
          const dataIngreso = await getIngresoByIdRequest(params.id);
          //console.log('Ingreso encontrado:', dataIngreso);
          const { nombre: _nombre, rut: _rut, ...filtered } = dataIngreso.data; // nombre y rut is assigned but not used. Solucion
          //console.log('Ingreso filtrado:', filtered);
          setIngreso(filtered);
        } catch (error) {
          console.error("Error al obtener el ingreso:", error);
        }
      }
    };
    fetchIngreso();
  }, [params.id]);

  return (
    <div>
      <h1>
        {params.id ? "Editar datos del ingreso" : "Registrar nuevo ingreso"}
      </h1>

      <Formik
        initialValues={ingreso}
        enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
        onSubmit={async (values) => {
          try {
            if (params.id) {
              await updateIngresosRequest(params.id, values);
              console.log("Ingreso actualizado:", values);
            } else {
              const response = await createIngresosRequest(values);
              console.log("Ingreso creado:", response.data);
            }
            setIngreso({
              motivo: "",
              titulo: "",
              profesor_guia: "",
              profesor_asignatura: "",
              semestre: "",
              vigente: "",
              ingreso_alumno: "",
            });
            navigate("/entry"); // Redirigir a la lista de ingresos después de crear o actualizar
          } catch (error) {
            console.error("Error al crear ingreso:", error);
          }
        }}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <label htmlFor="motivo">Motivo</label>
            <input
              type="text"
              name="motivo"
              onChange={handleChange}
              value={values.motivo}
            />

            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              name="titulo"
              onChange={handleChange}
              value={values.titulo}
            />

            <label htmlFor="profesor_guia">Profesor Guía</label>
            <input
              type="text"
              name="profesor_guia"
              onChange={handleChange}
              value={values.profesor_guia}
            />

            <label htmlFor="profesor_asignatura">Profesor Asignatura</label>
            <input
              type="text"
              name="profesor_asignatura"
              onChange={handleChange}
              value={values.profesor_asignatura}
            />

            <label htmlFor="semestre">Semestre</label>
            <input
              type="text"
              name="semestre"
              onChange={handleChange}
              value={values.semestre}
            />

            <label htmlFor="ingreso_alumno">ID Alumno</label>
            <input
              type="number"
              name="ingreso_alumno"
              onChange={handleChange}
              value={values.ingreso_alumno}
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
