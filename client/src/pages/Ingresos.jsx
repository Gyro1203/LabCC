import { useEffect, useState } from "react";
import {
  getIngresosRequest,
  deleteIngresosRequest,
} from "../services/ingresos.api.js";
import IngresosCard from "../components/IngresosCard.jsx";
import { useNavigate } from "react-router-dom";

function Ingresos() {
  const navigate = useNavigate();

  const [ingresos, setIngresos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getIngresosRequest();
      /*Si mas adelante falla, comparar con Alumnos
        en alumnos es data.alumnos debido a como esta definido en el services
        ya que aqui no se usa service, no es necesario, pero si mas adelante cambia
      va a aleterar esta parte, por lo que se debe cambiar aqui tambien*/
      setIngresos(data);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteIngresosRequest(id);
      console.log("Ingreso eliminado exitosamente:", response);
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
      <div className="container mt-4">
        <button onClick={() => navigate(`/entry/register`)}>
          Registar en Ingresos
        </button>
        <div className="row">
          {ingresos.map((ingreso) => (
            <div key={ingreso.id_ingreso} className="col-sm-12 col-md-6 col-lg-4 mb-4">
              <IngresosCard ingreso={ingreso} />
              <button onClick={() => handleDelete(ingreso.id_ingreso)}>
                Eliminar
              </button>
              <button
                onClick={() => navigate(`/entry/edit/${ingreso.id_ingreso}`)}
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
      <h1>Ingresos</h1>
      {renderIngresos()}
    </div>
  );
}

export default Ingresos;
