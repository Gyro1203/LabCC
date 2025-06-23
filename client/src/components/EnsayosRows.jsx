function EnsayosRows({ ensayo, index, eliminar }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{ensayo.actividad}</td>
      <td>{ensayo.tipo}</td>
      <td>{ensayo.norma}</td>
      <td>{ensayo.unidad}</td>
      <td>{ensayo.precio_uf} UF</td>
      <td>${ensayo.precio_peso}</td>
      <td>{eliminar}</td>
    </tr>
  );
}

export default EnsayosRows;