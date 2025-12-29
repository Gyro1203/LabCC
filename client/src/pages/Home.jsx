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

  const marcarSalida = async (id, body) => {
    try {
      await marcarSalidaRequest(id, body);
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
            onSubmit={async (values, { setSubmitting }) => {
              // No permitir registrar si hay salida pendiente
              if (pendiente.length > 0) return;

              try {
                await createAsistenciasRequest({
                  rut: values.rut,
                  actividad: "",
                });
                setAsistencia({ rut: "", actividad: "" });
                setForm(false);
                values.actividad = "";
              } catch (error) {
                console.error("Error al crear asistencia:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <label htmlFor="rut" className="form-label">Rut</label>
                <div className="input-group">
                  <input
                    type="text"
                    name="rut"
                    className="form-control shadow"
                    value={values.rut || ""}
                    onChange={(event) => {
                      const inputValue = event.target.value;

                      // Solo números, guión y vacío
                      const validPattern = /^[0-9kK-]*$/;

                      if (inputValue === "" || validPattern.test(inputValue)) {
                        handleChange(event); // ← SOLO si es válido
                      }
                    }}
                    maxLength={10}
                    onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                  />

                  {values.rut && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      title="Limpiar"
                      onClick={() => {
                        setAsistencia({ rut: "", actividad: "" });
                        setAlumno(null);
                        setToday([]);
                        setPendiente([]);
                        setForm(false);
                        values.rut = "";
                        values.actividad = "";
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
                <small className="form-text text-muted mb-3">
                  Ingrese su rut sin puntos y con guión
                </small>

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
                        
                        {form ? (
                          <div>
                            <div className="form-group mt-5 mb-1">
                              <h5 htmlFor="actividad" className="form-label">
                                Actividad Realizada
                              </h5>
                              <input
                                type="text"
                                name="actividad"
                                className="form-control"
                                value={values.actividad}
                                onChange={handleChange}
                              />
                            </div> 
                            <small className="form-text text-muted mb-4">
                              Escriba la o las actividades que realizó durante su instancia en el laboratorio
                            </small>
                            
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={async () => {
                                if (!values.actividad.trim()) return;

                                await marcarSalida(pendiente[0].id_asistencia, {
                                  actividad: values.actividad,
                                });

                                setForm(false);
                                setAsistencia((prev) => ({ ...prev, actividad: "" }));
                              }}
                            >
                              Confirmar salida
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex flex-row-reverse">
                            <button
                              className="btn btn-success"
                              type="button"
                              title="Marcar Salida"
                              onClick={async () => {
                                setForm(true);
                                setAsistencia((prev) => ({ ...prev, actividad: "" }));
                              }}
                            >
                              <i className="fa-solid fa-door-open"></i> Marcar
                              Salida
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-primary p-2"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Registrando..." : "Registrar Asistencia"}
                            </button>
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
