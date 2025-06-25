import { useEffect, useState } from "react";
import {
  getActividadesRequest,
  deleteActividadesRequest,
} from "../services/actividades.api.js";
import ActividadesRows from "../components/ActividadesRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";

function Actividades() {
  const navigate = useNavigate();

  const [actividades, setActividades] = useState([]);
  const [filterText, setFilterText] = useState("");

  const camposFiltro = ["nombre", "alumno", "unidad", "precio_uf", "precio_peso", "observaciones"];
  const actividadesFiltradas = Filter(actividades, filterText, camposFiltro);

  useEffect(() => {
    async function fetchData() {
      const dataActividades = await getActividadesRequest();
      setActividades(dataActividades.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteActividadesRequest(id);
      console.log("Actividad eliminada exitosamente:", response.data);
      setActividades(actividades.filter((e) => e.id_actividad !== id));
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    }
  };

  function renderActividades() {
    if (actividades.length === 0) {
      return (
        <>
          <p>No hay actividades registradas</p>
          <button onClick={() => navigate(`/activity/register`)}>
            Registar en Actividades
          </button>
        </>
      );
    }

    return (
      <div className="container text-center mt-4">
        <div className="row mt-4">
          <div className="d-flex justify-content-end">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                id="input-search"
                type="search"
                onChange={(e) => setFilterText(e.target.value)}
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
                  <button className="dropdown-item" type="button">Nombre</button>
                </li>
                <li>
                  <button className="dropdown-item" type="button">Alumno</button>
                </li>
                <li>
                  <button className="dropdown-item" type="button">Unidad</button>
                </li>
                <li>
                  <button className="dropdown-item" type="button">Observaciones</button>
                </li>
              </ul>
            </div>
          </div>
          <table className="table table-striped table-hover table-bordered mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Alumno</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Precio UF</th>
                <th>Precio $</th>
                <th>Total UF</th>
                <th>Total $</th>
                <th>Observaciones</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {actividadesFiltradas.map((actividad, index) => (
                <ActividadesRows
                  key={actividad.id_actividad}
                  actividad={actividad}
                  index={index}
                  editar={
                    <button
                      className="btn btn-primary"
                      title="Editar"
                      onClick={() =>
                        navigate(`/actividades/edit/${actividad.id_actividad}`)
                      }
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                  }
                  eliminar={
                    <button
                      className="btn btn-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(actividad.id_actividad)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
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
      <h1>Actividades</h1>
      {renderActividades()}
    </div>
  );
}

export default Actividades;
