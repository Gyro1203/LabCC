import { Form, Formik } from "formik";
import {
  createActividadesRequest,
  getActividadByIdRequest,
  updateActividadesRequest,
} from "../services/actividades.api";
import { getEnsayosRequest } from "../services/ensayos.api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistActividades() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [actividad, setActividad] = useState({
    actividad_ensayo: "",
    cantidad: 1,
    observaciones: "",
    actividad_ingreso: state || 1,
  }); // Estado para almacenar la actividad si es necesario, aunque no se usa en este ejemplo

  const [ensayos, setEnsayos] = useState([]);

  const params = useParams();

  useEffect(() => {
    const fetchActividad = async () => {
      const dataEnsayos = await getEnsayosRequest();
      console.log(dataEnsayos.data);
      setEnsayos(dataEnsayos.data);
      if (params.id) {
        try {
          const dataActividad = await getActividadByIdRequest(params.id);
          console.log("Actividad encontrada:", dataActividad);
          const {
            actividad: _actividad,
            alumno: _alumno,
            precio_peso: _precio_peso,
            precio_uf: _precio_uf,
            total_peso: _total_peso,
            total_uf: _total_uf,
            unidad: _unidad,
            ...filtered
          } = dataActividad.data; // actividad_ensayo y rut is assigned but not used. Solucion
          console.log("Actividad filtrada:", filtered);
          setActividad(filtered);
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
                  console.log("values", values);
                  await updateActividadesRequest(params.id, values);
                  console.log("Actividad actualizada:", values);
                } else {
                  const response = await createActividadesRequest(values);
                  console.log("Actividad creada:", response.data);
                }
                setActividad({
                  actividad_ensayo: "",
                  cantidad: 1,
                  observaciones: "",
                  actividad_ingreso: state || 1,
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
                  <label htmlFor="actividad_ensayo" className="form-label">
                    Actividad
                  </label>
                  <select
                    name="actividad_ensayo"
                    className="form-select"
                    onChange={handleChange}
                    value={values.actividad_ensayo}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opción
                    </option>
                    {ensayos.map((ensayo) => (
                      <option key={ensayo.id_ensayo} value={ensayo.id_ensayo}>
                        {ensayo.actividad}
                      </option>
                    ))}
                  </select>
                </div>

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
                    value={values.observaciones || ""}
                  />
                </div>

                <div className="form-group mb-3" hidden>
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
