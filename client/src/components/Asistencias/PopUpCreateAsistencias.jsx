import { createPortal } from "react-dom";
import CloseIcon from '@assets/Login/XIcon.svg';
import QuestionIcon from '@assets/Login/QuestionCircleIcon.svg';
import Form from "./FormAsistencias.jsx";
import { useEffect, useState } from "react";
import { getIngresosRequest } from "../../services/ingresos.api.js";
import { useFormikContext } from "formik";

export default function PopUpCreateAsistencias({ show, setShow, data, action }) {
  const [ingresos, setIngresos] = useState([]); // Guarda todos los ingresos
  // const [alumno, setAlumno] = useState(null); //Guarda solo los datos ingreso realacionado rut ingresado
  
  const userData = data && data.length > 0 ? data[0] : {};

  useEffect(() => {
    const fetchAsistencia = async () => {
      const dataIngresos = await getIngresosRequest();
      setIngresos(dataIngresos.data);
    };
    fetchAsistencia();
  }, []);

  const handleSubmit = (formData) => {
    action(formData);
  };

  const BuscarAlumno = () => {
    const { values, setFieldValue } = useFormikContext();
  
    useEffect(() => {
      if (values.rut) {
        const dataAlumno = ingresos.find(
          ({ rut, vigente }) => rut == values.rut && vigente
        );
        // setAlumno(dataAlumno);
        setFieldValue("alumno", dataAlumno ? dataAlumno.nombre : "");
      }
    }, [values.rut, setFieldValue]);

    return null;
  };

  if (!show) {
    // console.log(show);
    return null;
  }
  
  return createPortal(
    <div>
      {show && (
        <div className="popup-bg">
          <div className="popup">
            <button className="close" onClick={() => setShow(false)}>
              <img src={CloseIcon} />
            </button>
            <Form
              title="Registrar Asistencias"
              fields={[
                {
                  label: "Alumno",
                  name: "alumno",
                  defaultValue: userData.nombre_usuario || "",
                  placeholder: "Ej: Juan Pérez",
                  fieldType: "input",
                  type: "text",
                  required: true,
                  minLength: 3,
                  maxLength: 50,
                  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  patternMessage: "Debe contener solo letras y espacios",
                  disabled: true,
                },
                {
                  label: "Rut",
                  name: "rut",
                  defaultValue: userData.rol || "",
                  placeholder: "Ej: 12345678-9",
                  fieldType: "input",
                  type: "text",
                  required: true,
                  minLength: 9,
                  maxLength: 12,
                  pattern: /^\d{7,8}-[kK\d]$/,
                  patternMessage: "Debe tener el formato 12345678-9",
                },
              ]}
              onSubmit={handleSubmit}
              buttonText="Marcar Entrada"
              backgroundColor={"#fff"}
            >
              <BuscarAlumno />
            </Form>
          </div>
        </div>
      )}
    </div>,
    document.body
  ) 
}