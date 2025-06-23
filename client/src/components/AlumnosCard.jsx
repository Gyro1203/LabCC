function AlumnosCard({ alumno, eliminar }) {
  return (
    <tr>
      <td>{alumno.nombre}</td>
      <td>{alumno.rut}</td>
      <td>{alumno.carrera}</td>
      <td>{alumno.facultad}</td>
      <td>{alumno.departamento}</td>
      <td>{eliminar}</td>
    </tr>
  );
}

export default AlumnosCard;
