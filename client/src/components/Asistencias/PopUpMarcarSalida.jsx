import { createPortal } from "react-dom";
import CloseIcon from '@assets/Login/XIcon.svg';
import QuestionIcon from '@assets/Login/QuestionCircleIcon.svg';
import Form from "./FormAsistencias.jsx";

export default function PopUpMarcarSalida({ show, setShow, data, action }) {
  
  const dataAsis = data && Object.keys(data).length > 0 ? data : {};

  const handleSubmit = (formData) => {
    action(dataAsis.id_asistencia , formData);
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
                  defaultValue: dataAsis.alumno || "",
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
                  label: "Actividad",
                  name: "actividad",
                  defaultValue: dataAsis.actividad || "",
                  placeholder: "Ingrese aqui la actividad que realizó durante su estadía en el laboratorio",
                  fieldType: "textarea",
                  type: "text",
                  required: true,
                  minLength: 3,
                  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,()1234567890]+$/,
                  patternMessage: "Formato no válido",
                },
              ]}
              onSubmit={handleSubmit}
              buttonText="Marcar Salida"
              backgroundColor={"#fff"}
            >
            </Form>
          </div>
        </div>
      )}
    </div>,
    document.body
  ) 
}