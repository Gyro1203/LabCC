function AlumnosCard({ alumno }) {
  return (
    <>
      <h2 className="list-group-item active text-center">{alumno.nombre}</h2>
      <li className="list-group-item">RUT: {alumno.rut}</li>
      <li className="list-group-item">Carrera: {alumno.carrera}</li>
      <li className="list-group-item">Facultad: {alumno.facultad}</li>
      <li className="list-group-item">Departamento: {alumno.departamento}</li>
    </>
  );
}

export default AlumnosCard;
