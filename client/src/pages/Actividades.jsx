import { useEffect, useState } from "react";
import {
  getActividadesRequest,
  deleteActividadesRequest,
} from "../services/actividades.api.js";
import ActividadesRows from "../components/ActividadesRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import Caret from "../components/Caret.jsx";

function Actividades() {
  const navigate = useNavigate();

  const [actividades, setActividades] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [sort, setSort] = useState({ keyToSort: "nombre", direction: "asc" });
  const nonSortableKeys = ["opciones"];

  // Ajusta los campos de filtro según los datos de actividades
  const camposFiltro = [
    "nombre",
    "alumno",
    "unidad",
    "cantidad",
    "precio_uf",
    "precio_peso",
    "total_uf",
    "total_peso",
    "observaciones",
  ];
  const actividadesFiltradas = Filter(actividades, filterText, camposFiltro);

  // Ajusta los headers según los datos de actividades
  const headers = [
    { id: 1, key: "nombre", label: "Nombre" },
    { id: 2, key: "alumno", label: "Alumno" },
    { id: 3, key: "unidad", label: "Unidad" },
    { id: 4, key: "cantidad", label: "Cantidad" },
    { id: 5, key: "precio_uf", label: "Precio UF" },
    { id: 6, key: "precio_peso", label: "Precio $" },
    { id: 7, key: "total_uf", label: "Total UF" },
    { id: 8, key: "total_peso", label: "Total $" },
    { id: 9, key: "observaciones", label: "Observaciones" },
    { id: 10, key: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    async function fetchData() {
      const dataActividades = await getActividadesRequest();
      console.log(dataActividades.data);
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

  function handleHeaderClick(header) {
    setSort({
      keyToSort: header.key,
      direction:
        header.key === sort.keyToSort
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  }

  function getSortedArray(arrayToSort) {
    if (nonSortableKeys.includes(sort.keyToSort)) {
      return arrayToSort; // Si el key no es ordenable, retorna el array tal cual
    }
    return arrayToSort.slice().sort((a, b) => {
      const aValue = a[sort.keyToSort] ?? ""; // Guarda el valor de "a", o "" si el anterior en null
      const bValue = b[sort.keyToSort] ?? "";
      if (aValue === bValue) return 0;
      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
      // En JavaScript, los operadores < y > funcionan tanto para strings como para números
    });
  }

  function renderActividades() {
    if (actividades.length === 0) {
      return (
        <>
          <p>No hay actividades registradas</p>
          <button onClick={() => navigate(`/activity/register`)}>
            Registrar Actividad
          </button>
        </>
      );
    }

    return (
      <div className="container text-center mt-4 mb-5">
        <div className="d-flex justify-content-end mt-4">
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              id="input-search"
              type="search"
              onChange={(e) => setFilterText(e.target.value)}
              className="form-control"
              placeholder="Buscar"
              style={{ maxWidth: "300px" }}
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
                <button className="dropdown-item" type="button">
                  Nombre
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Alumno
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Unidad
                </button>
              </li>
              <li>
                <button className="dropdown-item" type="button">
                  Observaciones
                </button>
              </li>
            </ul>
          </div>
        </div>
        <table className="table table-striped table-hover table-bordered mt-4">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header.id}
                  onClick={
                    !nonSortableKeys.includes(header.key)
                      ? () => handleHeaderClick(header)
                      : undefined
                  }
                  style={{
                    ...(nonSortableKeys.includes(header.key)
                      ? { cursor: "default" }
                      : { cursor: "pointer" }),
                    userSelect: "none",
                  }}
                >
                  <span>{header.label}</span>
                  {!nonSortableKeys.includes(header.key) &&
                    header.key === sort.keyToSort && (
                      <span className="float-end">
                        <Caret
                          direction={
                            header.key === sort.keyToSort
                              ? sort.direction
                              : "asc"
                          }
                        />
                      </span>
                    )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getSortedArray(actividadesFiltradas).map((actividad) => (
              <ActividadesRows
                key={actividad.id_actividad}
                actividad={actividad}
                editar={
                  <button
                    className="btn btn-primary"
                    title="Editar"
                    onClick={() =>
                      navigate(`/activity/edit/${actividad.id_actividad}`)
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
