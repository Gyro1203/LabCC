import { useEffect, useState } from "react";
import { getEnsayosRequest, deleteEnsayosRequest } from "../services/ensayos.api.js";
import EnsayosRows from "../components/EnsayosRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import Caret from "../components/Caret.jsx";

function Ensayos() {
  const navigate = useNavigate();

  const [ensayos, setEnsayos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sort, setSort] = useState({ keyToSort: "actividad", direction: "asc" });
  const nonSortableKeys = ["opciones"];

  // Ajusta los campos de filtro según tu modelo de ensayos
  const camposFiltro = ["actividad", "tipo", "norma", "unidad", "precio_uf", "precio_pesos"];
  const ensayosFiltrados = Filter(ensayos, filterText, camposFiltro);

  // Ajusta los headers según tu modelo de ensayos
  const headers = [
    { id: 1, key: "actividad", label: "Actividad" },
    { id: 2, key: "tipo", label: "Tipo" },
    { id: 3, key: "norma", label: "Norma" },
    { id: 4, key: "unidad", label: "Unidad" },
    { id: 5, key: "precio_uf", label: "Precio UF" },
    { id: 6, key: "precio_pesos", label: "Precio $" },
    { id: 7, key: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    async function fetchData() {
      const dataEnsayos = await getEnsayosRequest();
      setEnsayos(dataEnsayos.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteEnsayosRequest(id);
      console.log("Ensayo eliminado exitosamente:", response.data);
      setEnsayos(ensayos.filter((e) => e.id_ensayo !== id));
    } catch (error) {
      console.error("Error al eliminar ensayo:", error);
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
      return arrayToSort;
    }
    return arrayToSort.slice().sort((a, b) => {
      const aValue = a[sort.keyToSort] ?? "";
      const bValue = b[sort.keyToSort] ?? "";
      if (aValue === bValue) return 0;
      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  function renderEnsayos() {
    if (ensayos.length === 0) {
      return (
        <>
          <p>No hay ensayos ingresados</p>
          <button onClick={() => navigate(`/essay/register`)}>
            Registrar en Ensayos
          </button>
        </>
      );
    }

    return (
      <div className="container text-center mt-4">
        <button onClick={() => navigate(`/essay/register`)}>
          Registrar en Ensayos
        </button>
        <div className="d-flex justify-content-end mt-4">
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              id="input-search"
              type="search"
              onChange={(e) => setFilterText(e.target.value)}
              className="form-control"
              placeholder="Buscar"
              style={{ maxWidth: "200px" }}
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
            {getSortedArray(ensayosFiltrados).map((ensayo) => (
              <EnsayosRows
                key={ensayo.id_ensayo}
                ensayo={ensayo}
                eliminar={
                  <button
                    className="btn btn-danger"
                    title="Eliminar"
                    onClick={() => handleDelete(ensayo.id_ensayo)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                }
                editar={
                  <button
                    className="btn btn-primary"
                    title="Editar"
                    onClick={() => navigate(`/essay/edit/${ensayo.id_ensayo}`)}
                  >
                    <i className="fa-solid fa-pencil"></i>
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
      <h1>Ensayos</h1>
      {renderEnsayos()}
    </div>
  );
}

export default Ensayos;