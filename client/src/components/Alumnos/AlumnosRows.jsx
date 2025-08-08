import { useNavigate } from "react-router-dom";

function AlumnosRows({ alumno, editar, eliminar }) {
  const navigate = useNavigate();
  return (
    <tr>
      <td
        className="table-cell-hover"
        onClick={() => {
          navigate(`/students/details/${alumno.id_alumno}`);
        }}
      >
        {alumno.nombre}
      </td>
      <td>{alumno.rut}</td>
      <td>{alumno.carrera}</td>
      <td>{alumno.facultad}</td>
      <td>{alumno.departamento}</td>
      <td>{alumno.estado}</td>
      <td>
        <div className="btn-group" role="group" aria-label="Option Buttons">
          {editar} {eliminar}
        </div>
      </td>
    </tr>
  );
}

export default AlumnosRows;
