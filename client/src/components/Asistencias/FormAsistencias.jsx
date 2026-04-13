import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import "@styles/form.css";
import HideIcon from "@assets/Login/HideIcon.svg";
import ViewIcon from "@assets/Login/ViewIcon.svg";

const Form = ({
  title,
  fields,
  buttonText,
  onSubmit, // Esto es lo que se pasa al "onSubmit" de Formik
  footerContent,
  backgroundColor,
  children,
}) => {
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const validate = (values) => {
    const errors = {};
    fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        errors[field.name] = "Este campo es obligatorio";
      }
      if (field.minLength && values[field.name] && values[field.name].length < field.minLength) {
        errors[field.name] = `Debe tener al menos ${field.minLength} caracteres`;
      }
      if (field.maxLength && values[field.name] && values[field.name].length > field.maxLength) {
        errors[field.name] = `Debe tener máximo ${field.maxLength} caracteres`;
      }
      if (field.pattern && values[field.name] && !field.pattern.test(values[field.name])) {
        errors[field.name] = field.patternMessage || "Formato no válido";
      }
    });
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <FormikForm
          className="form"
          style={{ backgroundColor: backgroundColor }}
          autoComplete="off"
        >
          {children}
          <h1>{title}</h1>
          {fields.map((field, index) => (
            <div className="container_inputs" key={index}>
              {field.label && <label htmlFor={field.name}>{field.label}</label>}
              {field.fieldType === "input" && (
                <Field
                  name={field.name}
                  placeholder={field.placeholder}
                  type={field.type}
                  as="input"
                  disabled={field.disabled}
                  className={field.disabled ? "disabled" : ""}
                />
              )}
              {field.fieldType === "textarea" && (
                <Field
                  name={field.name}
                  placeholder={field.placeholder}
                  as="textarea"
                  disabled={field.disabled}
                  className={field.disabled ? "disabled" : ""}
                />
              )}
              <ErrorMessage name={field.name}>
                {(msg) => <div className="error-message visible">{msg}</div>}
              </ErrorMessage>
              {field.disabled && (
                <small className="form-text text-muted">
                  Este campo se rellenará automaticamente.
                </small>
              )}
            </div>
          ))}
          {buttonText && (
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : buttonText}
            </button>
          )}
          {footerContent && <div className="footerContent">{footerContent}</div>}
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
