function ActividadesCard({ actividad }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{actividad.nombre}</h2>
      <div className="card-body">
      <p className="card-text">Unidad: {actividad.unidad}</p>
      <p className="card-text">Cantidad: {actividad.cantidad}</p>
      <p className="card-text">Precio UF: {actividad.precio_uf}</p>
      <p className="card-text">Precio Peso: {actividad.precio_peso}</p>
      <p className="card-text">Total UF: {actividad.total_uf}</p>
      <p className="card-text">Total Peso: {actividad.total_peso}</p>
      <p className="card-text">Observaciones: {actividad.observaciones}</p>
      <p className="card-text">Actividad Alumno: {actividad.actividad_alumno}</p>
      <p className="card-text">Actividad Ensayo: {actividad.actividad_ensayo}</p>
      <p className="card-text">Actividad Ingreso: {actividad.actividad_ingreso}</p>
      </div>
    </div>
  );
}

export default ActividadesCard;
