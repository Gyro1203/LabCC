import { useEffect, useState } from "react";
import {
  getAsistenciasRequest,
  marcarSalidaRequest,
  deleteAsistenciasRequest,
} from "../services/asistencias.api.js";
import AsistenciasRows from "../components/AsistenciasRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";

function Asistencias() {
  const navigate = useNavigate();

  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");

  const camposFiltro = ["alumno", "actividad", "jornada"];
  // Se envia el array de datos, el texto de filtro, y los campos por los que se puede filtrar
  const asistenciasFiltradas = Filter(asistencias, filterText, camposFiltro);

  useEffect(() => {
    async function fetchData() {
      const dataAsistencias = await getAsistenciasRequest();
      setAsistencias(dataAsistencias.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteAsistenciasRequest(id);
      console.log("Asistencia eliminada exitosamente:", response.data);
      setAsistencias(asistencias.filter((e) => e.id_asistencia !== id));
    } catch (error) {
      console.error("Error al eliminar asistencia:", error);
    }
  };

  const marcarSalida = async (id) => {
    try {
      const response = await marcarSalidaRequest(id);
      console.log("Se marco salida:", response.data);
    } catch (error) {
      console.error("Error al marcar salida:", error);
    }
  };

  function renderAsistencias() {
    if (asistencias.length === 0) {
      return (
        <>
          <p>No hay asistencias registradas</p>
          <button onClick={() => navigate(`/attendance/register`)}>
            Registar en Asistencia
          </button>
        </>
      );
    }

    return (
      <div className="container text-center mt-4">
        <button onClick={() => navigate(`/attendance/register`)}>
          Registar en Asistencia
        </button>
        <div className="row mt-4">
          <div className="d-flex justify-content-end">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                id="input-search"
                type="search"
                onChange={(e) => {
                  setFilterText(e.target.value);
                }}
                className="form-control"
                placeholder="Buscar"
                style={{ maxWidth: "400px" }}
              />
              <button
                type="button"
                className="btn dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="visually-hidden">Seleccionar Filtro</span>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item">Alumnos</a>
                </li>
                <li>
                  <a className="dropdown-item">Jornada</a>
                </li>
                <li>
                  <a className="dropdown-item">Actividad</a>
                </li>
              </ul>
            </div>
          </div>
          <table className="table table-striped table-hover table-bordered mt-4">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Alumno</th>
                <th scope="col">Jornada</th>
                <th scope="col">Fecha</th>
                <th scope="col">Entrada</th>
                <th scope="col">Actividad</th>
                <th scope="col">Salida</th>
                <th scope="col">Opciones</th>
              </tr>
            </thead>
            <tbody id="body_table">
              {asistenciasFiltradas.map((asistencia, index) => (
                <AsistenciasRows
                  key={asistencia.id_asistencia}
                  asistencia={asistencia}
                  index={index}
                  editar={
                    <button
                      className="btn btn-primary"
                      title="Editar"
                      onClick={() =>
                        navigate(`/attendance/edit/${asistencia.id_asistencia}`)
                      }
                    >
                      <i id="editar" className="fa-solid fa-pencil"></i>
                    </button>
                  }
                  eliminar={
                    <button
                      className="btn btn-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(asistencia.id_asistencia)}
                    >
                      <i id="eliminar" className="fa-solid fa-trash-can"></i>
                    </button>
                  }
                  salida={
                    <button
                      className="btn btn-success"
                      title="Marcar Salida"
                      onClick={async () => {
                        await marcarSalida(asistencia.id_asistencia);
                        window.location.reload();
                      }}
                    >
                      <i className="fa-solid fa-door-open"></i>
                    </button>
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Asistencias</h1>
      {renderAsistencias()}
    </div>
  );
}

export default Asistencias;
