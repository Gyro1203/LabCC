import { useState } from "react";
import AlumnosCardContent from "./AlumnosCardContent.jsx";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import AsistenciasRows from "../AsistenciasRows.jsx";
import { getActividadesByIngresoRequest } from "../../services/actividades.api.js";
import { getAsistenciaByIngresoRequest } from "../../services/asistencias.api.js";
import PDFCreator from "../PDFCreator.jsx";

function AlumnosDetailCard({ alumno, ingresos, eliminar, editar }) {
  const [actividades, setActividades] = useState({});
  const [asistencias, setAsistencias] = useState([]);

  function GetActivities(id) {
    const fetchActivities = async () => {
      try {
        const dataActividades = await getActividadesByIngresoRequest(id);
        setActividades((prevData) => ({
          ...prevData, //Carga los datos anteriores del objeto para mantenerlos
          [id]:
            dataActividades.data && dataActividades.data.length > 0 // actualiza los datos del objeto con ese id
              ? dataActividades.data
              : [],
        }));
      } catch (error) {
        console.log("Error al obtener actividades:", error);
        setActividades((prevData) => ({ ...prevData, [id]: [] })); // En caso de error el contenido es vacio.
      }
    };
    fetchActivities();
  }

  function GetAttendance(id) {
    const fetchAttendance = async () => {
      try {
        const dataAsistencias = await getAsistenciaByIngresoRequest(id);
        console.log(dataAsistencias);
        setAsistencias((prevData) => ({
          ...prevData, //Carga los datos anteriores del objeto para mantenerlos
          [id]:
            dataAsistencias.data && dataAsistencias.data.length > 0 // actualiza los datos del objeto con ese id
              ? dataAsistencias.data
              : [],
        }));
      } catch (error) {
        console.log("Error al obtener asistencias:", error);
        setAsistencias((prevData) => ({ ...prevData, [id]: [] })); // En caso de error el contenido es vacio.
      }
    };
    fetchAttendance();
  }

  return (
    <div className="list-group text-center">
      <AlumnosCardContent alumno={alumno} eliminar={eliminar} editar={editar} />

      {/* BOTONES TABS */}
      <Tabs defaultActiveKey="Actividades" id="TabCard" className="">
        {/* ACTIVIDADES */}
        <Tab
          eventKey="Actividades"
          title="Actividades"
          className="p-3 bg-light"
        >
          <Accordion>
            {ingresos[alumno.id_alumno]?.length > 0 ? (
              <div className="bg-light">
                {ingresos[alumno.id_alumno].map((ing) => (
                  <Accordion.Item
                    key={`activitiesItem-${ing.id_ingreso}`}
                    eventKey={ing.id_ingreso}
                  >
                    <Accordion.Header
                      className="p-0"
                      onClick={() => GetActivities(ing.id_ingreso)}
                    >
                      {ing.vigente} | {ing.motivo} | {ing.titulo} | {ing.semestre}
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ul
                        className="list-group mx-auto"
                        style={{ maxWidth: "95%" }}
                      >
                        {actividades[ing.id_ingreso]?.length > 0 ? (
                          <div className="mt-3 mb-3">
                            <li className="list-group-item list-group-item-info text-center">
                              ACTIVIDADES
                            </li>
                            {actividades[ing.id_ingreso].map((actividad) => (
                              <li
                                key={actividad.id_actividad}
                                className="list-group-item"
                              >
                                {actividad.nombre}
                              </li>
                            ))}
                          </div>
                        ) : (
                          <li className="list-group-item list-group-item-secondary text-center mt-3 mb-3">
                            ESTE INGRESO NO TIENE ACTIVIDADES REGISTRADAS
                          </li>
                        )}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </div>
            ) : (
              <div>
                <h1>No se encontraron Ingresos</h1>
              </div>
            )}
          </Accordion>
        </Tab>

        {/* ASISTENCIAS */}
        <Tab
          eventKey="Asistencias"
          title="Asistencias"
          className="p-3 bg-light"
        >
          <Accordion>
            {ingresos[alumno.id_alumno]?.length > 0 ? (
              <div className="bg-light">
                {ingresos[alumno.id_alumno].map((ing) => (
                  <Accordion.Item
                    key={`assistanceItem-${ing.id_ingreso}`}
                    eventKey={ing.id_ingreso}
                  >
                    <Accordion.Header
                      className="p-0"
                      onClick={() => GetAttendance(ing.id_ingreso)}
                    >
                      {ing.vigente} | {ing.motivo} | {ing.titulo} | {ing.semestre}
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ul
                        className="list-group mx-auto"
                        style={{ maxWidth: "95%" }}
                      >
                        {asistencias[ing.id_ingreso]?.length > 0 ? (
                          <div className=" mt-3 mb-3">
                            <li className="list-group-item list-group-item-info text-center">
                              ASISTENCIAS
                            </li>
                            <li>
                              <table className="table table-striped table-hover table-bordered">
                                <thead>
                                  <tr>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Jornada</th>
                                    <th scope="col">Entrada</th>
                                    <th scope="col">Actividad</th>
                                    <th scope="col">Salida</th>
                                  </tr>
                                </thead>
                                <tbody id="body_table">
                                  {asistencias[ing.id_ingreso].map(
                                    (asistencia) => (
                                      <AsistenciasRows
                                        key={asistencia.id_asistencia}
                                        asistencia={asistencia}
                                      />
                                    )
                                  )}
                                </tbody>
                              </table>
                            </li>
                          </div>
                        ) : (
                          <li className="list-group-item list-group-item-secondary text-center mt-3 mb-3">
                            ESTE INGRESO NO TIENE ASISTENCIAS REGISTRADAS
                          </li>
                        )}
                      </ul>
                      <PDFCreator alumno={alumno} ingreso={ing} asistencias={asistencias[ing.id_ingreso]}/>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </div>
            ) : (
              <div>
                <h1>No se encontraron Ingresos</h1>
              </div>
            )}
          </Accordion>
        </Tab>
      </Tabs>
    </div>
  );
}

export default AlumnosDetailCard;
