import { useEffect, useState } from "react";
import { getAlumnosRequest } from "../../services/alumnos.api";
import { getIngresoByAlumnoRequest } from "../../services/ingresos.api";
import { getActividadesByIngresoRequest } from "../../services/actividades.api";
import IngresoPDF from "./IngresoPDF.jsx";

function ReporteIngresos({ handleChange, values }) {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnSelected, setAlumnSelected] = useState("");
  const [ingresos, setIngresos] = useState([]);
  const [ingSelected, setIngSelected] = useState(null);
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const dataAlumnos = await getAlumnosRequest();
      setAlumnos(dataAlumnos.data);
    }
    fetchData();
  }, []);

  const BuscarAlumno = () => {
    useEffect(() => {
      if (values.nombre) {
        const dataAlumno = alumnos.find(
          ({ nombre }) => nombre == values.nombre
        );
        console.log("dataAlumno: ", dataAlumno);
        setAlumnSelected(dataAlumno);
      }else {
        setAlumnSelected(null);
      }
    }, []);
    return null;
  };

  function GetActivities(id) {
    const fetchAttendance = async () => {
      try {
        const dataActividades = await getActividadesByIngresoRequest(id);
        console.log(dataActividades);
        setActividades(dataActividades.data);
      } catch (error) {
        console.error("Error al obtener el ingreso:", error);
        setActividades([]); // En caso de error el contenido es vacio.
      }
    };
    fetchAttendance();
  }

  useEffect(() => {
    const fetchIngresos = async () => {
      const dataIngresos = await getIngresoByAlumnoRequest(alumnSelected.id_alumno);
      console.log("dataIngresos: ", dataIngresos.data);
      setIngresos(dataIngresos.data);
      setIngSelected(null);
    };
    if(alumnSelected) fetchIngresos();
  }, [alumnSelected]);

  return (
    <div>
      <div className="form-group mb-3">
        <label htmlFor="nombre" className="form-label">
          RUT
        </label>
        <input
          type="text"
          name="rut"
          className="form-control"
          //disable no puede recibir eventos, por lo que onChange no se está ejecutando
          disabled
          value={!alumnSelected ? "" : alumnSelected.rut}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del Alumno
        </label>
        <input
          list="Alumnos"
          name="nombre"
          className="form-control"
          onChange={handleChange}
          value={values.nombre}
        />

        <datalist id="Alumnos">
          {alumnos.map((alumno) => (
            <option key={alumno.id_alumno} value={`${alumno.nombre}`} />
          ))}
        </datalist>
      </div>

      <BuscarAlumno />

      {alumnSelected ? (
        <div className="form-group bg-danger p-2">
          <h3>Registro de ingresos de {alumnSelected.nombre}</h3>
          {ingresos.map((ing, index) => (
            <div className="form-check" key={index}>
              <input 
                className="form-check-input"
                type="radio" 
                name="ingresoRadio" 
                id={`radio-${ing.id_ingreso}`} 
                onChange={() => {
                  setIngSelected(ing || null);
                  GetActivities(ing.id_ingreso);
                }}
              />
              <label className="form-check-label" name="ingresoRadio" htmlFor={`radio-${ing.id_ingreso}`}>
                {ing.vigente ? "✅" : "❌"} ({ing.semestre}) {ing.motivo}: {ing.titulo} 
              </label>
            </div>
            // Mejora -> agregar aviso si encuentra o no asistencias
          ))}
          {ingSelected && <IngresoPDF alumno={alumnSelected} ingreso={ingSelected} actividades={actividades}/>}
        </div>
      ) : (
        <div className="bg-light">No encontrado</div>
      )}
    </div>
  );
}

export default ReporteIngresos