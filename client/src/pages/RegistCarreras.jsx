import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCarreraRequest,
  getCarreraByIdRequest,
  updateCarreraRequest,
} from "../services/carreras.api.js";

export default function RegistCarreras() {
  const navigate = useNavigate();
  const params = useParams();

  const [carrera, setCarrera] = useState({
    carrera: "",
    facultad: "",
    departamento: "",
  });

  useEffect(() => {
    async function fetchCarrera() {
      if (params.id) {
        const data = await getCarreraByIdRequest(params.id);
        setCarrera({
          carrera: data.data.carrera,
          facultad: data.data.facultad,
          departamento: data.data.departamento,
        });
      }
    }
    fetchCarrera();
  }, [params.id]);

  const handleChange = (e) => {
    setCarrera({
      ...carrera,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (params.id) {
        await updateCarreraRequest(params.id, carrera);
      } else {
        await createCarreraRequest(carrera);
      }
      setCarrera({
        carrera: "",
        facultad: "",
        departamento: "",
      });
      navigate("/careers");
    } catch (error) {
      console.error("Error al guardar carrera:", error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id ? "Editar Carrera" : "Registrar Nueva Carrera"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="carrera" className="form-label">
                Carrera
              </label>
              <input
                type="text"
                name="carrera"
                className="form-control"
                onChange={handleChange}
                value={carrera.carrera}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="facultad" className="form-label">
                Facultad
              </label>
              <input
                type="text"
                name="facultad"
                className="form-control"
                onChange={handleChange}
                value={carrera.facultad}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="departamento" className="form-label">
                Departamento
              </label>
              <input
                type="text"
                name="departamento"
                className="form-control"
                onChange={handleChange}
                value={carrera.departamento}
                required
              />
            </div>
            <div className="d-flex flex-row-reverse">
              <button type="submit" className="btn btn-primary p-2 ms-2">
                {params.id ? "Actualizar" : "Registrar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary p-2"
                onClick={() => navigate("/careers")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}