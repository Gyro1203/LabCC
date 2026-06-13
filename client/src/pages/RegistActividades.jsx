import { Form, Formik } from "formik";
import {
  createActividadesRequest,
  getActividadByIdRequest,
  updateActividadesRequest,
  getActividadesByIngresoRequest,
} from "../services/actividades.api";
import { getIngresoByIdRequest } from "../services/ingresos.api.js";
import { getEnsayosRequest } from "../services/ensayos.api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showSuccessAlert, showErrorAlert } from "../helpers/sweetAlert";
import ActividadesRows from "../components/ActividadesRows.jsx";

export default function RegistActividades() {
  const navigate = useNavigate();
  const { state = {} } = useLocation();

  const defaultActividad = {
    actividad_ensayo: "",
    cantidad: 1,
    observaciones: "",
    actividad_ingreso: state.id_ingreso || "",
  };

  const [actividad, setActividad] = useState(defaultActividad);
  const [ensayos, setEnsayos] = useState([]);
  const [addMore, setAddMore] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [alumno, setAlumno] = useState(state.alumno || "");

  const params = useParams();

  const loadActividades = async (ingresoId) => {
    try {
      const response = await getActividadesByIngresoRequest(ingresoId);
      setActividades(response.data);
    } catch (error) {
      console.error("Error al cargar actividades del ingreso:", error);
      setActividades([]);
    }
  };

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const dataEnsayos = await getEnsayosRequest();
        setEnsayos(dataEnsayos.data);

        let ingresoId = state.id_ingreso;
        let alumnoNombre = state.alumno;

        if (params.id) {
          const dataActividad = await getActividadByIdRequest(params.id);
          const {
            actividad: _actividad,
            precio_peso: _precio_peso,
            precio_uf: _precio_uf,
            total_peso: _total_peso,
            total_uf: _total_uf,
            unidad: _unidad,
            ...filtered
          } = dataActividad.data;
          setActividad(filtered);
          ingresoId = ingresoId || filtered.actividad_ingreso;
        }

        if (ingresoId) {
          if (!alumnoNombre) {
            try {
              const ingresoResponse = await getIngresoByIdRequest(ingresoId);
              alumnoNombre = ingresoResponse.data.nombre || ingresoResponse.data.alumno || alumnoNombre;
            } catch (error) {
              console.error("Error al obtener ingreso para alumno:", error);
            }
          }
          setAlumno(alumnoNombre || "");
          await loadActividades(ingresoId);
          setActividad((prevState) => ({
            ...prevState,
            actividad_ingreso: ingresoId,
          }));
        }
      } catch (error) {
        console.error("Error en la carga inicial de la actividad:", error);
      }
    };
    fetchActividad();
  }, [params.id, state.id_ingreso, state.alumno]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-start">
        <button
          className="btn btn-secondary mb-4"
          onClick={() => navigate(state.from || "/")}
        >
          Volver
        </button>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id
              ? "Editar datos de la actividad"
              : "Registrar nueva actividad"}
          </h1>
            {alumno && (
              <p className="text-center mb-4 fs-5">
                <strong>Alumno:</strong> {alumno}
              </p>
            )}
          <Formik
            initialValues={actividad}
            enableReinitialize={true}
            onSubmit={async (values, { resetForm }) => {
              try {
                if (params.id) {
                  await updateActividadesRequest(params.id, values);
                  showSuccessAlert("Actividad actualizada", "Los datos se guardaron correctamente");
                  navigate(state.from || "/");
                  return;
                }

                const response = await createActividadesRequest(values);
                const nuevaActividad = response.data;
                setActividades((prev) => [...prev, nuevaActividad]);
                showSuccessAlert("Actividad añadida", "La actividad se registró correctamente");

                if (!addMore) {
                  navigate(state.from || "/");
                } else {
                  const nextValues = {
                    ...defaultActividad,
                    actividad_ingreso: values.actividad_ingreso,
                  };
                  setActividad(nextValues);
                  resetForm({ values: nextValues });
                }
              } catch (error) {
                const errorMessage =
                  error.response?.data?.details ||
                  error.response?.data?.message ||
                  error.message ||
                  "Error desconocido";
                showErrorAlert("Error al guardar actividad", errorMessage);
                console.error("Error al guardar actividad:", error.response || error);
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

                {params.id ? null : (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkDefault"
                      checked={addMore}
                      onChange={() => setAddMore(!addMore)}
                    />
                    <label className="form-check-label" htmlFor="checkDefault">
                      Añadir mas de una actividad.
                    </label>
                  </div>
                )}

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

        <div className="col-md-8">
          <h2 className="mb-3">Actividades registradas</h2>
          {actividades.length > 0 ? (
            <table className="table table-striped table-hover table-bordered">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Unidad</th>
                  <th>Cantidad</th>
                  <th>Precio UF</th>
                  <th>Precio $</th>
                  <th>Total UF</th>
                  <th>Total $</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map((act) => (
                  <ActividadesRows 
                    key={act.id_actividad} 
                    actividad={act} 
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-light border rounded p-3">
              No hay actividades registradas para este ingreso.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}