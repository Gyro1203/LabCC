import { useEffect, useState } from "react";
import {
  getIngresosRequest,
  deleteIngresosRequest,
} from "../services/ingresos.api.js";
import IngresosRows from "../components/IngresosRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import Caret from "../components/Caret.jsx";
import {
  deleteDataAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../helpers/sweetAlert.js";

function Ingresos() {
  const navigate = useNavigate();

  const [ingresos, setIngresos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [sort, setSort] = useState({ keyToSort: "nombre", direction: "asc" });
  const nonSortableKeys = ["vigente", "opciones"];

  const camposFiltro = ["nombre", "rut", "motivo", "titulo", "semestre"];
  const ingresosFiltrados = Filter(ingresos, filterText, camposFiltro);

  const headers = [
    { id: 1, key: "nombre", label: "Nombre" },
    // { id: 2, key: "rut", label: "Rut" },
    { id: 3, key: "motivo", label: "Motivo de Uso" },
    { id: 4, key: "titulo", label: "Titulo del Proyecto" },
    { id: 5, key: "profesor_guia", label: "Profesor Guía" },
    { id: 6, key: "profesor_asignatura", label: "Profesor Asignatura" },
    { id: 7, key: "semestre", label: "Semestre" },
    { id: 8, key: "vigente", label: "Vigente" },
    { id: 9, key: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    async function fetchData() {
      const dataIngresos = await getIngresosRequest();
      setIngresos(dataIngresos.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmation = await deleteDataAlert();
      if (confirmation.isConfirmed) {
        await deleteIngresosRequest(id);
        showSuccessAlert("Ingreso eliminado exitosamente");
        setIngresos(ingresos.filter((e) => e.id_ingreso !== id));
      }
    } catch (error) {
      showErrorAlert("Error al eliminar ingreso");
      console.error("Error al eliminar ingreso:", error);
    }
  };

  function handleHeaderClick(header) {
    setSort({
      keyToSort: header.key,
      direction:
        header.key === sort.keyToSort // Si se presiona el mismo...
          ? sort.direction === "asc" // Pregunta si esta en acendente...
            ? "desc" // Si lo está se cambia a descendente...
            : "asc" // Si no se establece como ascendente...
          : "desc", // Y si no es el mismo, se establece como descendente
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

  function renderIngresos() {
    if (ingresos.length === 0) {
      return (
        <div className="container d-flex align-items-center flex-column mt-5 mb-5">
          <h1 className="p-2">No se encontraron ingresos registrados</h1>
          <button
            type="button"
            className="btn btn-primary p-2"
            onClick={() => navigate(`/entry/register`)}
          >
            Registrar Ensayos
          </button>
        </div>
      );
    }

    return (
      <div className="container text-center mt-5 mb-5">
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/entry/register`)}
          >
            Registrar Ingreso
          </button>
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
            {getSortedArray(ingresosFiltrados).map((ingreso) => (
              <IngresosRows
                key={ingreso.id_ingreso}
                ingreso={ingreso}
                editar={
                  <button
                    className="btn btn-primary"
                    title="Editar"
                    onClick={() =>
                      navigate(`/entry/edit/${ingreso.id_ingreso}`)
                    }
                  >
                    <i className="fa-solid fa-pencil"></i>
                  </button>
                }
                eliminar={
                  <button
                    className="btn btn-danger"
                    title="Eliminar"
                    onClick={() => handleDelete(ingreso.id_ingreso)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                }
                registrar={
                  <button
                    className="btn btn-warning"
                    title="Registrar Actividad"
                    onClick={() => {
                      if (!ingreso.vigente)
                        alert("Este ingreso no se encuentra vigente");
                      else
                        navigate(`/activity/register`, {
                          state: {
                            id_ingreso: ingreso.id_ingreso,
                            from: "/entry",
                          },
                        });
                    }}
                  >
                    <i className="fa-regular fa-calendar-plus"></i>
                  </button>
                }
              ></IngresosRows>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div>{renderIngresos()}</div>;
}

export default Ingresos;
