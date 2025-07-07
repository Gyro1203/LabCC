function ActividadesRows({ actividad  , editar, eliminar }) {
  return (
    <tr>
      <td>{actividad.nombre}</td>
      {(actividad.alumno) ? <td>{actividad.alumno}</td> : null}
      <td>{actividad.unidad}</td>
      <td>{actividad.cantidad}</td>
      <td>{actividad.precio_uf} UF</td>
      <td>${actividad.precio_peso}</td>
      <td>{actividad.total_uf} UF</td>
      <td>${actividad.total_peso}</td>
      <td>{actividad.observaciones}</td>
      <td>
        {editar}
        {eliminar}
      </td>
    </tr>
  );
}

export default ActividadesRows;