import { useEffect, useState } from "react";
import {
  getEnsayosRequest,
  deleteEnsayosRequest,
} from "../services/ensayos.api.js";
import EnsayosCard from "../components/EnsayosCard.jsx";
import { useNavigate } from "react-router-dom";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

function Ensayos() {

  DataTable.use(DT);

  const navigate = useNavigate();

  const [ensayos, setEnsayos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataEnsayos = await getEnsayosRequest();
      setEnsayos(dataEnsayos.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
  // Delegación de eventos para el botón eliminar
  const table = document.querySelector('.display');
  if (table) {
    const handler = (event) => {
      if (event.target.classList.contains('btn-eliminar')) {
        const id = event.target.getAttribute('data-id');
        handleDelete(Number(id));
      }
    };
    table.addEventListener('click', handler);
    return () => table.removeEventListener('click', handler);
  }
}, [ensayos]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteEnsayosRequest(id);
      console.log("Ensayo eliminado exitosamente:", response.data);
      setEnsayos(ensayos.filter((e) => e.id_ensayo !== id));
    } catch (error) {
      console.error("Error al eliminar ensayo:", error);
    }
  };  const columns = [
    { title: "Actividad", data: "actividad" },
    { title: "Area", data: "tipo" },
    { title: "Norma", data: "norma" },
    { title: "Unidad", data: "unidad" },
    { title: "UF", data: "precio_uf" },
    {
      title: "$",
      data: "precio_peso",
      render: function (data, type) {
        // Formatea el número con separador de miles y agrega el signo $
        if (type === 'display' || type === 'filter') {
          return '$' + Number(data).toLocaleString('es-CL');
        }
        return data;
      }
    },
    { 
      title:"Boton",
      data: null,
      orderable: false,
      render: function (data, type, row) {
        return `<button class="btn-eliminar btn btn-danger" data-id="${row.id_ensayo}">
          <i id="eliminar" class="fa-solid fa-trash-can"></i>
        </button>`;
      }
    }
  ];

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
        <DataTable 
          data={ensayos}
          columns={columns} 
          className="display" 
        />
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
