function EnsayosRows({ ensayo, editar, eliminar }) {
  return (
    <tr>
      <td>{ensayo.actividad}</td>
      <td>{ensayo.tipo}</td>
      <td>{ensayo.norma}</td>
      <td>{ensayo.unidad}</td>
      <td>{ensayo.precio_uf} UF</td>
      <td>${ensayo.precio_peso}</td>
      <td>{editar} {eliminar}</td>
    </tr>
  );
}

export default EnsayosRows;