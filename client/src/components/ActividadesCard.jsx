function ActividadesCard({ actividad }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{actividad.nombre}</h2>
      <div className="card-body">
      <p className="card-text">Unidad: {actividad.unidad}</p>
      <p className="card-text">Cantidad: {actividad.cantidad}</p>
      <p className="card-text">{actividad.precio_uf} UF</p>
      <p className="card-text">${actividad.precio_peso}</p>
      <p className="card-text">Total: {actividad.total_uf} UF</p>
      <p className="card-text">Total: ${actividad.total_peso}</p>
      <p className="card-text">Observaciones: {actividad.observaciones}</p>
      <p className="card-text">Actividad Ensayo: {actividad.actividad_ensayo}</p>
      <p className="card-text">Actividad Ingreso: {actividad.actividad_ingreso}</p>
      </div>
    </div>
  );
}

export default ActividadesCard;
