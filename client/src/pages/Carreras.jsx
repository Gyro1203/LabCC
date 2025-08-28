import { useEffect, useState } from "react";
import {
  getActividadesRequest,
  deleteActividadesRequest,
} from "../services/actividades.api.js";
import ActividadesRows from "../components/ActividadesRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import Caret from "../components/Caret.jsx";
import {
  deleteDataAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../helpers/sweetAlert.js";
import { getCarrerasRequest } from "../services/carreras.api.js";
import CarrerasRows from "../components/CarrerasRows.jsx";

function Carreras() {
  const navigate = useNavigate();

  const [carreras, setCarreras] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [sort, setSort] = useState({ keyToSort: "carrera", direction: "asc" });
  const nonSortableKeys = ["opciones"];

  const camposFiltro = [
    "carrera",
    "facultad",
    "departamento",
  ];
  const carrerasFiltradas = Filter(carreras, filterText, camposFiltro);

  const headers = [
    { id: 1, key: "carrera", label: "Carrera" },
    { id: 2, key: "facultad", label: "Facultad" },
    { id: 3, key: "departamento", label: "Departamento" },
    { id: 4, key: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    async function fetchData() {
      const dataCarreras = await getCarrerasRequest();
      console.log(dataCarreras.data);
      setCarreras(dataCarreras.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmation = await deleteDataAlert();
      if (confirmation.isConfirmed) {
        const response = await deleteActividadesRequest(id);
        console.log("Actividad eliminada exitosamente:", response.data);
        showSuccessAlert("Actividad eliminada exitosamente");
        setCarreras(carreras.filter((e) => e.id_actividad !== id));
      }
    } catch (error) {
      showErrorAlert("Error al eliminar actividad");
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
      const aValue = a[sort.keyToSort] ?? ""; // Guarda el valor de "a"; o "" si el anterior en null
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
    if (carreras.length === 0) {
      return (
        <div className="container d-flex align-items-center flex-column mt-5 mb-5">
          <h1 className="p-2">No se encontraron carreras registradas</h1>
          <button
            type="button"
            className="btn btn-primary p-2"
            onClick={() => navigate(`/activity/register`)}
          >
            Registrar Ensayos
          </button>
        </div>
      );
    }

    return (
      <div className="container text-center mt-5 mb-5">
        <div className="d-flex justify-content-end">

          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              id="input-search"
              type="search"
              onChange={(e) => setFilterText(e.target.value)}
              className="form-control"
              placeholder="Buscar"
              style={{ maxWidth: "300px" }}
            />
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
            {getSortedArray(carrerasFiltradas).map((carrera) => (
              <CarrerasRows
                key={carrera.id_carrera}
                carreras={carrera}
                editar={
                  <button
                    className="btn btn-primary"
                    title="Editar"
                    onClick={() =>
                      navigate(`/activity/edit/${carrera.id_carrera}`)
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
      {renderActividades()}
    </div>
  );
}

export default Carreras