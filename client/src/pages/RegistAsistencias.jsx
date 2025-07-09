import { Form, Formik, useFormikContext } from "formik";
import {
  createAsistenciasRequest,
  getAsistenciaByIdRequest,
  updateAsistenciasRequest,
} from "../services/asistencias.api";
import { getIngresosRequest } from "../services/ingresos.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getActividadesByIngresoRequest } from "../services/actividades.api";

export default function RegistAsistencias() {
  const navigate = useNavigate();

  const [asistencia, setAsistencia] = useState({
    rut: "",
    jornada: "Mañana",
    actividad: ""
  }); // Estado para almacenar la asistencia si es necesario, aunque no se usa en este ejemplo

  const [ingresos, setIngresos] = useState([]); // Guarda todos los ingresos
  const [alumno, setAlumno] = useState(null); //Guarda solo los datos ingreso realacionado rut ingresado
  const [actividades, setActividades] = useState([]); // Guarda las actividades relacionda al ingreso "alumno"

  const params = useParams();

  useEffect(() => {   // Datos de Update
    const fetchAsistencia = async () => {
      const dataIngresos = await getIngresosRequest();
      console.log(dataIngresos.data);
      setIngresos(dataIngresos.data);
      if (params.id) {
        try {
          const dataAsistencia = await getAsistenciaByIdRequest(params.id);
          console.log("Asistencia encontrada:", dataAsistencia);
          const {
            alumno: _alumno,
            asistencia_actividad: _asistencia_actividada,
            entrada: _entrada,
            salida: _salida,
            asistencia_ingreso: _asistencia_ingreso,
            ...filtered
          } = dataAsistencia.data; // nombre y rut is assigned but not used. Solucion
          console.log("Asistencia filtrada:", filtered);
          setAsistencia(filtered);
        } catch (error) {
          console.error("Error al obtener la asistencia:", error);
        }
      }
    };
    fetchAsistencia();
  }, [params.id]);

  useEffect(() => {   // Contenido del Select (Actividades)
    const fetchActividades = async () => {
      (!alumno) ? console.log("No") : console.log("SI");
      console.log("Alumno: ",alumno);
      if(alumno && alumno.id_ingreso){
        const dataActvidades = await getActividadesByIngresoRequest(alumno.id_ingreso);
        console.log(dataActvidades.data); //*Estan llegando demaciados datos, revisar eso
        setActividades(dataActvidades.data);
      }else{
        setActividades([]);
      }
    }
    fetchActividades();
  }, [alumno]);

  const BuscarAlumno = ({setAlumno}) => {
    const {values} = useFormikContext();

    useEffect(() => {
      if(values.rut){
        const dataAlumno = ingresos.find(({rut, vigente}) => rut == values.rut && vigente); //o vigente == true;
        console.log("dataAlumno: ",  dataAlumno);
        setAlumno(dataAlumno);
      }
    }, [values.rut, setAlumno]);

    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4 text-center">
            {params.id
              ? "Editar datos de la asistencia"
              : "Registrar nueva asistencia"}
          </h1>

          <Formik
            initialValues={asistencia}
            enableReinitialize={true} // Permite que los valores iniciales se actualicen cuando cambie el estado
            onSubmit={async (values) => {
              try {
                if (params.id) {
                  await updateAsistenciasRequest(params.id, values);
                  console.log("Asistencia actualizada:", values);
                } else {
                  console.log("Valores:", values);
                  const response = await createAsistenciasRequest(values);
                  console.log("Asistencia creada:", response.data);
                }
                setAsistencia({
                  rut: "",
                  jornada: "Mañana",
                  actividad: ""
                });
                navigate("/attendance"); // Redirigir a la lista de asistencias después de crear o actualizar
              } catch (error) {
                console.error("Error al crear asistencia:", error);
              }
            }}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre Alumno
                  </label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    //disable no puede recibir eventos, por lo que onChange no se está ejecutando
                    disabled
                    value={(!alumno) ? "" : alumno.nombre}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="rut" className="form-label">
                    Rut del Alumno
                  </label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    value={values.rut || ""}
                  />
                </div>
                <BuscarAlumno setAlumno={setAlumno} />

                <div className="form-group mb-3">
                  <label htmlFor="jornada" className="form-label">
                    Jornada
                  </label>
                  <select
                    name="jornada"
                    className="form-select"
                    onChange={handleChange}
                    value={values.jornada}
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="actividad" className="form-label">
                    Actividades
                  </label>
                  <select
                    name="actividad"
                    className="form-select"
                    onChange={handleChange}
                    value={values.actividad}
                  >
                    <option value="" disabled hidden>Selecciona una opción</option>
                    {actividades.map((actividad) => (
                      <option key={actividad.id_actividad} value={actividad.actividad}>
                        {actividad.actividad}
                      </option> 
                    ))}
                  </select>
                </div>

                <div className="d-flex flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary p-2"
                  >
                    {isSubmitting ? "Registrando..." : "Registrar"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
