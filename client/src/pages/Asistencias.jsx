import { useEffect, useState } from "react";
import {
  getAsistenciasRequest,
  marcarSalidaRequest,
  deleteAsistenciasRequest,
} from "../services/asistencias.api.js";
import AsistenciasCard from "../components/AsistenciasCard.jsx";
import { useNavigate } from "react-router-dom";

function Asistencias() {
  const navigate = useNavigate();

  const [asistencias, setAsistencias] = useState([]);

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
      <div className="container mt-4">
        <button onClick={() => navigate(`/attendance/register`)}>
          Registar en Asistencia
        </button>
        <div className="row">
          {asistencias.map((asistencia) => (
            <div key={asistencia.id_asistencia} className="col-sm-12 col-md-6 col-lg-4 mb-4">
              <AsistenciasCard asistencia={asistencia} />
              <button onClick={() => handleDelete(asistencia.id_asistencia)}>
                Eliminar
              </button>
              <button
                onClick={() =>
                  navigate(`/attendance/edit/${asistencia.id_asistencia}`)
                }
              >
                Editar
              </button>
              <button
                onClick={ async () => {
                  await marcarSalida(asistencia.id_asistencia);
                  window.location.reload()
                }}
              >
                Marcar Salida
              </button>
            </div>
          ))}
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
