function AlumnosCard({ alumno }) {
  return (
    <div className="card h-100">
      <h2 className="card-header">{alumno.nombre}</h2>
      <div className="card-body">
        <p className="card-text">RUT: {alumno.rut}</p>
        <p className="card-text">Carrera: {alumno.carrera}</p>
        <p className="card-text">Facultad: {alumno.facultad}</p>
        <p className="card-text">Departamento: {alumno.departamento}</p>
      </div>
    </div>
  );
}

export default AlumnosCard;
