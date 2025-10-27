import { Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import {
  createAsistenciasRequest,
  getAsistenciaByIngresoRequest,
  marcarSalidaRequest,
} from "../services/asistencias.api";
import { getIngresosRequest } from "../services/ingresos.api";
import AsistenciasRows from "../components/AsistenciasRows";

function Home() {

  const [asistencia, setAsistencia] = useState({
    rut: "",
    actividad: "",
  });
  const [alumno, setAlumno] = useState(null);
  const [ingresos, setIngresos] = useState([]);
  const [today, setToday] = useState([]);
  const [pendiente, setPendiente] = useState([]);
  const [form, setForm] = useState(false);

  useEffect(() => {
    // Datos de Update
    const fetchAsistencia = async () => {
      const dataIngresos = await getIngresosRequest();
      setIngresos(dataIngresos.data);
    };
    fetchAsistencia();
  }, [asistencia]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      if (alumno) {
        const dataAsistencias = await getAsistenciaByIngresoRequest(
          alumno.id_ingreso
        );
        //console.log("dataAsistencias: ", dataAsistencias);
        const salidaPendiente = dataAsistencias.data.filter(
          (asistencia) => !asistencia.salida
        );
        //console.log("salidaPendiente: ", salidaPendiente);

        const hoy = new Date();
        const fechaHoy = new Intl.DateTimeFormat('es-CL', { 
          timeZone: 'America/Santiago',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(hoy).split('-').join('/');

        const salidaHoy = dataAsistencias.data.filter((asistencia) => {
          if (!asistencia.fecha) return false;
          return asistencia.fecha === fechaHoy;
        });
        setToday(salidaHoy);
        // console.log("salidaHoy: ", salidaHoy);

        if (salidaPendiente && salidaPendiente.length > 0)
          setPendiente(salidaPendiente);
        else setPendiente([]);
      } else {
        setPendiente([]);
      }
    };
    fetchAsistencias();
  }, [alumno]);

  const BuscarAlumno = ({ setAlumno }) => {
    const { values } = useFormikContext();

    useEffect(() => {
      if (values.rut) {
        const dataAlumno = ingresos.find(
          ({ rut, vigente }) => rut == values.rut && vigente
        ); //o vigente == true;
        setAlumno(dataAlumno);
      }
    }, [values.rut, setAlumno]);

    return null;
  };

  const marcarSalida = async (id) => {
    try {
      await marcarSalidaRequest(id);
      // Refresca los datos de asistencias
      if (alumno) {
        const dataAsistencias = await getAsistenciaByIngresoRequest(
          alumno.id_ingreso
        );
        const salidaPendiente = dataAsistencias.data.filter(
          (asistencia) => !asistencia.salida
        );

        const hoy = new Date();
        const fechaHoy = new Intl.DateTimeFormat('es-CL', { 
          timeZone: 'America/Santiago',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(hoy).split('-').join('/');
        const salidaHoy = dataAsistencias.data.filter((asistencia) => {
          if (!asistencia.fecha) return false;
          return asistencia.fecha === fechaHoy;
        });

        setToday(salidaHoy);
        setPendiente(
          salidaPendiente && salidaPendiente.length > 0 ? salidaPendiente : []
        );
      }
    } catch (error) {
      console.error("Error al marcar salida:", error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            Registrar asistencias
          </h1>

          <Formik
            initialValues={asistencia}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values) => {
              try {
                await createAsistenciasRequest(values);
                setAsistencia({
                  rut: "",
                  actividad: "",
                });
                setForm(false);
              } catch (error) {
                console.error("Error al crear asistencia:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="rut" className="form-label">
                    Rut
                  </label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.rut || ""}
                  />
                </div>

                <BuscarAlumno setAlumno={setAlumno} />

                {alumno && (
                  <div className="row mb-3">
                    <h2 className="d-flex justify-content-center">
                      {!alumno ? "" : alumno.nombre}
                    </h2>
                    {today && today.length > 0 ? (
                      <div>
                        <h3>Registros de asistencias del Día</h3>
                        <table className="table table-striped table-hover table-bordered">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Jornada</th>
                              <th>Entrada</th>
                              <th>Actividad</th>
                              <th>Salida</th>
                            </tr>
                          </thead>
                          <tbody>
                            {today.map((asistencia) => (
                              <AsistenciasRows
                                asistencia={asistencia}
                                key={asistencia.id_asistencia}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div>
                        <h3 className="d-flex justify-content-center">
                          No se encontraron asistencias registradas el día de hoy. 
                        </h3>
                      </div>
                    )}

                    {pendiente && pendiente.length > 0 ? (
                      <div className="mt-3">
                        <h3>Salida Pendiente</h3>
                        <table className="table table-striped table-hover table-bordered mt-4">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Jornada</th>
                              <th>Entrada</th>
                              <th>Actividad</th>
                              <th>Salida</th>
                            </tr>
                          </thead>
                          <tbody>
                            <AsistenciasRows asistencia={pendiente[0]} />
                          </tbody>
                        </table>
                        <div className="d-flex flex-row-reverse">
                          <button
                            className="btn btn-success"
                            type="button"
                            title="Marcar Salida"
                            onClick={async () => {
                              await marcarSalida(pendiente[0].id_asistencia);
                              // window.location.reload();
                            }}
                          >
                            <i className="fa-solid fa-door-open"></i> Marcar
                            Salida
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {form ? (
                          <div>
                            <div className="form-group mt-3 mb-3">
                              <h5 htmlFor="actividad" className="form-label">
                                Ingrese la actividad que va a realizar
                              </h5>
                              <input
                                type="text"
                                name="actividad"
                                className="form-control"
                                onChange={handleChange}
                                value={values.actividad}
                              />
                            </div>
                            <div className="d-flex flex-row-reverse">
                              <button
                                className="btn btn-primary p-2 ms-2"
                                type="submit"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Registrando..." : "Registrar"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-primary p-2"
                              type="button"
                              title="Registrar Asistencia"
                              onClick={() => {
                                setForm(true);
                              }}
                            >
                              Registrar Asistencia
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Home;
