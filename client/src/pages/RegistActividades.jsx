import { Form, Formik } from "formik";
import {
  createActividadesRequest,
  getActividadByIdRequest,
  updateActividadesRequest,
} from "../services/actividades.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistActividades() {
  const navigate = useNavigate();

  const [actividad, setActividad] = useState({
    nombre: "",
    unidad: "",
    cantidad: 0,
    precio_uf: 0,
    precio_peso: 0,
    observaciones: "",
    actividad_alumno: 0,
    actividad_ensayo: 0,
    actividad_ingreso: 0,
  }); // Estado para almacenar la actividad si es necesario, aunque no se usa en este ejemplo

  const params = useParams();

  useEffect(() => {
    const fetchActividad = async () => {
      if (params.id) {
        try {
          const dataActividad = await getActividadByIdRequest(params.id);
          //console.log('Actividad encontrada:', dataActividad);
          //const { nombre: _nombre, rut: _rut, ...filtered } = actividad; // nombre y rut is assigned but not used. Solucion
          //console.log('Actividad filtrada:', filtered);
          setActividad(dataActividad.data);
        } catch (error) {
          console.error("Error al obtener la actividad:", error);
        }
      }
    };
    fetchActividad();
  }, [params.id]);

  return (
    <div>
      <h1>
        {params.id
          ? "Editar datos de la actividad"
          : "Registrar nueva actividad"}
      </h1>

      <Formik
        initialValues={actividad}
        enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
        onSubmit={async (values) => {
          try {
            if (params.id) {
              await updateActividadesRequest(params.id, values);
              console.log("Actividad actualizada:", values);
            } else {
              const response = await createActividadesRequest(values);
              console.log("Actividad creada:", response.data);
            }
            setActividad({
              nombre: "",
              unidad: "",
              cantidad: 0,
              precio_uf: 0,
              precio_peso: 0,
              observaciones: "",
              actividad_alumno: 0,
              actividad_ensayo: 0,
              actividad_ingreso: 0,
            });
            navigate("/activity"); // Redirigir a la lista de actividades después de crear o actualizar
          } catch (error) {
            console.error("Error al crear actividad:", error);
          }
        }}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              onChange={handleChange}
              value={values.nombre}
            />

            <label htmlFor="unidad">Unidad</label>
            <input
              type="text"
              name="unidad"
              onChange={handleChange}
              value={values.unidad}
            />

            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              onChange={handleChange}
              value={values.cantidad}
            />

            <label htmlFor="precio_uf">Precio UF</label>
            <input
              type="number"
              name="precio_uf"
              onChange={handleChange}
              value={values.precio_uf}
            />

            <label htmlFor="precio_peso">Precio Peso</label>
            <input
              type="number"
              name="precio_peso"
              onChange={handleChange}
              value={values.precio_peso}
            />

            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              name="observaciones"
              onChange={handleChange}
              value={values.observaciones}
            />

            <label htmlFor="actividad_alumno">Actividad Alumno</label>
            <input
              type="number"
              name="actividad_alumno"
              onChange={handleChange}
              value={values.actividad_alumno}
            />

            <label htmlFor="actividad_ensayo">Actividad Ensayo</label>
            <input
              type="number"
              name="actividad_ensayo"
              onChange={handleChange}
              value={values.actividad_ensayo}
            />

            <label htmlFor="actividad_ingreso">Actividad Ingreso</label>
            <input
              type="number"
              name="actividad_ingreso"
              onChange={handleChange}
              value={values.actividad_ingreso}
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
