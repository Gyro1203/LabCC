function AsistenciasCard({ asistencia }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{asistencia.alumno}</h2>
      <div className="card-body">
        <p className="card-text">Jornada: {asistencia.jornada}</p>
        <p className="card-text">Entrada: {asistencia.entrada}</p>
        <p className="card-text">Actividad: {asistencia.actividad}</p>
        <p className="card-text">Salida: {asistencia.salida}</p>
      </div>
    </div>
  );
}

export default AsistenciasCard;
