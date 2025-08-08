import { useEffect, useState } from "react";
import { getIngresoByIdRequest } from "../services/ingresos.api.js";
import { useNavigate, useParams } from "react-router-dom";
import IngresosCard from "../components/IngresosCard.jsx";
import {
  deleteActividadesRequest,
  getActividadesByIngresoRequest,
} from "../services/actividades.api.js";
import ActividadesRows from "../components/ActividadesRows.jsx";

function IngresoDetalles() {
  const navigate = useNavigate();
  const params = useParams();

  const [ingreso, setIngreso] = useState([]);
  const [actividades, setActividades] = useState([]);

  const headers = [
    { id: 1, key: "nombre", label: "Nombre" },
    { id: 2, key: "unidad", label: "Unidad" },
    { id: 3, key: "cantidad", label: "Cantidad" },
    { id: 4, key: "precio_uf", label: "Precio UF" },
    { id: 5, key: "precio_peso", label: "Precio $" },
    { id: 6, key: "total_uf", label: "Total UF" },
    { id: 7, key: "total_peso", label: "Total $" },
    { id: 8, key: "observaciones", label: "Observaciones" },
    { id: 9, key: "opciones", label: "Opciones" },
  ];

  useEffect(() => {
    const fetchIngreso = async () => {
      if (params.id) {
        try {
          const dataIngreso = await getIngresoByIdRequest(params.id);
          //console.log('Ingreso encontrado:', dataIngreso);
          const { ingreso_alumno: _ingreso_alumno, ...filteredIngreso } =
            dataIngreso.data;
          //console.log('Ingreso filtrado:', filtered);
          setIngreso(filteredIngreso);
          const dataActividades = await getActividadesByIngresoRequest(
            filteredIngreso.id_ingreso
          );
          console.log(dataActividades);
          setActividades(dataActividades.data);
        } catch (error) {
          console.error("Error al obtener el ingreso:", error);
        }
      }
    };
    fetchIngreso();
  }, [params.id]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteActividadesRequest(id);
      console.log("Ingreso eliminado exitosamente:", response.data);
      setIngreso(ingreso.filter((e) => e.id_ingreso !== id));
    } catch (error) {
      console.error("Error al eliminar ingreso:", error);
    }
  };

  function renderIngresos() {
    if (ingreso.length === 0) {
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
        <div className="d-flex justify-content-start">
          <button
            className="btn btn-secondary mb-4"
            onClick={() => navigate(`/entry`)}
          >
            Volver
          </button>
        </div>

        <div className="card">
          <IngresosCard ingreso={ingreso} />
          <h2
            className="text-center p-1"
            style={{
              color: "#fff",
              backgroundColor: "#014898",
            }}
          >
            Actividades
          </h2>
          <div className="d-flex align-items-center flex-column mb-2">
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
            <i className="fa-regular fa-calendar-plus"></i> Registrar Actividad
          </button>
          </div>
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header.id}>
                    <span>{header.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actividades.map((actividad) => (
                <ActividadesRows
                  key={actividad.id_actividad}
                  actividad={actividad}
                  editar={
                    <button
                      className="btn btn-primary"
                      title="Editar"
                      onClick={() =>
                        navigate(`/activity/edit/${actividad.id_actividad}`)
                      }
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                  }
                  eliminar={
                    <button
                      className="btn btn-danger"
                      title="Eliminar"
                      onClick={() => handleDelete(actividad.id_actividad)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return <div>{renderIngresos()}</div>;
}

export default IngresoDetalles;
