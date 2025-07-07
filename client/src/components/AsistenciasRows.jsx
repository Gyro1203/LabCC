function AsistenciasRows({ asistencia, editar, eliminar, salida }) {
  const {fechaEntrada, horaEntrada, horaSalida} = SetDate(asistencia.entrada, asistencia.salida);

  return (
    <tr>
      {(asistencia.alumno) ? <td>{asistencia.alumno}</td> : null}
      <td>{fechaEntrada}</td>
      <td>{asistencia.jornada}</td>
      <td>{horaEntrada}</td>
      <td>{asistencia.actividad}</td>
      <td>{horaSalida }</td>
      {(editar) ? <td>{editar} {eliminar} {salida}</td> : null}
      
    </tr>
  );
}

function SetDate(dateEntrada, dateSalida){
  const entrada = new Date(dateEntrada);
  let fechaEntrada = entrada.toLocaleString("es-CL",{ dateStyle:"medium" });

  let horaEntrada = entrada.toLocaleString("es-CL",{ timeStyle: "short", hour12: false });

  let horaSalida = null;
  if (dateSalida) {
    const salida = new Date(dateSalida);
    horaSalida = salida.toLocaleString("es-CL", { timeStyle: "short", hour12: false });
  }

  return {fechaEntrada, horaEntrada, horaSalida};
}

export default AsistenciasRows;
