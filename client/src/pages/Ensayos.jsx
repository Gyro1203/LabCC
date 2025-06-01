import { useEffect, useState } from "react";
import {
  getEnsayosRequest,
  deleteEnsayosRequest,
} from "../services/ensayos.api.js";
import EnsayosCard from "../components/EnsayosCard.jsx";
import { useNavigate } from "react-router-dom";

function Ensayos() {
  const navigate = useNavigate();

  const [ensayos, setEnsayos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataEnsayos = await getEnsayosRequest();
      /*Si mas adelante falla, comparar con Alumnos
        en alumnos es data.alumnos debido a como esta definido en el services
        ya que aqui no se usa service, no es necesario, pero si mas adelante cambia
        va a aleterar esta parte, por lo que se debe cambiar aqui tambien*/
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
          {ensayos.map((ensayo) => (
            <div key={ensayo.id_ensayo} className="col-sm-12 col-md-6 col-lg-4 mb-4">
              <EnsayosCard ensayo={ensayo} />
              <button onClick={() => handleDelete(ensayo.id_ensayo)}>
                Eliminar
              </button>
              <button
                onClick={() => navigate(`/essay/edit/${ensayo.id_ensayo}`)}
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
      <h1>Ensayos</h1>
      {renderEnsayos()}
    </div>
  );
}

export default Ensayos;
