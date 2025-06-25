function IngresosRows({ ingreso, index, editar, eliminar, registrar }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{ingreso.nombre}</td>
      <td>{ingreso.rut}</td>
      <td>{ingreso.motivo}</td>
      <td>{ingreso.titulo}</td>
      <td>{ingreso.profesor_guia}</td>
      <td>{ingreso.profesor_asignatura}</td>
      <td>{ingreso.semestre}</td>
      <td>{ingreso.vigente ? "✅" : "❌"}</td>
      <td>{editar} {eliminar} {registrar}</td>
    </tr>
  );
}

export default IngresosRows;