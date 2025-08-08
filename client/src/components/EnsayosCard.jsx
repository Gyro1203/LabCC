function EnsayosCard({ ensayo }) {

  const clpFormatter = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
  }).format(value);

  return (
    <div className="card h-100">
      <h2 className="card-header">{ensayo.actividad}</h2>
      <div className="card-body">
        <p className="card-text">Area: {ensayo.area}</p>
        <p className="card-text">Unidad: {ensayo.unidad}</p>
        <p className="card-text">{ensayo.precio_uf} UF</p>
        <p className="card-text">{clpFormatter(ensayo.precio_peso)}</p>
      </div>
    </div>
  );
}

export default EnsayosCard;
