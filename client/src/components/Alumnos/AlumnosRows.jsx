function AlumnosRows({ alumno, editar, eliminar }) {
  return (
    <tr>
      <td>{alumno.nombre}</td>
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
