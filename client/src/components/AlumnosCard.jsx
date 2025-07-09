function AlumnosCard({ alumno }) {
  return (
    <>
      <h1
        className="list-group-item text-center"
        style={{ 
          color: "#fff",
          backgroundColor: "#014898"
        }}
      >
        {alumno.nombre}
      </h1>
      <li className="list-group-item">RUT: {alumno.rut}</li>
      <li className="list-group-item">Carrera: {alumno.carrera}</li>
      <li className="list-group-item">Facultad: {alumno.facultad}</li>
      <li className="list-group-item">Departamento: {alumno.departamento}</li>
    </>
  );
}

export default AlumnosCard;
