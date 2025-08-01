import { Form, Formik } from "formik";
import ReporteAsistencias from "../components/Reportes/ReporteAsistencias";
import ReporteIngresos from "../components/Reportes/ReporteIngresos";

function Reportes() {
  const data = {
    tipo: "",
    nombre: "",
  };

  return (
    <div className="container text-center mb-5 mt-5 bg-warning">
      <div className="row justify-content-center">
        <div className="col-md-6 bg-success">
          <h1>Generar Reportes</h1>
          <Formik initialValues={data} enableReinitialize={true}>
            {({ handleChange, handleSubmit, values }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="tipoReporte" className="form-label">
                    Tipo de informe
                  </label>
                  <select
                    id="tipoReporte"
                    name="tipo"
                    className="form-select"
                    onChange={handleChange}
                    value={values.tipo}
                  >
                    <option value="" disabled hidden>
                      Seleccione una opción
                    </option>
                    <option value="1">Asistencias</option>
                    <option value="2">Ingresos</option>
                    <option value="3">Totales</option>
                  </select>
                </div>
                {values.tipo === "1" && (
                  <ReporteAsistencias
                    handleChange={handleChange}
                    values={values}
                  />
                )}
                {values.tipo === "2" && (
                  <ReporteIngresos
                    handleChange={handleChange}
                    values={values}
                  />
                )}
                {values.tipo === "3" && <div>Mostrando reporte Totales</div>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
