import { useEffect, useState } from "react";
import {
  getIngresosRequest,
  deleteIngresosRequest,
} from "../services/ingresos.api.js";
import IngresosRows from "../components/IngresosRows.jsx";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";

function Ingresos() {
  const navigate = useNavigate();

  const [ingresos, setIngresos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const camposFiltro = ["nombre", "rut", "motivo", "titulo", "semestre"];
  const ingresosFiltrados = Filter(ingresos, filterText, camposFiltro);

  useEffect(() => {
    async function fetchData() {
      const dataIngresos = await getIngresosRequest();
      setIngresos(dataIngresos.data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteIngresosRequest(id);
      console.log("Ingreso eliminado exitosamente:", response.data);
      setIngresos(ingresos.filter((e) => e.id_ingreso !== id));
    } catch (error) {
      console.error("Error al eliminar ingreso:", error);
    }
  };

  function renderIngresos() {
    if (ingresos.length === 0) {
      return (
        <>
          <p>No hay ingresos registrados</p>
          <button onClick={() => navigate(`/entry/register`)}>
            Registar Ingreso
          </button>
        </>
      );
    }

    return (
      <div className="container text-center mt-4">
        <button onClick={() => navigate(`/entry/register`)}>
          Registrar Ingreso
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
              <th>#</th>
              <th>Nombre</th>
              <th>Rut</th>
              <th>Motivo de Uso</th>
              <th>Titulo del Proyecto</th>
              <th>Profesor Guia</th>
              <th>Profesor Asignatura</th>
              <th>Semestre</th>
              <th>Vigente</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {ingresosFiltrados.map((ingreso, index) => (
              <IngresosRows
                key={ingreso.id_ingreso}
                ingreso={ingreso}
                index={index}
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
                          state: ingreso.id_ingreso,
                        });
                    }}
                  >
                    <i class="fa-regular fa-calendar-plus"></i>
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
      <h1>Ingresos</h1>
      {renderIngresos()}
    </div>
  );
}

export default Ingresos;
