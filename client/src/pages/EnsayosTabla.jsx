import { useEffect, useRef, useState } from "react";
import { deleteEnsayosRequest, getEnsayosRequest } from "../services/ensayos.api.js";
import { useNavigate } from "react-router-dom";
import EnsayosRows from "../components/EnsayosRows.jsx";

function Ensayos() {
  const navigate = useNavigate();
  const [ensayos, setEnsayos] = useState([]);
  const dataTableRef = useRef(null);

  const options = {
    pageLength: 3,
  };
const [tableKey, setTableKey] = useState(0); // Para forzar el remount

  useEffect(() => {
    async function fetchData() {
      const dataEnsayos = await getEnsayosRequest();
      setEnsayos(dataEnsayos.data);
      setTableKey(prev => prev + 1); // Fuerza el remount de la tabla
    }
    fetchData();
  }, []);

  // Destruye DataTable antes de actualizar los datos
  useEffect(() => {
    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [tableKey]);

  // Inicializa DataTable después de renderizar la tabla
  useEffect(() => {
    if (ensayos.length > 0) {
      setTimeout(() => {
        dataTableRef.current = window.$("#tabla-ensayos").DataTable({});
      }, 0);
    }
  }, [tableKey, ensayos.length]);

  //Eliminar 
  const handleDelete = async (id) => {
    // Destruye DataTable antes de cambiar el estado
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }
    try {
      const response = await deleteEnsayosRequest(id);
      console.log(response);
      setEnsayos(ensayos.filter((e) => e.id_ensayo !== id));
      setTableKey(prev => prev + 1); // Fuerza el remount de la tabla
    } catch (error) {
      console.error("Error al eliminar ensayo:", error);
    }
  };

  function renderEnsayos() {
    if (ensayos.length === 0) {
      return (
        <>
          <p>No hay ensayos ingresados</p>
          <button onClick={() => navigate(`/essay/register`)}>
            Registar en Ensayos
          </button>
        </>
      );
    }

    return (
      <div className="container mt-4">
        <button onClick={() => navigate(`/essay/register`)}>
          Registar en Ensayos
        </button>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <table id="tabla-ensayos" className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Actividad</th>
                  <th>Tipo</th>
                  <th>Norma</th>
                  <th>Unidad</th>
                  <th>Precio UF</th>
                  <th>Precio $</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {ensayos.map((ensayo, index) => (
                  <EnsayosRows
                    key={ensayo.id_ensayo}
                    ensayo={ensayo}
                    index={index}
                    eliminar={
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(ensayo.id_ensayo)}
                      ><i className="fa-solid fa-trash-can"></i></button>
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
