import { useEffect, useState } from "react";
import {
  getAsistenciasRequest,
  deleteAsistenciasRequest,
} from "../services/asistencias.api.js";
import AsistenciasRows from "../components/AsistenciasRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import {
  deleteDataAlert,
  showErrorAlert,
  showInfoAlert,
  showSuccessAlert,
} from "../helpers/sweetAlert.js";
import Caret from "../components/Caret.jsx";

import useCreateAsis from "../hooks/asistencias/useCreateAsis.jsx";
import PopUpCreateAsistencias from "../components/Asistencias/PopUpCreateAsistencias.jsx";
import useEditAsis from "../hooks/asistencias/useEditAsis.jsx";
import PopUpMarcarSalida from "../components/Asistencias/PopUpMarcarSalida.jsx";
import useMarcarSalida from "../hooks/asistencias/useMarcarSalida.jsx";

function Asistencias() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("usuario"));
  const userRol = user ? user.rol : null;

  const [asistencias, setAsistencias] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sort, setSort] = useState({ keyToSort: "alumno", direction: "asc" });
  const nonSortableKeys = ["opciones"];

  const camposFiltro = [
    "alumno",
    "fecha",
    "jornada",
    "entrada",
    "actividad",
    "salida",
  ];
  // Se envia el array de datos, el texto de filtro, y los campos por los que se puede filtrar
  const asistenciasFiltradas = Filter(asistencias, filterText, camposFiltro);

  const headers = [
    { id: 1, key: "alumno", label: "Alumno" },
    { id: 2, key: "fecha", label: "Fecha" },
    { id: 3, key: "jornada", label: "Jornada" },
    { id: 4, key: "entrada", label: "Entrada" },
    { id: 5, key: "actividad", label: "Actividad" },
    { id: 6, key: "salida", label: "Salida" },
    { id: 7, key: "opciones", label: "Opciones" },
  ];

  const {
    isCreatePopUpOpen,
    setIsCreatePopUpOpen,
    handleClickCreate,
    handleCreate,
  } = useCreateAsis(setAsistencias);

  
  const {
    isEditPopUpOpen,
    setIsEditPopUpOpen,
    handleClickUpdate,
    handleUpdate,
  } = useEditAsis(setAsistencias)
  
  const {
    isSalidaPopUpOpen,
    setIsSalidaPopUpOpen,
    dataAsistencia,
    handleClickSalida,
    handleMarcarSalida,
  } = useMarcarSalida(setAsistencias);
  
  useEffect(() => {
    async function fetchData() {
      const dataAsistencias = await getAsistenciasRequest();
      setAsistencias(dataAsistencias.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmation = await deleteDataAlert();
      if (confirmation.isConfirmed) {
        await deleteAsistenciasRequest(id);
        showSuccessAlert("Registro de asistencia eliminado");
        setAsistencias(asistencias.filter((e) => e.id_asistencia !== id));
      }
    } catch (error) {
      showErrorAlert("Error al eliminar alumno");
      console.error("Error al eliminar asistencia:", error);
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
      let aValue = a[sort.keyToSort] ?? "";
      let bValue = b[sort.keyToSort] ?? "";

      // Si la columna es fecha, transforma a objeto Date para comparar
      if (sort.keyToSort === "fecha") {
        // Asume formato "DD MM YY" o "DD-MM-YY"
        const parseFecha = (str) => {
          if (!str) return new Date(0);
          const parts = str.replace(/[-/]/g, " ").split(" ");
          // Si el año es 2 dígitos, conviértelo a 4 dígitos (ej: 25 -> 2025)
          let [dd, mm, yy] = parts;
          yy = yy.length === 2 ? "20" + yy : yy;
          return new Date(`${yy}-${mm}-${dd}`);
        };
        aValue = parseFecha(aValue);
        bValue = parseFecha(bValue);
      }

      if (aValue === bValue) return 0;
      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  function renderAsistencias() {
    if (asistencias.length === 0) {
      return (
        <div className="container d-flex align-items-center flex-column mt-5 mb-5">
          <h1 className="p-2">No se encontraron asistencias registradas</h1>
          <button
            type="button"
            className="btn btn-primary p-2"
            // onClick={() => navigate(`/attendance/register`)}
            onClick={handleClickCreate}
          >
            Registrar Asistencias
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
            // onClick={() => navigate(`/attendance/register`)}
            onClick={handleClickCreate}
          >
            Registar en Asistencia
          </button>

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
            <ul className="dropdown-menu" style={{ cursor: "pointer" }}>
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
          <tbody id="body_table">
            {getSortedArray(asistenciasFiltradas).map((asistencia) => (
              <AsistenciasRows
                key={asistencia.id_asistencia}
                asistencia={asistencia}
                isAdmin={userRol === "Admin"}
                editar={
                  <button
                    className="btn btn-primary"
                    title="Editar"
                    onClick={() =>
                      navigate(`/attendance/edit/${asistencia.id_asistencia}`)
                      // handleClickUpdate(asistencia)
                      // console.log(asistencia)
                      
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
                      if(asistencia.salida) {
                        showInfoAlert("Ya has marcado tu salida");
                        return;
                      }
                      handleClickSalida(asistencia)
                      // window.location.reload();
                    }}
                  >
                    <i className="fa-solid fa-door-open"></i>
                  </button>
                }
              />
            ))}
          </tbody>
        </table>
        <PopUpCreateAsistencias 
          show={isCreatePopUpOpen}
          setShow={setIsCreatePopUpOpen}
          action={handleCreate}
        />
        <PopUpMarcarSalida
          show={isSalidaPopUpOpen}
          setShow={setIsSalidaPopUpOpen}
          data={dataAsistencia}
          action={handleMarcarSalida}
        />
      </div>
    );
  }

  return <div>{renderAsistencias()}</div>;
}

export default Asistencias;
