import { useEffect, useState } from "react";
import {
  getActividadesRequest,
  deleteActividadesRequest,
} from "../services/actividades.api.js";
import ActividadesCard from "../components/ActividadesCard.jsx";
import { useNavigate } from "react-router-dom";

function Actividades() {
  const navigate = useNavigate();

  const [actividades, setActividades] = useState([]);

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
      <div className="container mt-4">
        <div className="row">
          {actividades.map((actividad) => (
            <div key={actividad.id_actividad} className="col-sm-12 col-md-6 col-lg-4 mb-4">
              <ActividadesCard actividad={actividad} />
              <button onClick={() => handleDelete(actividad.id_actividad)}>
                Eliminar
              </button>
              <button
                onClick={() =>
                  navigate(`/activity/edit/${actividad.id_actividad}`)
                }
              >
                Editar
              </button>
            </div>
          ))}
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
