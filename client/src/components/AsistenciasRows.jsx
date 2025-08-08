function AsistenciasRows({ asistencia, editar, eliminar, salida }) {

  return (
    <tr>
      {(asistencia.alumno) ? <td>{asistencia.alumno}</td> : null}
      <td>{asistencia.fecha}</td>
      <td>{asistencia.jornada}</td>
      <td>{asistencia.entrada}</td>
      <td>{asistencia.actividad}</td>
      <td>{asistencia.salida}</td>
      {(editar) ? <td>{editar} {eliminar} {salida}</td> : null}
      
    </tr>
  );
}

export default AsistenciasRows;
