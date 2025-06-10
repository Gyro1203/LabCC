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
    cantidad: 0,
    observaciones: "",
    actividad_ensayo: 1,
    actividad_ingreso: 1,
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
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
                  cantidad: 0,
                  observaciones: "",
                  actividad_ensayo: 1,
                  actividad_ingreso: 1,
                });
                navigate("/activity"); // Redirigir a la lista de actividades después de crear o actualizar
              } catch (error) {
                console.error("Error al crear actividad:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="cantidad" className="form-label">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="cantidad"
                    className="form-control"
                    onChange={handleChange}
                    value={values.cantidad}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="observaciones" className="form-label">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    onChange={handleChange}
                    className="form-control"
                    value={values.observaciones}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="actividad_ensayo" className="form-label">
                    Actividad Ensayo
                  </label>
                  <input
                    type="number"
                    name="actividad_ensayo"
                    className="form-control"
                    onChange={handleChange}
                    value={values.actividad_ensayo}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="actividad_ingreso" className="form-label">
                    Actividad Ingreso
                  </label>
                  <input
                    type="number"
                    name="actividad_ingreso"
                    className="form-control"
                    onChange={handleChange}
                    value={values.actividad_ingreso}
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
