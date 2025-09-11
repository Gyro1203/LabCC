import { Form, Formik } from "formik";
import {
  createEnsayosRequest,
  getEnsayoByIdRequest,
  updateEnsayosRequest,
} from "../services/ensayos.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showSuccessAlert } from "../helpers/sweetAlert";

export default function RegistEnsayos() {
  const navigate = useNavigate();

  const [ensayo, setEnsayo] = useState({
    actividad: "",
    area: "",
    unidad: "",
    precio_uf: "1",
  });

  const params = useParams();

  useEffect(() => {
    const fetchEnsayo = async () => {
      if (params.id) {
        try {
          const dataEnsayo = await getEnsayoByIdRequest(params.id);
          const {
            precio_peso: _precio_peso,
            ...filtered
          } = dataEnsayo.data;
          setEnsayo(filtered);
        } catch (error) {
          console.error("Error al obtener el ensayo:", error);
        }
      }
    };
    fetchEnsayo();
  }, [params.id]);

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary" onClick={() => navigate("/essay")}>
        Volver
      </button>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id ? "Editar datos del ensayo" : "Registrar nuevo ensayo"}
          </h1>
          <Formik
            initialValues={ensayo}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values, { resetForm }) => {
              try {
                if (params.id) {
                  await updateEnsayosRequest(params.id, values);
                  navigate("/essay"); // Redirigir a la lista de ensayos después de crear o actualizar
                } else {
                  await createEnsayosRequest(values);
                  showSuccessAlert("Ensayo creado exitosamente");
                }
                resetForm({
                  values: {
                    actividad: "",
                    area: "",
                    unidad: "",
                    precio_uf: "1",
                  },
                });
              } catch (error) {
                console.error("Error al crear ensayo:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="actividad" className="form-label">
                    Actividad
                  </label>
                  <input
                    type="text"
                    name="actividad"
                    className="form-control"
                    placeholder="Nombre de la actividad"
                    onChange={handleChange}
                    value={values.actividad}
                  />
                  <div className="valid-feedback"></div>
                  <div className="invalid-feedback">Campo requerido</div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="area" className="form-label">
                    Area
                  </label>
                  <select
                    name="area"
                    className="form-select"
                    onChange={handleChange}
                    value={values.area}
                  >
                    <option value="" disabled hidden>
                      Selecciona una opción
                    </option>
                    <option value="Mecanica de suelos">
                      Mecanica de suelos
                    </option>
                    <option value="Asfaltos">Asfaltos</option>
                    <option value="Hormigón">Hormigón</option>
                    <option value="Elementos y Componentes">
                      Elementos y Componentes
                    </option>
                  </select>
                  <div className="invalid-feedback">
                    Por favor, selecciona una opción válida.
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unidad" className="form-label">
                    Unidad
                  </label>
                  <input
                    type="text"
                    name="unidad"
                    className="form-control"
                    onChange={handleChange}
                    value={values.unidad}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="precio_uf" className="form-label">
                    Costo
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="number"
                      name="precio_uf"
                      className="form-control"
                      onChange={handleChange}
                      value={values.precio_uf}
                    />
                    <span className="input-group-text">UF</span>
                  </div>
                  <small className="form-text text-muted">
                    El monto sera ingresado en UF
                  </small>
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
