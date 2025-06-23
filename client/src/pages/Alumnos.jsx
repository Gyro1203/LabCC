import { useEffect, useState } from 'react'
import { getAlumnosRequest, deleteAlumnosRequest } from '../services/alumnos.api.js'
import AlumnosCard from '../components/AlumnosCard.jsx';
import { useNavigate } from 'react-router-dom';

function Alumnos() {

  const navigate = useNavigate();

  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataAlumnos = await getAlumnosRequest();
      setAlumnos(dataAlumnos.data);
    };
    fetchData();
  }, [])

  useEffect(() => {
    console.log(window.$.fn);
    // Espera a que la tabla esté en el DOM y alumnos tenga datos
    if (alumnos.length > 0 && window.$) {
      // Destruye la instancia previa si existe
      if (window.$.fn.DataTable.isDataTable('#tabla-alumnos')) {
        window.$('#tabla-alumnos').DataTable().destroy();
      }
      window.$('#tabla-alumnos').DataTable();
    }
  }, [alumnos]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteAlumnosRequest(id);
      console.log("Alumno eliminado exitosamente:", response.data);
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
        <table id="tabla-alumnos" className="display">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Rut</th>
              <th scope="col">Carrera</th>
              <th scope="col">Facultad</th>
              <th scope="col">Departamento</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(alumno => (
              <AlumnosCard 
                key={alumno.id_alumno} 
                alumno={alumno}
                eliminar={
                  <button onClick={() => handleDelete(alumno.id_alumno)}>Eliminar</button>
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
      <h1>Lista de Alumnos</h1>
      {renderAlumnos()}
    </div>
  )
}

export default Alumnos;