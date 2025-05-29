import { useEffect, useState } from 'react'
import { getAlumnosRequest, deleteAlumnosRequest } from '../services/alumnos.api.js'
import AlumnosCard from '../components/AlumnosCard.jsx';
import { useNavigate } from 'react-router-dom';

function Alumnos() {

  const navigate = useNavigate();

  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAlumnosRequest();
      setAlumnos(data.alumnos);
    };
    fetchData();
  }, [])

  const handleDelete = async (id) => {
    try {
      const response = await deleteAlumnosRequest(id);
      console.log("Alumno eliminado exitosamente:", response);
      setAlumnos(alumnos.filter(a => a.id_alumno !== id));
    } catch (error) {
      console.error("Error al eliminar alumno:", error);
    }
  }

  function renderAlumnos() {

    if(alumnos.length === 0) {
      return <>
        <p>No hay alumnos registrados</p>
        <button onClick={() => navigate(`/students/register`)}>Registar Alumno</button>
      </>
    }

    return(
      <div className="container mt-4">
        <button onClick={() => navigate(`/students/register`)}>Registar Alumno</button>
        <div className="row" >
          {alumnos.map(alumno => (
            <div key={alumno.id_alumno} className="col-sm-12 col-md-6 col-lg-4 mb-4">
              <AlumnosCard alumno={alumno} />
              <button onClick={() => handleDelete(alumno.id_alumno)}>Eliminar</button>
              <button onClick={() => navigate(`/students/edit/${alumno.id_alumno}`)}>Editar</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Lista de Alumnos</h1>
      {renderAlumnos()}
    </div>
  )
}

export default Alumnos;