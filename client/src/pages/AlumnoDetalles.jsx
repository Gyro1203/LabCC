import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAlumnoByIdRequest } from "../services/alumnos.api.js";
import AlumnosCardContent from "../components/Alumnos/AlumnosCardContent.jsx";
import { getIngresoByAlumnoRequest } from "../services/ingresos.api.js";
import { getActividadesByIngresoRequest } from "../services/actividades.api.js";
import { getAsistenciaByIngresoRequest } from "../services/asistencias.api.js";
import AsistenciasRows from "../components/AsistenciasRows.jsx";

// PÁGINA ACTUALMENTE SIN USO, PERO SE DEJA PARA POSIBLES FUTURAS IMPLEMENTACIONES

function AlumnoDetalles() {
  const navigate = useNavigate();
  const params = useParams();

  const [alumno, setAlumno] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [actividades, setActividades] = useState({});
  const [asistencias, setAsistencias] = useState([]);

  // const headers = [
  //   { id: 1, key: "nombre", label: "Nombre" },
  //   { id: 2, key: "unidad", label: "Unidad" },
  //   { id: 3, key: "cantidad", label: "Cantidad" },
  //   { id: 4, key: "precio_uf", label: "Precio UF" },
  //   { id: 5, key: "precio_peso", label: "Precio $" },
  //   { id: 6, key: "total_uf", label: "Total UF" },
  //   { id: 7, key: "total_peso", label: "Total $" },
  //   { id: 8, key: "observaciones", label: "Observaciones" },
  //   { id: 9, key: "opciones", label: "Opciones" },
  // ];

  useEffect(() => {
    const fetchIngreso = async () => {
      if (params.id) {
        try {
          const dataAlumno = await getAlumnoByIdRequest(params.id);
          //console.log('Ingreso encontrado:', dataIngreso);
          setAlumno(dataAlumno.data);
          const dataIngresos = await getIngresoByAlumnoRequest(
            dataAlumno.data.id_alumno
          );
          //console.log(dataIngresos);
          setIngresos(dataIngresos.data);
        } catch (error) {
          console.error("Error al obtener el ingreso:", error);
        }
      }
    };
    fetchIngreso();
  }, [params.id]);

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

  // const handleDelete = async (id) => {
  //   try {
  //     const response = await deleteActividadesRequest(id);
  //     console.log("Ingreso eliminado exitosamente:", response.data);
  //     setIngreso(ingreso.filter((e) => e.id_ingreso !== id));
  //   } catch (error) {
  //     console.error("Error al eliminar ingreso:", error);
  //   }
  // };

  function renderAlumno() {
    if (alumno.length === 0) {
      return (
        <>
          <p>No se encontró al alumno</p>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/students`)}>
            Volver
          </button>
        </>
      );
    }

    return (
      <div className="container mt-5 mb-5">
        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="btn btn-secondary mb-4"
            onClick={() => navigate(`/students`)}
          >
            Volver
          </button>
        </div>

        <div className="card">
          <div className="list-group">
            <AlumnosCardContent alumno={alumno} />

            {/* BOTONES TABS */}
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                  aria-selected="true"
                >
                  Actividades
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                >
                  Asistencias
                </button>
              </li>
            </ul>
          </div>

          <div className="card-header tab-content p-3" id="myTabContent">
            {/* ACTIVIDADES */}
            <div
              className="tab-pane fade show active"
              id="home-tab-pane"
              role="tabpanel"
              aria-labelledby="home-tab"
              tabIndex="0"
            >
              <div className="accordion" id="accordionActivities">
                {ingresos.map((i, index) => (
                  <div className="accordion-item" key={i.id_ingreso}>
                    <span className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        onClick={() => GetActivities(i.id_ingreso)}
                        data-bs-toggle="collapse"
                        data-bs-target={`#activities-${index}`}
                        aria-expanded="false"
                        aria-controls={`#activities-${index}`}
                      >
                        {i.vigente} | {i.motivo} | {i.titulo} | {i.semestre}
                      </button>
                    </span>

                    <div
                      id={`activities-${index}`}
                      className="accordion-collapse collapse bg-light"
                      data-bs-parent="#accordionActivities"
                    >
                      <ul
                        className="list-group mx-auto"
                        style={{ maxWidth: "95%" }}
                      >
                        {actividades[i.id_ingreso]?.length > 0 ? (
                          <div className="mt-3 mb-3">
                            <li className="list-group-item list-group-item-info text-center">
                              ACTIVIDADES
                            </li>
                            {(actividades[i.id_ingreso]).map(
                              (actividad) => (
                                <li
                                  key={actividad.id_actividad}
                                  className="list-group-item"
                                >
                                  {actividad.nombre}
                                </li>
                              )
                            )}
                          </div>
                        ) : (
                          <li className="list-group-item list-group-item-secondary text-center mt-3 mb-3">
                            ESTE INGRESO NO TIENE ACTIVIDADES REGISTRADAS
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ASISTENCIAS */}
            <div
              className="tab-pane fade"
              id="profile-tab-pane"
              role="tabpanel"
              aria-labelledby="profile-tab"
              tabIndex="0"
            >
              <div className="accordion" id="accordionAttendance">
                {ingresos.map((i, index) => (
                  <div className="accordion-item" key={i.id_ingreso}>
                    <span className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        onClick={() => GetAttendance(i.id_ingreso)}
                        data-bs-toggle="collapse"
                        data-bs-target={`#attendance-${index}`}
                        aria-expanded="false"
                        aria-controls={`attendance-${index}`}
                      >
                        {i.vigente} | {i.motivo} | {i.titulo} | {i.semestre}
                      </button>
                    </span>

                    <div
                      id={`attendance-${index}`}
                      className="accordion-collapse collapse bg-light"
                      data-bs-parent="#accordionAttendance"
                    >
                      <ul
                        className="list-group mx-auto"
                        style={{ maxWidth: "95%" }}
                      >
                        {asistencias[i.id_ingreso]?.length > 0 ? (
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
                                  {(asistencias[i.id_ingreso]).map(
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>{renderAlumno()}</div>;
}

export default AlumnoDetalles;
