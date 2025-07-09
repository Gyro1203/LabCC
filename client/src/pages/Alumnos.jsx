import { useEffect, useState } from "react";
import {
  getAlumnosRequest,
  deleteAlumnosRequest,
} from "../services/alumnos.api.js";
import AlumnosRows from "../components/AlumnosRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import Caret from "../components/Caret.jsx";
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from "../helpers/sweetAlert.js";

function Alumnos() {
  const navigate = useNavigate();

  const [alumnos, setAlumnos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sort, setSort] = useState({ keyToSort: "nombre", direction: "asc" });
  const nonSortableKeys = ["opciones"];

  const camposFiltro = ["nombre", "rut", "carrera", "facultad", "departamento"];
  const alumnosFiltrados = Filter(alumnos, filterText, camposFiltro);

  const headers = [
    { id: 1, key: "nombre", label: "Nombre" },
    { id: 2, key: "rut", label: "Rut" },
    { id: 3, key: "carrera", label: "Carrera" },
    { id: 4, key: "facultad", label: "Facultad" },
    { id: 5, key: "departamento", label: "Departamento" },
    { id: 6, key: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    async function fetchData() {
      const dataAlumnos = await getAlumnosRequest();
      setAlumnos(dataAlumnos.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmation = await deleteDataAlert();
      if(confirmation.isConfirmed){
        const response = await deleteAlumnosRequest(id);
        console.log("Alumno eliminado exitosamente:", response.data);
        showSuccessAlert("Alumno eliminado exitosamente");
        setAlumnos(alumnos.filter((a) => a.id_alumno !== id));
      }
    } catch (error) {
      showErrorAlert("Error al eliminar alumno");
      console.error("Error al eliminar alumno:", error);
    }
  }

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

  function renderAlumnos() {
    if (alumnos.length === 0) {
      return (
        <div className="container d-flex align-items-center flex-column mt-5 mb-5">
          <h1 className="p-2">No se encontraron alumnos registrados</h1>
          <button type="button" className="btn btn-primary p-2" onClick={() => navigate(`/students/register`)}>
            Registrar Alumno
          </button>
        </div>
      );
    }

    return (
      <div className="container text-center mt-5 mb-5">
        <div className="d-flex justify-content-between">
          
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/students/register`)}>
            Registrar Alumno
          </button>

          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              id="input-search"
              type="search"
              onChange={(e) => setFilterText(e.target.value)}
              className="form-control"
              placeholder="Buscar"
              style={{ maxWidth: "300px" }} //Cambiar si se agregan mas elementos
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
            {getSortedArray(alumnosFiltrados).map((alumno) => (
              <AlumnosRows
                key={alumno.id_alumno}
                alumno={alumno}
                eliminar={
                  <button
                    className="btn btn-danger"
                    title="Eliminar"
                    onClick={() => handleDelete(alumno.id_alumno)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                }
                editar={
                  <button
                    className="btn btn-primary"
                    title="Editar"
                    onClick={() =>
                      navigate(`/students/edit/${alumno.id_alumno}`)
                    }
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

  return <div>{renderAlumnos()}</div>;
}

export default Alumnos;