import { Form, Formik, useFormikContext } from "formik";
import {
  createAsistenciasRequest,
  getAsistenciaByIdRequest,
  updateAsistenciasRequest,
} from "../services/asistencias.api";
import { getIngresosRequest } from "../services/ingresos.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function RegistAsistencias() {
  const navigate = useNavigate();

  const [asistencia, setAsistencia] = useState({
    rut: "",
    actividad: "",
  }); // Estado para almacenar la asistencia si es necesario, aunque no se usa en este ejemplo

  const [ingresos, setIngresos] = useState([]); // Guarda todos los ingresos
  const [alumno, setAlumno] = useState(null); //Guarda solo los datos ingreso realacionado rut ingresado

  const params = useParams();

  useEffect(() => {
    // Datos de Update
    const fetchAsistencia = async () => {
      const dataIngresos = await getIngresosRequest();
      setIngresos(dataIngresos.data);
      if (params.id) {
        try {
          const dataAsistencia = await getAsistenciaByIdRequest(params.id);
          const {
            alumno: _alumno,
            asistencia_actividad: _asistencia_actividada,
            fecha: _fecha,
            jornada: _jornada,
            entrada: _entrada,
            salida: _salida,
            asistencia_ingreso: _asistencia_ingreso,
            ...filtered
          } = dataAsistencia.data; // nombre y rut is assigned but not used. Solucion
          // console.log("Asistencia filtrada:", filtered);
          setAsistencia(filtered);
        } catch (error) {
          console.error("Error al obtener la asistencia:", error);
        }
      }
    };
    fetchAsistencia();
  }, [params.id]);

  const BuscarAlumno = ({ setAlumno }) => {
    const { values } = useFormikContext();

    useEffect(() => {
      if (values.rut) {
        const dataAlumno = ingresos.find(
          ({ rut, vigente }) => rut == values.rut && vigente
        ); //o vigente == true;
        setAlumno(dataAlumno);
      }
    }, [values.rut, setAlumno]);

    return null;
  };

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
                } else {
                  await createAsistenciasRequest(values);
                }
                setAsistencia({
                  rut: "",
                  actividad: "",
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
                    value={!alumno ? "" : alumno.nombre}
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
                  <label htmlFor="actividad" className="form-label">
                    Actividad
                  </label>
                  <input
                    type="text"
                    name="actividad"
                    className="form-control"
                    onChange={handleChange}
                    value={values.actividad}
                  />
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
