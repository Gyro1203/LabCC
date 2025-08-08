function EnsayosRows({ ensayo, editar, eliminar }) {
  
  const clpFormatter = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
  }).format(value);

  return (
    <tr>
      <td>{ensayo.actividad}</td>
      <td>{ensayo.area}</td>
      <td>{ensayo.unidad}</td>
      <td>{ensayo.precio_uf} UF</td>
      <td>{clpFormatter(ensayo.precio_peso)}</td>
      <td>{editar} {eliminar}</td>
    </tr>
  );
}

export default EnsayosRows;