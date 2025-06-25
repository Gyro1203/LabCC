function ActividadesRows({ actividad, index, editar, eliminar }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{actividad.nombre}</td>
      <td>{actividad.alumno}</td>
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