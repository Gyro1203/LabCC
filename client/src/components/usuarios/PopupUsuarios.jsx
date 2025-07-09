import Form from './FormUsuarios';
import '@styles/popup.css';
import CloseIcon from '@assets/Login/XIcon.svg';
import QuestionIcon from '@assets/Login/QuestionCircleIcon.svg';
import { createPortal } from 'react-dom';

export default function Popup({ show, setShow, data, action }) {
  const userData = data && data.length > 0 ? data[0] : {};

  const handleSubmit = (formData) => {
    action(formData);
  };

  if (!show) {
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
              title="Editar usuario"
              fields={[
                {
                  label: "Nombre de usuario",
                  name: "nombre_usuario",
                  defaultValue: userData.nombre_usuario || "",
                  placeholder: "Ej: Juan Pérez",
                  fieldType: "input",
                  type: "text",
                  required: true,
                  minLength: 3,
                  maxLength: 50,
                  pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  patternMessage: "Debe contener solo letras y espacios",
                },
                {
                  label: "Rol",
                  name: "rol",
                  fieldType: "select",
                  options: [
                    { value: "Admin", label: "Admin" },
                    { value: "Encargado Lab", label: "Encargado Lab" },
                  ],
                  required: true,
                  defaultValue: userData.rol || "",
                },
                {
                  label: "Correo electrónico",
                  name: "email",
                  defaultValue: userData.email || "",
                  placeholder: "example@gmail.com",
                  fieldType: "input",
                  type: "email",
                  required: true,
                  minLength: 8,
                  maxLength: 50,
                },
                {
                  label: (
                    <span>
                      Nueva contraseña
                      <span className="tooltip-icon">
                        <img src={QuestionIcon} alt="info" />
                        <span className="tooltip-text">
                          Este campo es opcional
                        </span>
                      </span>
                    </span>
                  ),
                  name: "password",
                  placeholder: "**********",
                  fieldType: "input",
                  type: "password",
                  required: false,
                  minLength: 8,
                  maxLength: 26,
                  pattern: /^[a-zA-Z0-9]+$/,
                  patternMessage: "Debe contener solo letras y números",
                },
              ]}
              onSubmit={handleSubmit}
              buttonText="Editar usuario"
              backgroundColor={"#fff"}
            />
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}